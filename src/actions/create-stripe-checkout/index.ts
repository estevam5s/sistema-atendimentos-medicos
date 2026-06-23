"use server";

import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { z } from "zod";

import { db } from "@/db";
import { subscriptionsTable, usersTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";
import { getPlanBySlug, priceIdFor } from "@/lib/plans";

const schema = z.object({
  slug: z.enum(["starter", "pro", "enterprise"]),
  cycle: z.enum(["month", "year"]).default("month"),
});

export const createStripeCheckout = protectedActionClient
  .schema(schema)
  .action(async ({ ctx, parsedInput }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not found");
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
    });

    const plan = await getPlanBySlug(parsedInput.slug);
    if (!plan) throw new Error("Plano inválido");
    const price = priceIdFor(plan, parsedInput.cycle);
    if (!price) throw new Error("Preço não configurado para este plano");

    // reutiliza/cria customer
    const [sub] = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.userId, ctx.user.id))
      .limit(1);
    let customer = sub?.stripeCustomerId ?? undefined;
    if (!customer) {
      const c = await stripe.customers.create({
        email: ctx.user.email,
        metadata: { userId: ctx.user.id },
      });
      customer = c.id;
      await db
        .insert(subscriptionsTable)
        .values({ userId: ctx.user.id, planSlug: sub?.planSlug ?? "free", stripeCustomerId: customer })
        .onConflictDoUpdate({
          target: subscriptionsTable.userId,
          set: { stripeCustomerId: customer },
        });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer,
      success_url: `${appUrl}/subscription?success=1`,
      cancel_url: `${appUrl}/subscription?canceled=1`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { userId: ctx.user.id, slug: plan.slug, cycle: parsedInput.cycle },
      },
      metadata: { userId: ctx.user.id, slug: plan.slug, cycle: parsedInput.cycle },
      line_items: [{ price, quantity: 1 }],
    });

    // garante que users.plan reflita após pagamento (webhook), aqui só retorna sessão
    void usersTable;
    return { sessionId: session.id, url: session.url };
  });
