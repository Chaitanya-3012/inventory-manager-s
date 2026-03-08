"use client";

import { ColumnDef } from "@tanstack/react-table";

export type SupplierRow = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  paymentTerms?: string;
  isActive?: boolean;
  createdAt?: string;
};

export const supplierColumns: ColumnDef<SupplierRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "paymentTerms",
    header: "Payment Terms",
    cell: ({ row }) => {
      const terms = row.getValue("paymentTerms") as string | undefined;
      return terms || "N/A";
    },
  },
];
