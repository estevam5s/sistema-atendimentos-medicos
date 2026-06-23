import { headers } from "next/headers";

import { PricingPlans } from "@/components/pricing-plans";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";
import { getPlans, getUserPlan } from "@/lib/plans";

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const plans = await getPlans();
  const { plan, isAdmin } = await getUserPlan(session!.user.id, session!.user.email);
  const currentSlug = isAdmin ? "enterprise" : plan?.slug || "free";
  const isPaid = currentSlug !== "free";

  return (
    <WithAuthentication mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Meu plano</PageTitle>
            <PageDescription>
              Você está no plano <strong>{plan?.name ?? "Inicial"}</strong>. Escolha o ideal para a
              sua clínica — cancele quando quiser.
            </PageDescription>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <PricingPlans plans={plans} currentSlug={currentSlug} isPaid={isPaid} />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default SubscriptionPage;
