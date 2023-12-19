"use client";
import { formatPrice } from "@/utils/formatPrice";
import { Rating } from "@mui/material";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExtProduct } from "./ProductDetails";

interface Props {
  product: ExtProduct;
}

const ProductCard = ({ product }: Props) => {
  const router = useRouter();
  const productRating =
    product?.reviews?.reduce((acc: number, item: any) => acc + item.rating, 0) /
      product?.reviews?.length ?? 0;

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition duration-300 hover:scale-105 text-center text-sm flex justify-center"
    >
      <div className="flex flex-col w-full gap-1">
        <div className="w-full aspect-square overflow-hidden relative">
          <Image
            fill
            src={product.image[0].image}
            className="w-full h-full object-contain"
            alt={product.name}
          />
        </div>
        <p className="line-clamp-1 mt-4">{product.name}</p>

        {/* rating */}
        <Rating value={productRating} readOnly />

        <p>{product.reviews.length} reviews</p>
        <p className="font-semibold">{formatPrice(product.price / 100)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
