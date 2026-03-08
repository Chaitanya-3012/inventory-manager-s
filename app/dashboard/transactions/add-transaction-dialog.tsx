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

const transactionSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  transactionType: z.enum(["IN", "OUT"], {
    required_error: "Type is required",
  }),
  performedBy: z.string().min(1, "Performed by is required"),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

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

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionFormValues>,
    defaultValues: {
      productId: "",
      quantity: 1,
      transactionType: "IN",
      performedBy: "",
      notes: "",
    },
  });

  async function onSubmit(data: TransactionFormValues) {
    setIsLoading(true);
    try {
      await transactionsAPI.create(data);

      toast.success("Transaction recorded successfully");

      form.reset({
        productId: "",
        quantity: 1,
        transactionType: "IN",
        performedBy: "",
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
              name="performedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Performed By</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
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
