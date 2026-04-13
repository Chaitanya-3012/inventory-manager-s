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
import { productsAPI } from "@/lib/api-client";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/auth-context";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100, "Product name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  price: z.coerce.number()
    .min(0, "Price must be non-negative")
    .max(1000000, "Price seems too high, please verify"),
  costPrice: z.coerce.number()
    .min(0, "Cost price must be non-negative")
    .max(1000000, "Cost price seems too high, please verify"),
  quantity: z.coerce.number()
    .min(0, "Quantity must be non-negative")
    .max(1000000, "Quantity seems too large, please verify"),
  category: z.string().min(1, "Category is required").max(50, "Category name is too long"),
  supplierId: z.string().min(1, "Supplier is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Extend the type to include createdBy for the API call
type ProductAPIData = ProductFormValues & { createdBy: string };

interface AddProductDialogProps {
  onProductAdded: () => void;
  suppliers: Array<{ _id: string; name: string }>;
  users: Array<{ _id: string; name: string }>;
}

export function AddProductDialog({
  onProductAdded,
  suppliers,
  users,
}: AddProductDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useAuth();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      costPrice: 0,
      quantity: 0,
      category: "",
      supplierId: "",
    },
  });

  async function onSubmit(data: ProductFormValues) {
    if (!user) {
      toast.error("You must be logged in to create a product");
      return;
    }

    // Show confirmation for potentially incorrect data
    if (data.price > 0 && data.costPrice > 0 && data.price < data.costPrice) {
      const confirmed = window.confirm(
        `The selling price ($${data.price}) is less than the cost price ($${data.costPrice}). This will result in a loss on each sale. Are you sure you want to continue?`
      );
      if (!confirmed) return;
    }

    if (data.price > 10000) {
      const confirmed = window.confirm(
        `The selling price ($${data.price}) seems very high. Are you sure this is correct?`
      );
      if (!confirmed) return;
    }

    setIsLoading(true);
    try {
      // Automatically set createdBy to the current user
      const productData: ProductAPIData = {
        ...data,
        createdBy: user.id,
      };

      await productsAPI.create(productData);

      toast.success("Product created successfully");

      form.reset();
      setOpen(false);
      onProductAdded();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const errorMessage =
        err?.response?.data?.error || "Failed to create product";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the product details below to add a new product to your
            inventory.
          </DialogDescription>
        </DialogHeader>

        <Form<ProductFormValues> {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField<ProductFormValues>
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<ProductFormValues>
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product description (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField<ProductFormValues>
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField<ProductFormValues>
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField<ProductFormValues>
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<ProductFormValues>
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<ProductFormValues>
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string | undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((sup) => (
                        <SelectItem key={sup._id} value={sup._id}>
                          {sup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
