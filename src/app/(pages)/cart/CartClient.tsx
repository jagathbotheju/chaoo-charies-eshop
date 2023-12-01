"use client";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import Heading from "../../../components/Heading";
import Button from "../../../components/Button";
import CartItemContent from "./CartItemContent";
import { useEffect, useState } from "react";
import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CartClient = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [mount, setMount] = useState(false);
  const {
    cartProducts,
    clearCart,
    setCartTotalAmount,
    setCartTotalQty,
    cartTotalAmount,
    cartTotalQty,
  } = useCart((state) => state);

  // useEffect(() => {
  //   useCart.persist.rehydrate();
  // }, []);

  useEffect(() => {
    console.log("updating cart client");
    if (cartProducts) {
      const { total, qty } = cartProducts.reduce(
        (acc, item) => {
          const itemTotal = item.price * item.quantity;
          acc.total += itemTotal;
          acc.qty += item.quantity;

          return acc;
        },
        {
          total: 0,
          qty: 0,
        }
      );

      setCartTotalAmount(total);
      setCartTotalQty(qty);
    }
  }, [cartProducts, setCartTotalAmount, setCartTotalQty]);

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-2xl">Your Cart is Empty</h2>
        <div>
          <Link
            href="/"
            className="text-slate-500 flex items-center gap-1 mt-2"
          >
            <MdArrowBack />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Heading title="Shopping Cart" center />
      <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8">
        <p className="col-span-2 justify-self-start">PRODUCT</p>
        <p className="justify-self-center">PRICE</p>
        <p className="justify-self-center">QUANTITY</p>
        <p className="justify-self-end">TOTAL</p>
      </div>

      {/* cart items */}
      <div>
        {cartProducts &&
          cartProducts.map((item) => (
            <CartItemContent key={item.id} item={item} />
          ))}
      </div>

      <div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
        {/* clear cart */}
        <div>
          <Button
            label="Clear Cart"
            onClick={() => clearCart()}
            small
            outline
          />
        </div>

        {/* check out */}
        <div className="text-sm flex flex-col gap-1 items-start">
          {/* sub total */}
          <div className="flex justify-between w-full text-base font-semibold">
            <span>SubTotal</span>
            <span>{formatPrice(cartTotalAmount)}</span>
          </div>
          <p className="text-slate-500">
            Taxes and shipping calculate at checkout
          </p>
          {/* checkout button*/}
          <Button
            label={`${session?.user ? "Checkout" : "Login to Checkout"}`}
            outline={session?.user ? false : true}
            onClick={
              session?.user
                ? () => router.push("/checkout")
                : () => router.push("/login")
            }
          />
          <Link
            href="/"
            className="text-slate-500 flex items-center gap-1 mt-2"
          >
            <MdArrowBack />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
