"use client";

import {
  Activity,
  Building2,
  CalendarDays,
  DollarSign,
  Loader2,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Overview = {
  users: number;
  clinics: number;
  doctors: number;
  patients: number;
  appointments: number;
  paying: number;
  byPlan: Record<string, number>;
  mrr: number;
  arr: number;
  arpu: number;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  plan: string | null;
  createdAt: string;
  subStatus: string | null;
  subPlan: string | null;
};

const PLAN_OPTS = ["free", "starter", "pro", "enterprise"];

export function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, u, h] = await Promise.all([
      fetch("/api/admin?module=overview").then((r) => r.json()),
      fetch("/api/admin?module=users").then((r) => r.json()),
      fetch("/api/admin?module=health").then((r) => r.json()),
    ]);
    setOverview(o);
    setUsers(u.users || []);
    setHealth(h);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setPlan = async (userId: string, slug: string) => {
    const r = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set_plan", user_id: userId, slug }),
    });
    if (r.ok) {
      toast.success("Plano atualizado.");
      load();
    } else toast.error("Falha ao atualizar.");
  };

  if (loading && !overview) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Usuários", value: overview?.users ?? 0, icon: UsersRound },
    { label: "Clínicas", value: overview?.clinics ?? 0, icon: Building2 },
    { label: "Médicos", value: overview?.doctors ?? 0, icon: Stethoscope },
    { label: "Pacientes", value: overview?.patients ?? 0, icon: UsersRound },
    { label: "Agendamentos", value: overview?.appointments ?? 0, icon: CalendarDays },
    { label: "Pagantes", value: overview?.paying ?? 0, icon: DollarSign },
  ];

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Visão geral</TabsTrigger>
        <TabsTrigger value="users">Usuários</TabsTrigger>
        <TabsTrigger value="health">Saúde</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {s.label}
                </CardTitle>
                <s.icon className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Receita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row k="MRR" v={brl(overview?.mrr ?? 0)} />
              <Row k="ARR" v={brl(overview?.arr ?? 0)} />
              <Row k="ARPU (pagantes)" v={brl(overview?.arpu ?? 0)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Usuários por plano</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {Object.entries(overview?.byPlan ?? {}).map(([slug, n]) => (
                <Row key={slug} k={slug} v={String(n)} />
              ))}
              {Object.keys(overview?.byPlan ?? {}).length === 0 && (
                <p className="text-muted-foreground">Sem assinaturas ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-muted-foreground text-xs">{u.email}</div>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={u.subPlan || u.plan || "free"}
                        onValueChange={(v) => setPlan(u.id, v)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLAN_OPTS.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{u.subStatus || "—"}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="health">
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm">
            <Row k="Stripe configurado" v={health?.stripe ? "✅" : "❌"} />
            <Row k="Webhook configurado" v={health?.webhook ? "✅" : "❌"} />
            <Row k="Banco de dados" v={health?.db ? "✅" : "❌"} />
            <Row k="Horário do servidor" v={String(health?.time ?? "")} />
            <div className="text-muted-foreground flex items-center gap-2 pt-2">
              <Activity className="h-4 w-4" /> Sistema operacional
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground capitalize">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
