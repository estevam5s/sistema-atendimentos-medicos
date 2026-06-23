# 🩺 Planos & Preços — Dr. Schedule (Doutor Agenda)

> **Dr. Schedule** é um SaaS de gestão para clínicas e consultórios médicos: agenda inteligente, cadastro de médicos e pacientes, agendamentos, prontuário eletrônico, financeiro e dashboard — tudo centralizado, seguro e em conformidade com as normas de saúde.
>
> **Moeda:** Real (BRL) · **Cobrança:** mensal ou anual via Stripe · **Cancele quando quiser** · Modelo B2B (clínicas), com nota fiscal.
>
> _Documento de referência para precificação, posicionamento, produto e conformidade. Última revisão: junho/2026._

---

## 1) O produto hoje (análise das funcionalidades existentes)

Stack: Next.js 15 · React 19 · TypeScript · Drizzle ORM · PostgreSQL · Better Auth (e-mail + Google OAuth) · Stripe · Tailwind/shadcn · TanStack Query/Table · Recharts.

Funcionalidades **já implementadas** (mapeadas no código):

| Área | Recurso atual |
|------|---------------|
| **Multi-clínica** | Usuários vinculados a clínicas (`users_to_clinics`) — uma conta pode pertencer a várias clínicas |
| **Médicos (CRUD)** | Nome, especialidade, foto, dias/horários de disponibilidade, valor da consulta |
| **Pacientes (CRUD)** | Nome, e-mail, telefone, sexo |
| **Agendamentos (CRUD)** | Data/hora, médico, paciente, valor; verificação de horários disponíveis |
| **Dashboard** | Métricas e gráficos (Recharts), card de próximos agendamentos |
| **Autenticação** | Cadastro/login seguro + login social Google (OAuth) |
| **Assinatura** | Stripe com **um único plano ("Essential")**, portal do cliente e webhook |
| **Trial / Demo** | Usuário demo com período de teste (`demoTrialEndsAt`) + banners de trial |
| **Landing** | Hero, recursos, benefícios, depoimentos, contato, termos e privacidade, dark mode |

**Limitação atual:** existe **apenas 1 plano** de cobrança. Este documento estrutura **4 planos** e define quais recursos (atuais e novos) entram em cada um.

---

## 2) Novas funcionalidades propostas (roadmap por valor)

Para sustentar 4 níveis de plano e competir com iClinic/Feegow/Ninsaúde, propõe-se adicionar:

**Atendimento & agenda**
- 🔔 **Lembretes automáticos** por WhatsApp, SMS e e-mail (reduz faltas/no-show)
- 🌐 **Agendamento online público** (página da clínica para o paciente marcar sozinho)
- 🕒 **Lista de espera e encaixe**, confirmação/remarcação pelo paciente
- 📋 **Fila de atendimento** e status (aguardando, em atendimento, finalizado)

**Prontuário & clínico**
- 🗂️ **Prontuário eletrônico completo**: evolução, templates por especialidade, anexos de exames, anamnese digital
- 💊 **Prescrição digital** com assinatura **ICP-Brasil** e envio ao paciente
- 🎥 **Telemedicina** (teleconsulta por vídeo) com registro em prontuário
- 🤖 **Assistente de IA**: transcrição e resumo da consulta, sugestão de CID, organização da agenda — **em conformidade com a Resolução CFM nº 2.454/2026**

**Financeiro & faturamento**
- 💰 **Módulo financeiro**: contas a pagar/receber, fluxo de caixa, comissionamento por médico
- 🏥 **Faturamento de convênios (TISS/TUSS)** — guias e remessas no padrão ANS
- 🧾 Emissão de recibos/NF de serviço, conciliação de recebíveis

**Gestão & inteligência**
- 👥 **Perfis e permissões** (administrador, médico, recepção, financeiro)
- 🏢 **Multi-unidades** com painel consolidado
- 📊 **Relatórios e BI**: taxa de no-show, ocupação de agenda, receita por médico/convênio, NPS
- 🔌 **API, webhooks e integrações** (Google Calendar, Memed, gateways, laboratórios)
- 🛡️ **Logs de auditoria imutáveis** e exportação/portabilidade de dados (LGPD/CFM)
- 😀 **Pesquisa de satisfação (NPS)** pós-consulta

> 🔒 **Princípio de empacotamento:** a diferenciação entre planos é por **número de profissionais, unidades, recursos (telemedicina, financeiro, TISS, IA, API) e nível de suporte** — **nunca por armazenamento em GB**. Anexos de exames e prontuários seguem **Política de Uso Justo**, sem cobrança por gigabyte.

