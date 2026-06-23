import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/plans";

import { AdminDashboard } from "./_components/admin-dashboard";

const AdminPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/authentication");
  if (!isAdminEmail(session.user.email)) redirect("/dashboard");

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Administração</PageTitle>
          <PageDescription>
            Métricas do negócio, usuários e assinaturas — Dr. Schedule.
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <AdminDashboard />
      </PageContent>
    </PageContainer>
  );
};

export default AdminPage;
