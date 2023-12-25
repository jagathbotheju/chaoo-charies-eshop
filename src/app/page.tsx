import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import { getProducts } from "@/utils/serverActions";
import ProductCard from "./(pages)/product/ProductCard";
import { ExtProduct } from "./(pages)/product/ProductDetails";
//export const revalidate=0

interface Props {
  searchParams: {
    category?: string;
    label?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const res = await getProducts(searchParams);
  const products = res.data as ExtProduct[];

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
