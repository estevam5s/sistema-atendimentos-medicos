import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { plansTable, subscriptionsTable, usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe secret key not found");
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) throw new Error("Stripe signature not found");

  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  const slugFromPrice = async (priceId?: string | null) => {
    if (!priceId) return undefined;
    const [m] = await db.select().from(plansTable).where(eq(plansTable.stripePriceMonth, priceId)).limit(1);
    if (m) return m.slug;
    const [y] = await db.select().from(plansTable).where(eq(plansTable.stripePriceYear, priceId)).limit(1);
    return y?.slug;
  };

  const applyPlan = async (
    userId: string,
    slug: string,
    data: Partial<typeof subscriptionsTable.$inferInsert>,
  ) => {
    await db
      .insert(subscriptionsTable)
      .values({ userId, planSlug: slug, status: "active", ...data })
      .onConflictDoUpdate({
        target: subscriptionsTable.userId,
        set: { planSlug: slug, status: data.status ?? "active", ...data, updatedAt: new Date() },
      });
    await db.update(usersTable).set({ plan: slug }).where(eq(usersTable.id, userId));
  };

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const userId = s.metadata?.userId;
      const slug = s.metadata?.slug;
      const cycle = (s.metadata?.cycle as "month" | "year") || "month";
      if (userId && slug) {
        let periodEnd: Date | null = null;
        const subId = (s.subscription as string) || null;
        if (subId) {
          const full = (await stripe.subscriptions.retrieve(subId)) as unknown as {
            current_period_end?: number;
          };
          if (full.current_period_end) periodEnd = new Date(full.current_period_end * 1000);
        }
        await applyPlan(userId, slug, {
          cycle,
          stripeCustomerId: s.customer as string,
          stripeSubscriptionId: subId,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        });
        await db
          .update(usersTable)
          .set({ stripeCustomerId: s.customer as string, stripeSubscriptionId: subId })
          .where(eq(usersTable.id, userId));
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      const priceId = sub.items?.data?.[0]?.price?.id;
      const slug = (await slugFromPrice(priceId)) || sub.metadata?.slug;
      if (userId && slug) {
        await applyPlan(userId, slug, {
          status: sub.status,
          stripeSubscriptionId: sub.id,
          currentPeriodEnd: (sub as unknown as { current_period_end?: number }).current_period_end
            ? new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000)
            : null,
          cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await db
          .update(subscriptionsTable)
          .set({ planSlug: "free", status: "canceled", stripeSubscriptionId: null, updatedAt: new Date() })
          .where(eq(subscriptionsTable.userId, userId));
        await db
          .update(usersTable)
          .set({ plan: null, stripeSubscriptionId: null })
          .where(eq(usersTable.id, userId));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
};
