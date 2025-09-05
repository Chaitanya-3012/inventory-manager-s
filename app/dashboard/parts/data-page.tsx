"use client";
import { useState, useEffect } from "react";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";
import Toolbar from "./toolbar";
import AddMenu from "./addMenu";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}

export default function DataPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Payment[]>([]);

  // Fetch data on mount
  useEffect(() => {
    getData().then(setData);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Toolbar onAddClick={() => setIsOpen(true)} />
      <DataTable columns={columns} data={data} />
      {isOpen && <AddMenu setIsOpen={setIsOpen} />}
    </div>
  );
}
