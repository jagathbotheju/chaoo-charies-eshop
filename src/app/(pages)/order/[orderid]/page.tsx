import Container from "@/components/Container";
import ListRating from "@/components/ListRating";
import ProductDetails from "@/app/(pages)/product/ProductDetails";
import { products } from "@/utils/products";
import { getOrderById } from "@/utils/serverActions";
import OrderDetails from "./OrderDetails";
import { Loader2 } from "lucide-react";
import { Order } from "@prisma/client";
//import { product } from "@/utils/product";

interface Props {
  params: {
    orderid: string;
  };
}

const OrderDetailsPage = async ({ params }: Props) => {
  const res = await getOrderById(params.orderid);
  const order = res.order as Order;

  if (!res.success && !res.order)
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );

  return (
    <div className="p-8">
      <Container>
        <OrderDetails order={order} />
      </Container>
    </div>
  );
};

export default OrderDetailsPage;
