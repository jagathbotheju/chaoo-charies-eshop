import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import prisma from "@/utils/prismadb";
import { Address } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("STARTING WEBHOOK");
  const buff = await req.text();
  const sig = headers().get("Stripe-Signature") as string;

  if (!sig) {
    return new Response("Webhook Error -no Signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buff,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new Response(`Webhook Error Signature ${error.message}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "charge.succeeded":
      const charge: any = event.data.object as Stripe.Charge;

      if (typeof charge.payment_intent === "string") {
        await prisma.order.update({
          where: { paymentIntentId: charge.payment_intent },
          data: {
            status: "complete",
            address: {
              set: {
                city: charge.shipping?.address?.city,
                country: charge.shipping?.address?.country,
                line1: charge.shipping?.address?.line1,
                line2: charge.shipping?.address?.line1,
                postalCode: charge.shipping?.address?.postal_code,
                state: charge.shipping?.address?.state,
              },
            },
          },
        });
      }
      break;
    default:
      console.log("unhandled event type" + event.type);
  }

  return NextResponse.json({ received: true });
}
