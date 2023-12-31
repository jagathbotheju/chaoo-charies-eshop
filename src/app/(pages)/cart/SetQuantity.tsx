interface Props {
  cartCounter?: boolean;
  cartProduct: CartProduct;
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}

const btnStyle = "border-[1.2px] border-slate-300 px-2 rounded";

const SetQuantity = ({
  cartCounter,
  cartProduct,
  handleQtyDecrease,
  handleQtyIncrease,
}: Props) => {
  return (
    <div className="flex gap-8 items-center">
      {cartCounter && <div className="font-semibold">QUANTITY :</div>}
      <div className="flex gap-4 items-center text-base">
        <button
          className={btnStyle}
          onClick={handleQtyDecrease}
          disabled={cartProduct.quantity === 1}
        >
          -
        </button>
        <div>{cartProduct.quantity}</div>
        <button className={btnStyle} onClick={handleQtyIncrease}>
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;
