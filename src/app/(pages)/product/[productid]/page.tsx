import Container from "@/components/Container";
import ListRating from "@/components/ListRating";
import ProductDetails, {
  ExtProduct,
} from "@/app/(pages)/product/ProductDetails";
import { products } from "@/utils/products";
import { getProduct } from "@/utils/serverActions";
import { Product, User } from "@prisma/client";
import AddRating from "@/components/AddRating";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
//import { product } from "@/utils/product";

interface Props {
  params: {
    productid: string;
  };
}

const ProductDetailsPage = async ({ params }: Props) => {
  const res = await getProduct(params.productid);
  const product = res.data as ExtProduct;

  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />

        {/* ratings */}
        <div className="flex flex-col mt-20 gap-4">
          <AddRating product={product} />
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailsPage;
