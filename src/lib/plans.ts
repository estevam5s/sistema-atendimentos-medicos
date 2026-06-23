import { eq } from "drizzle-orm";

import { db } from "@/db";
import { plansTable, subscriptionsTable } from "@/db/schema";

export type PlanLimits = {
  professionals: number; // -1 = ilimitado
  patients: number;
  appointments_month: number;
  clinics: number;
  reminders: "email" | "whatsapp";
  online_booking: boolean;
  emr: false | "basic" | "full";
  telemedicine: boolean;
  finance: boolean;
  tiss: boolean;
  ai: boolean;
  api: boolean;
  white_label: boolean;
};

export type Plan = {
  id: string;
  slug: "free" | "starter" | "pro" | "enterprise";
  name: string;
  description: string | null;
  priceMonth: number;
  priceYear: number;
  stripePriceMonth: string | null;
  stripePriceYear: string | null;
  features: string[];
  limits: PlanLimits;
  highlighted: boolean;
  sortOrder: number;
};

export const isUnlimited = (n: number) => n === -1 || n === null || n === undefined;

export const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const isAdminEmail = (email?: string | null) =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());

export async function getPlans(): Promise<Plan[]> {
  const rows = await db
    .select()
    .from(plansTable)
    .where(eq(plansTable.active, true))
    .orderBy(plansTable.sortOrder);
  return rows as unknown as Plan[];
}

export async function getPlanBySlug(slug: string): Promise<Plan | null> {
  const [row] = await db.select().from(plansTable).where(eq(plansTable.slug, slug)).limit(1);
  return (row as unknown as Plan) ?? null;
}

/** Plano efetivo do usuário (admin => enterprise). */
export async function getUserPlan(
  userId: string,
  email?: string | null,
): Promise<{ plan: Plan | null; subscription: typeof subscriptionsTable.$inferSelect | null; isAdmin: boolean }> {
  const [sub] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId))
    .limit(1);
  const admin = isAdminEmail(email);
  const slug = admin ? "enterprise" : sub?.planSlug || "free";
  const plan = await getPlanBySlug(slug);
  return { plan, subscription: sub ?? null, isAdmin: admin };
}

export function priceIdFor(plan: Plan, cycle: "month" | "year"): string | null {
  return cycle === "year" ? plan.stripePriceYear : plan.stripePriceMonth;
}
