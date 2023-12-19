import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
//import { products } from "@/utils/products";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
import ProductCard from "./(pages)/product/ProductCard";
import { getProducts } from "@/utils/serverActions";
import { Product } from "@prisma/client";
import { ExtProduct } from "./(pages)/product/ProductDetails";

export default async function Home() {
  const res = await getProducts({});
  const products = res.data as ExtProduct[];

  return (
    <div className="p-8">
      <Container>
        <div>
          <HomeBanner />
        </div>

        {/* products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {products.map((product) => (
            <div key={product.id}>
              {/* {truncateText(product.name)} */}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
