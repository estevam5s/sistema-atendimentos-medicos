import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import LoginForm from "./components/login-form";
import SignUpForm from "./components/sign-up-form";

const AuthenticationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string; mode?: string }>;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const isDemo = resolvedSearchParams.demo === "true";
  const defaultTab = resolvedSearchParams.mode === "signup" ? "register" : "login";

  return (
    <AuthShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Bem-vindo</h1>
        <p className="text-muted-foreground text-sm">
          Entre ou crie sua conta para gerenciar a sua clínica.
        </p>
      </div>
      {isDemo && (
        <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 text-center dark:from-blue-900/20 dark:to-indigo-900/20">
          <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            🎯 Modo Demonstração
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Teste nossa plataforma gratuitamente por 30 dias
          </p>
        </div>
      )}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="register">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </AuthShell>
  );
};

export default AuthenticationPage;
