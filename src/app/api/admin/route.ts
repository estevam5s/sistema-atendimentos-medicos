import { count, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import {
  appointmentsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
  plansTable,
  subscriptionsTable,
  usersTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/plans";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || !isAdminEmail(session.user.email)) return null;
  return session.user;
}

export async function GET(req: Request) {
  const actor = await requireAdmin();
  if (!actor) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const mod = new URL(req.url).searchParams.get("module") || "overview";

  if (mod === "overview") {
    const [[users], [clinics], [doctors], [patients], [appointments], subs, plans] =
      await Promise.all([
        db.select({ c: count() }).from(usersTable),
        db.select({ c: count() }).from(clinicsTable),
        db.select({ c: count() }).from(doctorsTable),
        db.select({ c: count() }).from(patientsTable),
        db.select({ c: count() }).from(appointmentsTable),
        db.select().from(subscriptionsTable),
        db.select().from(plansTable),
      ]);

    const priceMap = Object.fromEntries(plans.map((p) => [p.slug, p]));
    const byPlan: Record<string, number> = {};
    let mrr = 0;
    for (const s of subs) {
      byPlan[s.planSlug] = (byPlan[s.planSlug] || 0) + 1;
      if (["active", "trialing"].includes(s.status) && s.planSlug !== "free") {
        const p = priceMap[s.planSlug];
        if (p) mrr += s.cycle === "year" ? p.priceYear / 12 : p.priceMonth;
      }
    }
    const paying = subs.filter(
      (s) => s.planSlug !== "free" && ["active", "trialing"].includes(s.status),
    ).length;

    return NextResponse.json({
      users: users.c,
      clinics: clinics.c,
      doctors: doctors.c,
      patients: patients.c,
      appointments: appointments.c,
      paying,
      byPlan,
      mrr: Math.round(mrr),
      arr: Math.round(mrr * 12),
      arpu: paying ? Math.round(mrr / paying) : 0,
    });
  }

  if (mod === "users") {
    const rows = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        plan: usersTable.plan,
        createdAt: usersTable.createdAt,
        subStatus: subscriptionsTable.status,
        subPlan: subscriptionsTable.planSlug,
      })
      .from(usersTable)
      .leftJoin(subscriptionsTable, eq(subscriptionsTable.userId, usersTable.id))
      .orderBy(sql`${usersTable.createdAt} desc`)
      .limit(200);
    return NextResponse.json({ users: rows });
  }

  if (mod === "health") {
    return NextResponse.json({
      ok: true,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      webhook: !!process.env.STRIPE_WEBHOOK_SECRET,
      db: !!process.env.DATABASE_URL,
      time: new Date().toISOString(),
    });
  }

  return NextResponse.json({ error: "módulo inválido" }, { status: 400 });
}

export async function POST(req: Request) {
  const actor = await requireAdmin();
  if (!actor) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { action, user_id, slug } = await req.json().catch(() => ({}));

  if (action === "set_plan" && user_id && slug) {
    await db
      .insert(subscriptionsTable)
      .values({ userId: user_id, planSlug: slug, status: "active" })
      .onConflictDoUpdate({
        target: subscriptionsTable.userId,
        set: { planSlug: slug, status: "active", updatedAt: new Date() },
      });
    await db.update(usersTable).set({ plan: slug }).where(eq(usersTable.id, user_id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "ação inválida" }, { status: 400 });
}
