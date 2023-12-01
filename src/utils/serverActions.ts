"use server";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { FieldValues } from "react-hook-form";
import prisma from "./prismadb";
import Stripe from "stripe";
import { cartTotalAmount } from "./cartTotalAmount";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export const createPaymentIntent = async ({
  cartProducts,
  user,
  paymentIntentId,
}: {
  cartProducts: CartProduct[];
  user: User;
  paymentIntentId: string | null;
}) => {
  console.log("CREATING PAYMENT INTENT***********", paymentIntentId);
  const totalPrice = cartTotalAmount(cartProducts).totalPrice * 100;
  const orderData = {
    user: { connect: { id: user.id } },
    amount: totalPrice,
    currency: "usd",
    status: "pending",
    deliveryStatus: "pending",
    paymentIntentId,
    products: cartProducts,
  };

  if (paymentIntentId) {
    //update payment intent
    console.log("CHECKOUT FOUND PAYMENT INTENT - UPDATE", paymentIntentId);
    const currentPaymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    );
    if (currentPaymentIntent) {
      const updatedPaymentIntent = await stripe.paymentIntents.update(
        paymentIntentId,
        {
          amount: totalPrice,
        }
      );

      //update order
      const [existingOrder, updatedOrder] = await Promise.all([
        prisma.order.findFirst({
          where: { paymentIntentId },
        }),
        prisma.order.update({
          where: { paymentIntentId },
          data: {
            amount: totalPrice,
            products: cartProducts,
          },
        }),
      ]);

      if (!existingOrder) {
        return {
          success: false,
          message: "Invalid Payment Intent",
        };
      }

      return {
        success: true,
        data: JSON.stringify(updatedPaymentIntent),
      };
    }
  } else {
    //create the payment intent and
    console.log("CHECKOUT FOUND PAYMENT INTENT - CREATE");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    //create order
    const paymentIntentId = paymentIntent.id;
    await prisma.order.create({
      data: {
        ...orderData,
        paymentIntentId,
      },
    });

    return {
      success: true,
      data: JSON.stringify(paymentIntent),
    };
  }
};

export const paymentSuccessUpdateProduct = async () => {
  try {
  } catch (error) {}
};

export const signupUser = async (formData: FieldValues) => {
  try {
    const { name, email, password } = formData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Internal Server Error",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};
