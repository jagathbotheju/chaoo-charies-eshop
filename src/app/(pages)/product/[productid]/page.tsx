import Container from "@/components/Container";
import ListRating from "@/components/ListRating";
import ProductDetails from "@/components/ProductDetails";
import { product } from "@/utils/product";

interface Props {
  params: {
    productid: string;
  };
}

const ProductDetailsPage = ({ params }: Props) => {
  console.log("params", params.productid);
  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />

        {/* ratings */}
        <div className="flex flex-col mt-20 gap-4">
          <div>Add Ratings</div>
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailsPage;
