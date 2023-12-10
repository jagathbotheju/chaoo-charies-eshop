import Container from "@/components/Container";
import ManageProductClient from "./ManageProductClient";
import { getProducts } from "@/utils/serverActions";
import { Product } from "@prisma/client";

const AdminManageProducts = async () => {
  const response = await getProducts({ category: null });
  const products = response?.data as Product[];

  return (
    <Container>
      <ManageProductClient products={products} />
    </Container>
  );
};

export default AdminManageProducts;
