import Heading from "@/components/Heading";
import { formatPrice } from "@/utils/formatPrice";
import { Order, User } from "@prisma/client";
import moment from "moment";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

interface Props {
  orders: Order[];
}

type ExtendedOrder = Order & {
  user: User;
};

const ManageOrdersClient = ({ orders }: Props) => {
  const data = orders.map((order) => {
    const extOrder = order as ExtendedOrder;
    return {
      id: order.id,
      customer: extOrder.user.name ?? "unknown",
      amount: formatPrice(extOrder.amount / 100),
      paymentStatus: extOrder.status,
      date: moment(extOrder.createdAt).fromNow(),
      deliveryStatus: extOrder.deliveryStatus ?? "pending",
    };
  });

  return (
    <div>
      <div className="mb-4 mt-8">
        <Heading title="Manage Orders" center />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ManageOrdersClient;
