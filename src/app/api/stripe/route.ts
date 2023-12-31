import prisma from "@/utils/prismadb";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "auto";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
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
