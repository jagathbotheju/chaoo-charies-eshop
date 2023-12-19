import Container from "@/components/Container";
import ManageOrdersClient from "./ManageOrdersClient";
import { getOrders } from "@/utils/serverActions";
import { Order } from "@prisma/client";

const AdminManageOrders = async () => {
  const response = await getOrders();
  const orders = response?.data as Order[];

  return (
    <Container>
      <ManageOrdersClient orders={orders} />
    </Container>
  );
};

export default AdminManageOrders;
