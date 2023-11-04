import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
  cartTotalQty: number;
  cartProducts: CartProduct[];
  addProductToCart: (product: CartProduct) => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cartTotalQty: 0,
      cartProducts: [],
      addProductToCart: (product: CartProduct) => {
        set((state) => ({
          cartProducts: [...state.cartProducts, product],
        }));
      },
    }),
    { name: "cart" }
  )
);
