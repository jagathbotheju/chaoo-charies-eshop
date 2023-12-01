import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buff = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
  }

  let event: Stripe.Event;
}
