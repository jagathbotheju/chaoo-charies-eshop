"use client";
import { Badge } from "@/components/ui/badge";
import { ColumnType } from "./Columns";
import { deleteProduct, getProduct, updateStock } from "@/utils/serverActions";
import { useEffect, useState, useTransition } from "react";
import { Delete, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Product, User } from "@prisma/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  data: ColumnType;
}

const DataTableInStock = ({ data }: Props) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const [inStock, setInStock] = useState<boolean>(data.inStock);
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <div className="flex justify-between">
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

      {/* delete */}
      <Trash2
        className="text-rose-500 h-5 w-5 cursor-pointer"
        onClick={() => {
          startTransition(() => {
            deleteProduct({ user, productId: data.id })
              .then((response) => {
                if (response.success) {
                  toast.success(response.message);
                  router.refresh();
                } else {
                  toast.error(response.message);
                }
              })
              .catch((error) => {
                toast.error("Error deleting product");
              });
          });
        }}
      />
    </div>
  );
};

export default DataTableInStock;
