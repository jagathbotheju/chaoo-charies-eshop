"use client";
import { Rating } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import SetColor from "./SetColor";
import SetQuantity from "./SetQuantity";
import Button from "./Button";
import ProductImage from "./ProductImage";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MdCheckCircle } from "react-icons/md";

interface Props {
  product: any;
}

const ProductDetails = ({ product }: Props) => {
  const router = useRouter();
  const { cartTotalQty, cartProducts, addProductToCart } = useCart();
  const [productInCart, setProductInCart] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProduct>({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: { ...product.images[0] },
    quantity: 1,
    price: product.price,
  });
  const productRating =
    product.reviews.reduce((acc: number, item: any) => acc + item.rating, 0) /
    product.reviews.length;

  useEffect(() => {
    const exist = cartProducts.find((product) => product.id === cartProduct.id);
    if (exist) {
      setProductInCart(true);
    }
  }, [cartProduct.id, cartProducts]);

  const handleColorSelect = (value: SelectedImg) => {
    setCartProduct((prev) => {
      return { ...prev, selectedImg: value };
    });
  };

  const handleQtyDecrease = () => {
    if (cartProduct.quantity === 1) return;
    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity-- };
    });
  };

  const handleQtyIncrease = () => {
    if (cartProduct.quantity === 99) {
      toast.error("Maximum limit reached");
      return;
    }
    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity++ };
    });
  };

  const handleAddProductToCart = () => {
    const exist = cartProducts.find((product) => product.id === cartProduct.id);
    if (exist) {
      //toast.error("Product Already Exist in your Cart");
      setProductInCart(true);
    } else {
      addProductToCart(cartProduct);
      //router.push("/");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* images */}
      <ProductImage
        product={product}
        cartProduct={cartProduct}
        handleColorSelect={handleColorSelect}
      />

      {/* details */}
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} readOnly />
          <p>{product.reviews.length} reviews</p>
        </div>
        <hr className="w-[30%] my-2" />

        <p className="text-justify">{product.description}</p>
        <hr className="w-[30%] my-2" />

        <p>
          <span className="uppercase font-semibold">Category</span>{" "}
          {product.category}
        </p>
        <p>
          <span className="uppercase font-semibold">Brand</span> {product.brand}
        </p>
        <div
          className={`${
            product.inStock ? "text-teal-400" : "text-rose-400"
          } font-semibold`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </div>
        <hr className="w-[30%] my-2" />

        {productInCart ? (
          <>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdCheckCircle size={20} className="text-teal-400" />
              <span>Product added to Cart</span>
            </p>
            <Button
              label="View Cart"
              onClick={() => router.push("/cart")}
              outline
            />
          </>
        ) : (
          <>
            <SetColor
              cartProduct={cartProduct}
              images={product.images}
              handleColorSelect={handleColorSelect}
            />
            <hr className="w-[30%] my-2" />

            <SetQuantity
              cartProduct={cartProduct}
              handleQtyDecrease={handleQtyDecrease}
              handleQtyIncrease={handleQtyIncrease}
            />
            <hr className="w-[30%] my-2" />

            <Button
              small
              label="Add to Cart"
              onClick={handleAddProductToCart}
            />
            <hr className="w-[30%] my-2" />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
