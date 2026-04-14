"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { transactionsAPI } from "@/lib/api-client";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/auth-context";

const transactionSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number()
    .positive("Quantity must be positive")
    .lte(10000, "Quantity seems too large, please verify"),
  transactionType: z.enum(["IN", "OUT"], {
    message: "Type is required",
  }),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

// Extend the type to include performedBy for the API call
type TransactionAPIData = TransactionFormValues & { performedBy: string };

interface AddTransactionDialogProps {
  onTransactionAdded: () => void;
  products: Array<{ _id: string; name: string }>;
  users: Array<{ _id: string; name: string }>;
}

export function AddTransactionDialog({
  onTransactionAdded,
  products,
  users,
}: AddTransactionDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useAuth();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionFormValues>,
    defaultValues: {
      productId: "",
      quantity: 1,
      transactionType: "IN",
      notes: "",
    },
  });

  async function onSubmit(data: TransactionFormValues) {
    if (!user) {
      toast.error("You must be logged in to create a transaction");
      return;
    }

    // Show confirmation for large quantities or OUT transactions
    if (data.quantity > 1000) {
      const confirmed = window.confirm(
        `Are you sure you want to record a transaction for ${data.quantity} units? This seems like a large quantity.`
      );
      if (!confirmed) return;
    }

    if (data.transactionType === "OUT" && data.quantity > 100) {
      const confirmed = window.confirm(
        `Are you sure you want to remove ${data.quantity} units from inventory? This seems like a large OUT transaction.`
      );
      if (!confirmed) return;
    }

    setIsLoading(true);
    try {
      // Automatically set performedBy to the current user
      const transactionData: TransactionAPIData = {
        ...data,
        performedBy: user.id,
      };

      await transactionsAPI.create(transactionData);

      toast.success("Transaction recorded successfully");

      form.reset({
        productId: "",
        quantity: 1,
        transactionType: "IN",
        notes: "",
      });
      setOpen(false);
      onTransactionAdded();
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; details?: string } };
      };
      const errorMessage =
        err?.response?.data?.error || "Failed to create transaction";
      const details = err?.response?.data?.details;
      toast.error(details ? `${errorMessage}: ${details}` : errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record New Transaction</DialogTitle>
          <DialogDescription>
            Record a stock movement (IN or OUT) for a product.
          </DialogDescription>
        </DialogHeader>

        <Form<TransactionFormValues> {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField<TransactionFormValues>
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((prod) => (
                        <SelectItem key={prod._id} value={prod._id}>
                          {prod.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<TransactionFormValues>
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="IN or OUT" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IN">IN (Add stock)</SelectItem>
                      <SelectItem value="OUT">OUT (Remove stock)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<TransactionFormValues>
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<TransactionFormValues>
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Transaction notes"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="size-4" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Record Transaction"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
