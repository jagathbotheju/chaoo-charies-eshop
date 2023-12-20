import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
//import { products } from "@/utils/products";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
import ProductCard from "./(pages)/product/ProductCard";
import { getProducts } from "@/utils/serverActions";
import { Product } from "@prisma/client";
import { ExtProduct } from "./(pages)/product/ProductDetails";

interface Props {
  searchParams: {
    category?: string;
    label?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const res = await getProducts(searchParams);
  const products = res.data as ExtProduct[];

  console.log(products.length);

  return (
    <div className="p-8">
      <Container>
        <div>
          <HomeBanner />
        </div>

        {products.length ? (
          <>
            {/* products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
              {products.map((product) => (
                <div key={product.id}>
                  {/* {truncateText(product.name)} */}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="text-2xl font-bold">
                No Products found for {searchParams.category}
              </h3>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