---

## 3) Análise de mercado (Brasil, 2026)

### 3.1 Concorrentes e preços de referência

| Sistema | Modelo | Faixa de preço (referência) |
|---------|--------|------------------------------|
| **iClinic** | Por profissional | Starter ~R$ 89 · Plus ~R$ 119 · Premium ~R$ 299 /prof./mês |
| **Feegow** | Free + por profissional | Free (até ~100 pacientes) · pagos **R$ 99–149/prof./mês** |
| **Ninsaúde / Clinicorp / iClin** | Por profissional / módulos | **R$ 90–250/prof./mês** conforme módulos |
| **ERP clínico completo (PME)** | Por clínica/unidade | **R$ 300–800+/mês** |

> Preços de concorrentes são públicos/estimados e datados (base 2024–2026, alguns não divulgam tabela). Servem de **âncora**, não de cópia.

### 3.2 Faixas e posicionamento

- **Consultório solo / início:** R$ 0 – R$ 130 (entrada, 1–3 profissionais).
- **Clínica pequena/média:** R$ 200 – R$ 400 (prontuário completo, telemedicina, financeiro).
- **Rede / multi-unidade:** R$ 600+ (multi-unidades, API, white-label, SLA).

**Posicionamento do Dr. Schedule:**
1. **Inicial (grátis):** aquisição (PLG) — consultório solo testa a agenda sem cartão.
2. **Starter:** entrada acessível, abaixo do iClinic Plus, para consultórios de até 3 profissionais.
3. **Pro:** o "sweet spot" — alinhado ao iClinic Premium (~R$ 299), com prontuário completo, telemedicina, financeiro, TISS e IA.
4. **Enterprise:** redes e clínicas grandes — multi-unidade, API, white-label, conformidade reforçada e SLA.

**Diferenciais competitivos:** cobrança em Real com NF, **conformidade nativa (CFM/LGPD/SBIS)**, IA em dia com a CFM 2.454/2026, e preço por clínica com profissionais inclusos (previsível), em vez de só "por profissional".

---

## 4) Conformidade legal e regulatória (saúde) — "nada irregular"

Por tratar **dados sensíveis de saúde**, o produto exige cuidados específicos:

- **LGPD (Lei 13.709/2018):** dados de saúde são **sensíveis (art. 11)** — base legal e **consentimento documentado** do paciente, política de retenção com prazos, **notificação à ANPD em até 72h** em incidentes, e direito de **exportar/excluir** dados do titular. DPA disponível para clínicas (operador/controlador).
- **CFM — Prontuário Eletrônico (Resolução 1.821/2007 + Manual SBIS):** autenticação individual por profissional, **log de auditoria imutável**, criptografia em repouso e em trânsito, backup com redundância e **controle de acesso por perfil**.
- **Certificação SBIS/CFM (NGS1/NGS2/NGS3):** o sistema busca aderência aos requisitos; **assinatura digital ICP-Brasil** é exigida para eliminar o papel (NGS3). Documentar o nível pretendido e não prometer certificação que ainda não se tem (evita propaganda enganosa).
- **Telemedicina (regulamentação CFM):** teleconsulta registrada em prontuário (SRES), com identificação do médico (nome + CRM), dados do paciente, data/hora e **assinatura ICP-Brasil**.
- **IA na medicina — Resolução CFM nº 2.454/2026:** uso de IA deve observar LGPD e segurança da informação em saúde; **a IA apoia, não substitui** a decisão médica. (Vigência após 180 dias da publicação — adaptar até lá.)
- **Faturamento (TISS/TUSS – ANS):** seguir os padrões de troca de informação em saúde suplementar para guias de convênios.
- **CDC (Lei 8.078/1990) e Decreto 11.034/2022:** preço/condições claros, **direito de arrependimento em 7 dias** (art. 49), e **cancelamento tão fácil quanto a contratação** (portal Stripe self-service).
- **Tributação SaaS:** incidência de **ISS** (LC 116/2003, item 1.05); para B2B, possibilidade de destacar valores + impostos conforme regime; emissão de NF-e de serviço.
- **Pagamentos:** processamento via gateway **PCI-DSS** (Stripe); não armazenamos dados de cartão.

> ⚖️ Este documento é um guia de produto/precificação e **não substitui parecer jurídico/contábil nem a obtenção das certificações (SBIS/ICP-Brasil)**. Recomenda-se validar com advogado, contador e DPO antes do go-live, especialmente prontuário, telemedicina e tratamento de dados sensíveis.

