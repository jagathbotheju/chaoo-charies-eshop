"use client";

import { Product } from "@prisma/client";
import Image from "next/image";

interface Props {
  cartProduct: CartProduct;
  product: Product;
  handleColorSelect: (value: SelectedImg) => void;
}

const ProductImage = ({ cartProduct, product, handleColorSelect }: Props) => {
  return (
    <div className="grid grid-cols-6 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      {/* thumb nails */}
      <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
        {product.image.map((image: SelectedImg) => {
          return (
            <div
              key={image.color}
              onClick={() => handleColorSelect(image)}
              className={`relative w-[80%] aspect-square rounded border-teal-300 ${
                cartProduct.selectedImg.color === image.color && "border-2"
              } `}
            >
              <Image
                src={image.image}
                alt={image.color}
                fill
                className="object-contain p-1"
              />
            </div>
          );
        })}
      </div>

      {/* image */}
      <div className="relative col-span-5 aspect-square">
        <Image
          fill
          className="w-full h-full object-contain max-h-[500px] min-h-[300px] sm:min-h-[400px]"
          src={cartProduct.selectedImg.image}
          alt={cartProduct.name}
        />
      </div>
    </div>
  );
};

export default ProductImage;
