"use client";

interface Props {
  images: SelectedImg[];
  cartProduct: CartProduct;
  handleColorSelect: (value: SelectedImg) => void;
}

const SetColor = ({ images, cartProduct, handleColorSelect }: Props) => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="font-semibold">COLOR :</span>
        <div className="flex gap-1">
          {images.map((image) => {
            return (
              <div
                onClick={() => handleColorSelect(image)}
                key={image.image}
                className={`h-7 w-7 rounded-full border-teal-300 flex items-center justify-center ${
                  cartProduct.selectedImg.color === image.color
                    ? "border-[2px]"
                    : "border-none"
                }`}
              >
                <div
                  style={{ background: image.colorCode }}
                  className={`h-5 w-5 rounded-full border-[1.2px] border-slate-300 cursor-pointer`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SetColor;
