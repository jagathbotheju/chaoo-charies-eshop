import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { getOrderByUserId } from "@/utils/serverActions";
import { serverUser } from "@/utils/serverUser";
import { Order } from "@prisma/client";
import OrderClient from "./OrderClient";

const OrderPage = async () => {
  const user = await serverUser();
  const res = await getOrderByUserId(user.id);
  const orders = res.data as Order[];

  if (!orders) {
    return (
      <Container>
        <div className="mt-10 rounded-md bg-red-50">
          <h2 className="text-2xl font-bold">No Orders Found!</h2>
        </div>
      </Container>
    );
  }

  return (
    <div className="mt-8">
      <Container>
        <OrderClient orders={orders} />
      </Container>
    </div>
  );
};

export default OrderPage;
