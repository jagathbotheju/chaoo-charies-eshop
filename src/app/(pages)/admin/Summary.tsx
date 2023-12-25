"use client";

import Heading from "@/components/Heading";
import { formatNumber } from "@/utils/formatNumber";
import { formatPrice } from "@/utils/formatPrice";
import { Order, Product, User } from "@prisma/client";
import { useEffect, useState } from "react";

interface Props {
  orders: Order[] | null;
  products: Product[] | null;
  users: User[] | null;
}

type SummaryData = {
  [key: string]: {
    label: string;
    digit: number;
  };
};

const Summary = ({ orders, products, users }: Props) => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    sale: {
      label: "Total Sale",
      digit: 0,
    },
    products: {
      label: "Total Products",
      digit: 0,
    },
    orders: {
      label: "Total Orders",
      digit: 0,
    },
    paidOrders: {
      label: "Paid Orders",
      digit: 0,
    },
    unpaidOrders: {
      label: "Unpaid Orders",
      digit: 0,
    },
    users: {
      label: "Total Users",
      digit: 0,
    },
  });

  useEffect(() => {
    if (!orders || !products || !users) return;

    setSummaryData((prev) => {
      let tempData = { ...prev };

      const totalSale = orders.reduce((acc, item) => {
        if (item.status === "complete") {
          return acc + item.amount;
        } else return acc;
      }, 0);

      const paidOrders = orders.filter((order) => {
        return order.status === "complete";
      });

      const unpaidOrders = orders.filter((order) => {
        return order.status === "pending";
      });

      tempData.sale.digit = totalSale;
      tempData.orders.digit = orders.length;
      tempData.paidOrders.digit = paidOrders.length;
      tempData.unpaidOrders.digit = unpaidOrders.length;
      tempData.products.digit = products.length;
      tempData.users.digit = users.length;

      return tempData;
    });
  }, [orders, products, users]);

  const summaryKeys = Object.keys(summaryData);

  return (
    <div className="flex mx-auto flex-col max-w-4xl">
      <div className="mb-4 mt-8">
        <Heading title="Status" center />
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {summaryKeys &&
          summaryKeys.map((key) => (
            <div
              key={key}
              className="rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition hover:bg-slate-50"
            >
              <div className="text-xl md:text-4xl font-bold">
                {summaryData[key].label === "Total Sale" ? (
                  <>{formatPrice(summaryData[key].digit)}</>
                ) : (
                  <>{formatNumber(summaryData[key].digit)}</>
                )}
              </div>

              <div>{summaryData[key].label}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Summary;
