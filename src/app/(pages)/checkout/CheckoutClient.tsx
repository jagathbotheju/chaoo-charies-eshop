"use client";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { createPaymentIntent } from "@/utils/serverActions";
import { User } from "@prisma/client";
import { toast } from "react-toastify";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutClient = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { cartProducts, paymentIntent, setPaymentIntent } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { data: session } = useSession();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (cartProducts && session && session.user) {
        setLoading(true);
        setError(false);
        const stripeCartProducts = cartProducts.map((product) => ({
          ...product,
          price: product.quantity * (product.price / 100),
        }));

        startTransition(() => {
          createPaymentIntent({
            cartProducts: stripeCartProducts,
            user: session?.user as User,
            paymentIntentId: paymentIntent,
          })
            .then((response) => {
              if (response && response.data) {
                const intent = JSON.parse(response.data);
                setClientSecret(intent.client_secret);
                setPaymentIntent(intent.id);
              }
            })
            .catch((error) => {
              setError(true);
              toast.error("Something went wrong!");
            })
            .finally(() => {
              setLoading(false);
            });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  return (
    <div className="w-full">
      {clientSecret && cartProducts.length > 0 && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            //handleSetPaymentSuccess={handleSetPaymentSuccess}
            setPaymentSuccess={setPaymentSuccess}
          />
        </Elements>
      )}

      {loading && (
        <div className="text-center">
          <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
      )}
      {error && (
        <div className="text-center text-rose-500">
          Something went wrong...!
        </div>
      )}
      {paymentSuccess && (
        <div className="flex items-center flex-col gap-y-4">
          <div className="text-teal-500 font-bold ">Payment Success</div>

          <Button
            label="View Your Orders"
            onClick={() => router.push("/order")}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
