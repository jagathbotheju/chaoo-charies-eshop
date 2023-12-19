"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { updateStock } from "@/utils/serverActions";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ColumnType = {
  id: string;
  date: string;
  amount: string;
  paymentStatus: string;
  deliveryStatus: string;
};

export const columns: ColumnDef<ColumnType>[] = [
  {
    accessorKey: "id",
    header: "id",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Link
          className="text-blue-700 hover:underline"
          href={`/order/${data.id}`}
        >
          {data.id}
        </Link>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Badge
          className={
            data.paymentStatus === "pending" ? "bg-slate-500" : "bg-green-500"
          }
        >
          {data.paymentStatus === "pending" ? "Pending" : "Complete"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "deliveryStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Badge
          className={cn("font-semibold text-white tracking-widest", {
            "bg-yellow-500": data.deliveryStatus === "pending",
            "bg-amber-700": data.deliveryStatus === "dispatched",
            "bg-green-600": data.deliveryStatus === "delivered",
          })}
        >
          {data.deliveryStatus}
        </Badge>
      );
    },
  },
];
