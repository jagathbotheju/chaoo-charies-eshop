import Heading from "@/components/Heading";
import { DataTable } from "@/utils/dataTable";
import { formatPrice } from "@/utils/formatPrice";
import { Order } from "@prisma/client";
import moment from "moment";
import { columns } from "./Columns";

interface Props {
  orders: Order[];
}

const OrderClient = ({ orders }: Props) => {
  console.log(orders);
  const data = orders.map((order) => {
    return {
      id: order.id,
      date: moment(order.createdAt).fromNow(),
      amount: formatPrice(order.amount / 100),
      paymentStatus: order.status,
      deliveryStatus: order.deliveryStatus ?? "pending",
    };
  });

  return (
    <div>
      <div className="mb-4 mt-8">
        <Heading title="My Orders" center />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default OrderClient;
