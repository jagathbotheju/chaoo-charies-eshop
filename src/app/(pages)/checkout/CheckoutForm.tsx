"use client";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  clientSecret: string;
  //handleSetPaymentSuccess: (value: boolean) => void;
  setPaymentSuccess: (value: boolean) => void;
}

const CheckoutForm = ({ clientSecret, setPaymentSuccess }: Props) => {
  const { cartTotalAmount, clearCart, setPaymentIntent } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const formattedPrice = formatPrice(cartTotalAmount);

  useEffect(() => {
    if (!stripe) return;
    if (!clientSecret) return;

    setPaymentSuccess(false);
  }, [stripe, clientSecret, setPaymentSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    stripe
      .confirmPayment({
        elements,
        redirect: "if_required",
      })
      .then((result) => {
        if (!result.error) {
          toast.success("Payment Successful");
          clearCart();
          setPaymentSuccess(true);
          setPaymentIntent(null);
          //updateDbProduct
        }
      });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div className="mb-6">
        <Heading title="Enter your details to complete checkout" />
      </div>

      {/* address details */}
      <h2 className="font-semibold mb-2">Address Details</h2>
      <AddressElement
        options={{
          mode: "shipping",
          allowedCountries: ["US", "KE", "LK", "QA"],
        }}
      />

      {/* payment details */}
      <h2 className="font-semibold mt-4 mb-2">Payment Details</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      {/* total amount */}
      <div className="py-4 text-center text-slate-700 text-xl font-bold">
        Total : {formatPrice(cartTotalAmount / 100)}
      </div>

      <Button
        width="w-full"
        label={loading ? "Processing..." : "Pay now"}
        disabled={loading || !stripe || !elements}
        onClick={() => {}}
      />
    </form>
  );
};

export default CheckoutForm;
