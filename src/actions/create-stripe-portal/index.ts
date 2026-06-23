"use server";

import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { db } from "@/db";
import { subscriptionsTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const createStripePortal = protectedActionClient.action(async ({ ctx }) => {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe secret key not found");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });

  const [sub] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, ctx.user.id))
    .limit(1);

  if (!sub?.stripeCustomerId) throw new Error("Nenhuma assinatura encontrada");

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
  });

  return { url: session.url };
});
