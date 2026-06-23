"use client";

import { Check, Stethoscope } from "lucide-react";
import Link from "next/link";
import { ReactNode, RefObject, useEffect, useRef, useState } from "react";

/* ===== olhos animados que seguem o cursor (adaptado de login.md) ===== */
function useMouse() {
  const [m, setM] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => setM({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return m;
}

function EyeBall({
  size = 18,
  pupil = 7,
  max = 5,
  blink = false,
  mouse,
}: {
  size?: number;
  pupil?: number;
  max?: number;
  blink?: boolean;
  mouse: { x: number; y: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  let x = 0;
  let y = 0;
  if (ref.current) {
    const r = ref.current.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2);
    const dy = mouse.y - (r.top + r.height / 2);
    const dist = Math.min(Math.hypot(dx, dy), max);
    const a = Math.atan2(dy, dx);
    x = Math.cos(a) * dist;
    y = Math.sin(a) * dist;
  }
  return (
    <div
      ref={ref}
      className="flex items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-150"
      style={{ width: size, height: blink ? 2 : size }}
    >
      {!blink && (
        <div
          className="rounded-full"
          style={{
            width: pupil,
            height: pupil,
            background: "#1e293b",
            transform: `translate(${x}px,${y}px)`,
            transition: "transform .1s ease-out",
          }}
        />
      )}
    </div>
  );
}

function Characters() {
  const mouse = useMouse();
  const [blinkA, setBlinkA] = useState(false);
  const [blinkB, setBlinkB] = useState(false);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(
        () => {
          setBlinkA(true);
          setTimeout(() => {
            setBlinkA(false);
            loop();
          }, 150);
        },
        Math.random() * 4000 + 3000,
      );
    };
    loop();
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(
        () => {
          setBlinkB(true);
          setTimeout(() => {
            setBlinkB(false);
            loop();
          }, 150);
        },
        Math.random() * 4000 + 3500,
      );
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  const lean = (ref: RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return 0;
    const r = ref.current.getBoundingClientRect();
    return Math.max(-6, Math.min(6, -(mouse.x - (r.left + r.width / 2)) / 120));
  };

  return (
    <div className="relative" style={{ width: 460, height: 340 }}>
      {/* azul (fundo) */}
      <div
        ref={aRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 60,
          width: 150,
          height: 340,
          background: "#2563eb",
          borderRadius: "12px 12px 0 0",
          zIndex: 1,
          transform: `skewX(${lean(aRef)}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div className="absolute flex gap-6" style={{ left: 40, top: 38 }}>
          <EyeBall mouse={mouse} blink={blinkA} />
          <EyeBall mouse={mouse} blink={blinkA} />
        </div>
      </div>
      {/* escuro (meio) */}
      <div
        ref={bRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 205,
          width: 104,
          height: 268,
          background: "#0f172a",
          borderRadius: "10px 10px 0 0",
          zIndex: 2,
          transform: `skewX(${lean(bRef) * 1.4}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div className="absolute flex gap-5" style={{ left: 24, top: 30 }}>
          <EyeBall mouse={mouse} size={15} pupil={6} max={4} blink={blinkB} />
          <EyeBall mouse={mouse} size={15} pupil={6} max={4} blink={blinkB} />
        </div>
      </div>
      {/* semicírculo ciano (frente esq.) */}
      <div
        className="absolute bottom-0"
        style={{
          left: 0,
          width: 200,
          height: 165,
          background: "#22d3ee",
          borderRadius: "100px 100px 0 0",
          zIndex: 3,
        }}
      >
        <div className="absolute flex gap-6" style={{ left: 68, top: 78 }}>
          <span className="rounded-full" style={{ width: 11, height: 11, background: "#0f172a" }} />
          <span className="rounded-full" style={{ width: 11, height: 11, background: "#0f172a" }} />
        </div>
      </div>
      {/* índigo (frente dir.) com sorriso */}
      <div
        className="absolute bottom-0"
        style={{
          left: 272,
          width: 120,
          height: 198,
          background: "#6366f1",
          borderRadius: "60px 60px 0 0",
          zIndex: 4,
        }}
      >
        <div className="absolute flex gap-5" style={{ left: 44, top: 36 }}>
          <span className="rounded-full" style={{ width: 11, height: 11, background: "white" }} />
          <span className="rounded-full" style={{ width: 11, height: 11, background: "white" }} />
        </div>
        <div
          className="absolute rounded-full"
          style={{ left: 34, top: 78, width: 52, height: 4, background: "white" }}
        />
      </div>
    </div>
  );
}

const PERKS = [
  "Agenda inteligente e lembretes automáticos",
  "Prontuário, pacientes e médicos num só lugar",
  "Dashboard, financeiro e relatórios",
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* lado visual */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 text-white lg:flex">
        <div className="absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-black/10 blur-3xl" />
        <Link href="/" className="relative z-10 flex items-center gap-2 text-lg font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 backdrop-blur">
            <Stethoscope className="h-5 w-5" />
          </span>
          Dr. Schedule
        </Link>

        <div className="relative z-10 flex items-end justify-center">
          <Characters />
        </div>

        <div className="relative z-10 max-w-sm">
          <h2 className="text-2xl font-bold">A gestão da sua clínica, simplificada.</h2>
          <ul className="mt-5 space-y-2.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-white/85">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* lado do formulário */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="bg-primary grid h-9 w-9 place-items-center rounded-lg text-white">
              <Stethoscope className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">Dr. Schedule</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
