import { Check } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPlans } from "@/lib/plans";
import { cn } from "@/lib/utils";

const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default async function PricingSection() {
  let plans;
  try {
    plans = await getPlans();
  } catch {
    return null;
  }
  if (!plans?.length) return null;

  return (
    <section id="pricing" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            Planos
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl">Preços simples e transparentes</h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
            Comece grátis. Em Reais, com nota fiscal, cancele quando quiser. Sem limite de
            armazenamento por GB.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.slug}
              className={cn("flex flex-col", plan.highlighted && "border-primary shadow-lg")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  {plan.highlighted && <Badge>Popular</Badge>}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {plan.priceMonth === 0 ? "R$ 0" : brl(plan.priceMonth)}
                  </span>
                  {plan.priceMonth > 0 && (
                    <span className="text-muted-foreground text-sm">/mês</span>
                  )}
                </div>
                <p className="text-muted-foreground min-h-10 text-sm">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex-1 space-y-2.5">
                  {plan.features.slice(0, 6).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-6 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href="/authentication?mode=signup">
                    {plan.slug === "free" ? "Começar grátis" : `Assinar ${plan.name}`}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground mt-8 text-center text-xs">
          Pagamentos processados com segurança via Stripe · Reembolso em até 7 dias (CDC art. 49) ·
          Cancele quando quiser
        </p>
      </div>
    </section>
  );
}
