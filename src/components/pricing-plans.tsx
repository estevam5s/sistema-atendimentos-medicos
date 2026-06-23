"use client";

import { Check, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { createStripeCheckout } from "@/actions/create-stripe-checkout";
import { createStripePortal } from "@/actions/create-stripe-portal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Plan } from "@/lib/plans";
import { cn } from "@/lib/utils";

const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function PricingPlans({
  plans,
  currentSlug,
  isPaid,
}: {
  plans: Plan[];
  currentSlug?: string;
  isPaid?: boolean;
}) {
  const [cycle, setCycle] = useState<"month" | "year">("month");
  const [busy, setBusy] = useState<string | null>(null);

  const checkout = useAction(createStripeCheckout, {
    onSuccess: ({ data }) => {
      if (data?.url) window.location.href = data.url;
      else setBusy(null);
    },
    onError: () => {
      toast.error("Erro ao iniciar a assinatura.");
      setBusy(null);
    },
  });

  const portal = useAction(createStripePortal, {
    onSuccess: ({ data }) => {
      if (data?.url) window.location.href = data.url;
      else setBusy(null);
    },
    onError: () => {
      toast.error("Erro ao abrir o portal.");
      setBusy(null);
    },
  });

  const handle = (plan: Plan) => {
    if (plan.slug === currentSlug && isPaid) {
      setBusy(plan.slug);
      portal.execute();
      return;
    }
    if (plan.slug === "free") return;
    setBusy(plan.slug);
    checkout.execute({ slug: plan.slug as "starter" | "pro" | "enterprise", cycle });
  };

  return (
    <div>
      {/* toggle */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <span className={cn("text-sm", cycle === "month" ? "font-medium" : "text-muted-foreground")}>
          Mensal
        </span>
        <button
          onClick={() => setCycle(cycle === "month" ? "year" : "month")}
          className="bg-muted relative h-7 w-14 rounded-full border transition"
          aria-label="Alternar ciclo"
        >
          <span
            className={cn(
              "bg-primary absolute top-0.5 h-6 w-6 rounded-full transition-all",
              cycle === "year" ? "left-7" : "left-0.5",
            )}
          />
        </button>
        <span className={cn("text-sm", cycle === "year" ? "font-medium" : "text-muted-foreground")}>
          Anual <span className="font-medium text-green-600">−20%</span>
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = plan.slug === currentSlug;
          const price =
            plan.priceMonth === 0
              ? "R$ 0"
              : cycle === "year"
                ? brl(Math.round(plan.priceYear / 12))
                : brl(plan.priceMonth);
          const sub =
            plan.priceMonth === 0
              ? "para sempre"
              : cycle === "year"
                ? `/mês · ${brl(plan.priceYear)}/ano`
                : "/mês";
          return (
            <Card
              key={plan.slug}
              className={cn("flex flex-col", plan.highlighted && "border-primary shadow-lg")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  {plan.highlighted && <Badge>Popular</Badge>}
                  {isCurrent && <Badge variant="secondary">Atual</Badge>}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{price}</span>
                </div>
                <p className="text-muted-foreground text-xs">{sub}</p>
                <p className="text-muted-foreground mt-1 min-h-10 text-sm">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex-1 space-y-2.5">
                  {plan.features.slice(0, 7).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  disabled={(plan.slug === "free" && !isCurrent) || busy === plan.slug}
                  onClick={() => handle(plan)}
                >
                  {busy === plan.slug ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrent && isPaid ? (
                    "Gerenciar assinatura"
                  ) : isCurrent ? (
                    "Plano atual"
                  ) : plan.slug === "free" ? (
                    "Grátis"
                  ) : (
                    `Assinar ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
