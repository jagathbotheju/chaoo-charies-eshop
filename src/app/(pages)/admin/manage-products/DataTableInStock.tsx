"use client";
import { Badge } from "@/components/ui/badge";
import { ColumnType } from "./Columns";
import { updateStock } from "@/utils/serverActions";
import { useState, useTransition } from "react";

interface Props {
  data: ColumnType;
}

const DataTableInStock = ({ data }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [inStock, setInStock] = useState<boolean>(data.inStock);

  return (
    <div>
      <Badge
        onClick={() => {
          startTransition(() => {
            updateStock(data.id, inStock).then((response) => {
              if (response.success && response.data) {
                setInStock(response.data?.inStock);
              }
            });
          });
        }}
        className={`${
          inStock
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-600 hover:bg-red-700"
        } cursor-pointer hover:shadow-md`}
      >
        {inStock ? "in-stock" : "out-of-stock"}
      </Badge>
    </div>
  );
};

export default DataTableInStock;
