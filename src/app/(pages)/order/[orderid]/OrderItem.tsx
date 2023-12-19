import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import { Product } from "@prisma/client";
import Image from "next/image";

interface Props {
  product: CartProduct;
}

const OrderItem = ({ product }: Props) => {
  return (
    <div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
      {/* image */}
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <div className="relative w-[120px] aspect-square">
          <Image
            src={product.selectedImg.image}
            alt={product.name}
            className="object-contain"
            fill
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-semibold">{truncateText(product.name)}</p>
          <p>{product.selectedImg.color}</p>
        </div>
      </div>

      <div className="justify-self-center">{formatPrice(product.price)}</div>
      <div className="justify-self-center">{product.quantity}</div>
      <div className="justify-self-end font-semibold">
        {formatPrice(product.quantity * product.price)}
      </div>
    </div>
  );
};

export default OrderItem;