---

## 5) Os 4 planos

> Preço **por clínica**, com profissionais inclusos; profissionais extras como add-on. Pacientes e agendamentos **ilimitados** nos planos pagos (uso justo). **Sem limite de armazenamento em GB.**

### 🆓 Inicial — **R$ 0** (para sempre)
_Para o consultório solo começar a organizar a agenda. Sem cartão de crédito._

- 1 clínica · **1 profissional**
- Até **50 pacientes ativos** e **60 agendamentos/mês**
- Agenda e cadastro de médicos e pacientes
- Dashboard básico (agendamentos do dia/semana)
- Lembrete de consulta por **e-mail**
- Suporte: central de ajuda / comunidade

### ⭐ Starter — **R$ 129/mês** · ou **R$ 1.238/ano** (≈ R$ 103/mês, ~20% off)
_Para consultórios em crescimento (até 3 profissionais)._

Tudo do Inicial, mais:
- Até **3 profissionais** _(profissional extra: + R$ 39/mês)_
- **Pacientes e agendamentos ilimitados** (uso justo)
- **Lembretes automáticos** por **WhatsApp e e-mail** (anti no-show)
- **Agendamento online público** (página da clínica)
- **Prontuário eletrônico básico** (evolução + anexos)
- Lista de espera e confirmação/remarcação pelo paciente
- Relatórios essenciais (faturamento, ocupação, no-show)
- Perfis básicos (admin e recepção)
- Sem anúncios · Suporte por **e-mail**

### 💎 Pro — **R$ 299/mês** · ou **R$ 2.870/ano** (≈ R$ 239/mês, ~20% off) — **MAIS POPULAR**
_Para clínicas que querem prontuário completo, telemedicina e faturamento._

Tudo do Starter, mais:
- Até **10 profissionais** _(profissional extra: + R$ 49/mês)_
- **Prontuário eletrônico completo**: templates por especialidade, anamnese digital, anexos de exames
- **Prescrição digital** com assinatura **ICP-Brasil**
- **Telemedicina** (teleconsulta por vídeo) registrada em prontuário
- **Módulo financeiro**: contas a pagar/receber, fluxo de caixa, comissão por médico
- **Faturamento de convênios (TISS/TUSS)**
- **Relatórios avançados / BI** (receita por médico/convênio, NPS)
- **Assistente de IA** (transcrição/resumo de consulta, sugestão de CID) — conforme CFM 2.454/2026
- Permissões por perfil (admin, médico, recepção, financeiro)
- Integrações (Google Calendar, Memed) · **Suporte prioritário**

### 🏢 Enterprise — **R$ 699/mês** (base) · ou **R$ 6.710/ano** · ou **sob consulta**
_Para redes, grupos e clínicas grandes. NF-e e contrato._

Tudo do Pro, mais:
- **Multi-unidades** com painel consolidado · **profissionais ilimitados**
- **SSO / login corporativo** (Google Workspace / SAML)
- **API e webhooks** para integrações (laboratórios, ERPs, BI externo)
- **White-label** (logo, cores e domínio personalizado)
- **Logs de auditoria imutáveis** e **DPA (LGPD)** + controles de retenção
- Exportação em massa e **portabilidade de dados** do paciente
- **Gerente de conta dedicado**, onboarding e treinamento das equipes
- **SLA** e **suporte prioritário 24/7**

---

## 6) Comparativo de planos

| Recurso | Inicial | Starter | Pro | Enterprise |
|---|:---:|:---:|:---:|:---:|
| Preço mensal | **R$ 0** | **R$ 129** | **R$ 299** | **R$ 699** (base) |
| Preço anual | — | R$ 1.238 | R$ 2.870 | R$ 6.710 |
| Profissionais inclusos | 1 | 3 | 10 | Ilimitado |
| Profissional extra | — | + R$ 39 | + R$ 49 | — |
| Clínicas / unidades | 1 | 1 | 1 | Multi-unidade |
| Pacientes | 50 ativos | Ilimitado | Ilimitado | Ilimitado |
| Agendamentos | 60/mês | Ilimitado | Ilimitado | Ilimitado |
| Lembretes automáticos | E-mail | WhatsApp + e-mail | WhatsApp + e-mail | WhatsApp + e-mail |
| Agendamento online público | ❌ | ✅ | ✅ | ✅ |
| Prontuário eletrônico | ❌ | Básico | Completo + templates | Completo + templates |
| Prescrição digital (ICP-Brasil) | ❌ | ❌ | ✅ | ✅ |
| Telemedicina (vídeo) | ❌ | ❌ | ✅ | ✅ |
| Módulo financeiro | ❌ | ❌ | ✅ | ✅ |
| Faturamento TISS/convênios | ❌ | ❌ | ✅ | ✅ |
| Assistente de IA (CFM 2.454/2026) | ❌ | ❌ | ✅ | ✅ |
| Relatórios / BI | Básico | Essencial | Avançado | Avançado + multi-unidade |
| Perfis e permissões | ❌ | Básico | Completo | Completo |
| SSO / SAML | ❌ | ❌ | ❌ | ✅ |
| API / Webhooks | ❌ | ❌ | Integrações | ✅ completo |
| White-label | ❌ | ❌ | ❌ | ✅ |
| Auditoria imutável + DPA | ❌ | ❌ | Logs | ✅ completo |
| Suporte | Comunidade | E-mail | Prioritário | 24/7 + SLA + gerente |

