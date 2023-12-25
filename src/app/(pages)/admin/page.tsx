import Container from "@/components/Container";
import Summary from "./Summary";
import {
  getChartData,
  getOrders,
  getProducts,
  getUsers,
} from "@/utils/serverActions";
import { Order, Product, User } from "@prisma/client";
import BarChart from "@/components/BarChart";

const AdminPage = async () => {
  const resProducts = await getProducts({ category: null });
  const resOrders = await getOrders();
  const resUsers = await getUsers();
  const resChartData = await getChartData();

  const products = resProducts.success ? (resProducts.data as Product[]) : null;
  const orders = resOrders.success ? (resOrders.data as Order[]) : null;
  const users = resUsers.success ? (resUsers.data as User[]) : null;
  const chartData = resChartData.data;

  return (
    <div className="pt-8">
      <Container>
        <Summary orders={orders} products={products} users={users} />
        <div className="mt-4 mx-auto max-w-4xl">
          <BarChart data={chartData} />
        </div>
      </Container>
    </div>
  );
};

export default AdminPage;
