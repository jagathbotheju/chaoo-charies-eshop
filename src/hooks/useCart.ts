import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProduct[];
  paymentIntent: string | null;
  addProductToCart: (product: CartProduct) => void;
  removeProductFromCart: (productId: string) => void;
  handleQtyIncrease: (productId: string) => void;
  handleQtyDecrease: (productId: string) => void;
  clearCart: () => void;
  setCartTotalQty: (totalQty: number) => void;
  setCartTotalAmount: (totalAmount: number) => void;
  setPaymentIntent: (paymentIntent: string | null) => void;
  clearPaymentIntent: () => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cartTotalQty: 0,
      cartTotalAmount: 0,
      cartProducts: [],
      paymentIntent: null,

      setPaymentIntent: (paymentIntent: string | null) => {
        set((state) => ({
          paymentIntent,
        }));
      },

      clearPaymentIntent: () => {
        set((state) => ({
          paymentIntent: null,
        }));
      },

      setCartTotalAmount: (totalAmount: number) => {
        set((state) => ({
          cartTotalAmount: totalAmount,
        }));
      },

      setCartTotalQty: (totalQty: number) => {
        set((state) => ({
          cartTotalQty: totalQty,
        }));
      },

      clearCart: () => {
        set((state) => ({
          cartProducts: [],
          cartTotalQty: 0,
        }));
      },

      removeProductFromCart: (productId: string) => {
        set((state) => ({
          cartProducts: state.cartProducts.filter(
            (item) => item.id !== productId
          ),
        }));
      },

      addProductToCart: (product: CartProduct) => {
        set((state) => ({
          cartProducts: [...state.cartProducts, product],
        }));
      },

      handleQtyDecrease: (productId: string) => {
        set((state) => ({
          cartProducts: state.cartProducts.map((product) => {
            return product.id === productId && product.quantity > 1
              ? { ...product, quantity: product.quantity - 1 }
              : product;
          }),
        }));
      },

      handleQtyIncrease: (productId: string) => {
        set((state) => ({
          cartProducts: state.cartProducts.map((product) => {
            return product.id === productId
              ? { ...product, quantity: product.quantity + 1 }
              : product;
          }),
        }));
      },
    }),
    { name: "cart" }
  )
);
