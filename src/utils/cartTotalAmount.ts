export const cartTotalAmount = (cartProducts: CartProduct[]) => {
  const { totalPrice, totalQty } = cartProducts.reduce(
    (acc, item) => {
      const itemTotal = item.price * item.quantity;
      acc.totalPrice += itemTotal;
      acc.totalQty += item.quantity;

      return acc;
    },
    {
      totalPrice: 0,
      totalQty: 0,
    }
  );

  return { totalPrice: +totalPrice.toFixed(2), totalQty };
};
