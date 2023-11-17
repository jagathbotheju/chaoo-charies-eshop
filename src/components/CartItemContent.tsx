"use client";

import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import Link from "next/link";
import SetQuantity from "./SetQuantity";
import { useCart } from "@/hooks/useCart";

interface Props {
  item: CartProduct;
}

const CartItemContent = ({ item }: Props) => {
  const { removeProductFromCart, handleQtyIncrease, handleQtyDecrease } =
    useCart();

  return (
    <div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] py-4 items-center border-slate-200">
      {/* product details */}
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <Link href={`/product/${item.id}`}>
          <div className="relative w-[70px] aspect-square">
            <Image
              src={item.selectedImg.image}
              alt={item.name}
              fill
              className="object-contain"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <Link href={`/product/${item.id}`}>{item.name}</Link>
          <div>{item.selectedImg.color}</div>
          <button
            onClick={() => removeProductFromCart(item.id)}
            className="text-pink-500 underline w-fit"
          >
            Remove
          </button>
        </div>
      </div>

      {/* price */}
      <div className="justify-self-center">{formatPrice(item.price)}</div>

      {/* quantity */}
      <div className="justify-self-center">
        <SetQuantity
          cartCounter
          cartProduct={item}
          handleQtyDecrease={() => handleQtyDecrease(item.id)}
          handleQtyIncrease={() => handleQtyIncrease(item.id)}
        />
      </div>

      {/* total price */}
      <div className="justify-self-end font-semibold">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
};

export default CartItemContent;
