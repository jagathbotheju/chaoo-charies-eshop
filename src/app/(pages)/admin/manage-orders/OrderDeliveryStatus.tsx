"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnType } from "./Columns";
import { cn } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import { updateOrderDeliveryStatus } from "@/utils/serverActions";
import { toast } from "react-toastify";

interface Props {
  data: ColumnType;
}

const OrderDeliveryStatus = ({ data }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string>(data.deliveryStatus);

  useEffect(() => {
    if (data.deliveryStatus) {
      setStatus(data.deliveryStatus);
    }
  }, [data.deliveryStatus]);

  return (
    <Select
      onValueChange={(value) => {
        if (data.paymentStatus !== "complete") {
          return toast.error("Payment not received");
        }
        startTransition(() => {
          if (value !== status) {
            updateOrderDeliveryStatus({
              orderId: data.id,
              deliveryStatus: value,
            })
              .then((res) => {
                if (res.success && res.data) {
                  setStatus(res.data);
                  toast.success(res.message);
                } else {
                  toast.error(res.message);
                }
              })
              .catch((err) => {
                toast.error(err.message);
              });
          }
        });
      }}
    >
      <SelectTrigger
        className={cn("w-[150px] font-semibold text-white tracking-widest", {
          "bg-yellow-500": status === "pending",
          "bg-amber-700": status === "dispatched",
          "bg-green-600": status === "delivered",
        })}
      >
        <SelectValue placeholder={status.toUpperCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="pending">PENDING</SelectItem>
          <SelectItem value="dispatched">DISPATCHED</SelectItem>
          <SelectItem value="delivered">DELIVERED</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default OrderDeliveryStatus;