> Nenhum plano usa armazenamento em GB como limite — a diferenciação é por profissionais, unidades, recursos e suporte.

---

## 7) Resumo de preços

| Plano | Mensal | Anual | Equivalente/mês | Público-alvo |
|-------|--------|-------|-----------------|--------------|
| Inicial | **R$ 0** | — | — | Consultório solo iniciando |
| Starter | **R$ 129** | **R$ 1.238** | R$ 103 | Consultório até 3 profissionais |
| Pro ⭐ | **R$ 299** | **R$ 2.870** | R$ 239 | Clínica que quer prontuário+telemed+financeiro |
| Enterprise | **R$ 699** (base) | **R$ 6.710** | R$ 559 | Redes e multi-unidade |

**Add-ons (opcionais):** profissional extra (Starter +R$ 39 / Pro +R$ 49), unidade adicional (Enterprise), pacote de teleconsultas, white-label, onboarding/treinamento avulso.

> Anual ≈ **2 meses grátis** (~20% off). Pagamentos via Stripe. Cancele quando quiser pelo portal. Reembolso em até 7 dias (CDC art. 49).

---

## 8) Justificativa de precificação

- **Inicial R$ 0:** motor de aquisição (PLG). Limites por **itens** (1 profissional, 50 pacientes, 60 agendamentos/mês) — generoso para criar hábito, restrito para incentivar upgrade ao crescer.
- **Starter R$ 129:** posicionado **acima do Feegow básico e abaixo do iClinic Plus**, mas entregando 3 profissionais inclusos + lembretes WhatsApp + agendamento online — forte custo-benefício para consultórios.
- **Pro R$ 299:** alinhado ao **iClinic Premium (~R$ 299)**, justificado por prontuário completo, telemedicina, financeiro, TISS e IA. Plano-alvo de maior margem.
- **Enterprise R$ 699+:** faixa de ERP clínico/rede, com multi-unidade, API, white-label, conformidade reforçada e SLA — valor escala com unidades e profissionais.

**Métricas SaaS sugeridas:** conversão free→paid, MRR/ARR, ARPU por clínica, churn, LTV/CAC, expansão (profissionais/unidades adicionais), no-show evitado (valor entregue).

---

## 9) Fontes (pesquisa de mercado e regulatória, jun/2026)

- iClinic — software e preços: https://iclinic.com.br/precos/ · análise: https://analister.com/ferramentas/iclinic
- Comparativo de softwares para clínica 2026 (ByDoctor): https://bydoctor.com.br/blog/melhor-software-para-clinica
- Clinicorp vs Feegow: https://vereditogestao.com.br/clinicorp-ou-feegow/
- Prontuário Eletrônico e CFM — requisitos/segurança/certificação (ByDoctor): https://bydoctor.com.br/blog/prontuario-eletronico-cfm-requisitos-seguranca-certificacao
- Certificação SBIS (Bry): https://www.bry.com.br/blog/certificacao-sbis/ · ProDoctor: https://prodoctor.net/blog/a-certificacao-sbis-no-prontuario-eletronico-do-paciente-e-obrigatoria/
- CFM regulamenta IA na medicina (Resolução 2.454/2026): https://portal.cfm.org.br/noticias/cfm-normatiza-uso-da-ia-na-medicina/
- CFM — Telemedicina: https://portal.cfm.org.br/noticias/apos-amplo-debate-cfm-regulamenta-pratica-da-telemedicina-no-brasil/

> Valores de concorrentes são públicos/estimados e datados; podem mudar. Revise antes de publicar comparações. A conformidade efetiva (SBIS/ICP-Brasil/LGPD) depende de implementação técnica e auditoria.
