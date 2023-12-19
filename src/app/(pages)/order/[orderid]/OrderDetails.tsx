import Heading from "@/components/Heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatPrice";
import { Address, CartProduct, Order, User } from "@prisma/client";
import moment from "moment";
import OrderItem from "./OrderItem";

interface Props {
  order: Order;
}

const OrderDetails = ({ order }: Props) => {
  return (
    <div className="flex flex-col mx-auto gap-2">
      <Heading title="Order Details" />

      {/* details */}
      <div className="grid grid-cols-4 max-w-2xl mb-5">
        <div className="flex flex-col bg-slate-100 font-semibold p-2 gap-1">
          <p>Order ID</p>
          <p>Order Date</p>
          <p>Total Amount</p>
          <p>Payment Status</p>
          <p>Delivery Status</p>
        </div>
        <div className="col-span-3 bg-slate-50 p-2 gap-1 flex flex-col">
          <p>{order.id}</p>
          <p>
            {order.createdAt.toDateString()},{" "}
            {moment(order.createdAt).fromNow()}
          </p>
          <p>{formatPrice(order.amount / 100)}</p>

          <Badge
            className={cn("tracking-widest uppercase block w-fit", {
              "bg-yellow-700 text-yellow-300": order.status === "pending",
              "bg-green-700 text-green-300": order.status === "complete",
            })}
          >
            {order.status}
          </Badge>
          <Badge
            className={cn("tracking-widest uppercase block w-fit", {
              "bg-yellow-500 text-yellow-200":
                order.deliveryStatus === "pending",
              "bg-amber-700 text-amber-200":
                order.deliveryStatus === "dispatched",
              "bg-green-700 text-green-300":
                order.deliveryStatus === "delivered",
            })}
          >
            {order.deliveryStatus}
          </Badge>
        </div>
      </div>

      {/* product details */}
      <Heading title="Order Items" />
      <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center uppercase">
        <div className="col-span-2 justify-self-start">product</div>
        <div className="justify-self-center">price</div>
        <div className="justify-self-center">qty</div>
        <div className="justify-self-end">total</div>
      </div>
      {order.products &&
        order.products.map((product) => (
          <OrderItem key={product.id} product={product} />
        ))}
    </div>
  );
};

export default OrderDetails;
