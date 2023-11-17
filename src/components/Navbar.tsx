"use client";
import Link from "next/link";
import Container from "./Container";
import { Redressed } from "next/font/google";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const Navbar = () => {
  const { cartTotalQty } = useCart((state) => state);
  const router = useRouter();

  // useEffect(() => {
  //   useCart.persist.rehydrate();
  // }, []);

  return (
    <div className="sticky top-0 w-full bg-slate-200 z-30 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Link
              href="/"
              className={`${redressed.className} font-bold text-2xl`}
            >
              E-Shop
            </Link>
            <div className="hidden md:block">Search</div>
            <div className="flex items-center gap-8 md:gap-12">
              <div
                className="relative cursor-pointer"
                onClick={() => router.push("/cart")}
              >
                <p className="text-xs font-semibold text-slate-200 absolute -right-1 -top-1 w-3 h-3 rounded-full bg-slate-800 shadow-lg flex items-center justify-center p-2">
                  {cartTotalQty}
                </p>
                <AiOutlineShoppingCart size={30} />
              </div>
              <div>UserMenu</div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
