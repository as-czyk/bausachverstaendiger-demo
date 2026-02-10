import Image from "next/image";
import {
  RiArrowRightLine,
  RiCameraLine,
  RiFileTextLine,
  RiSearchLine,
  RiFolderLine,
  RiShieldCheckLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    label: "Erstellen",
    title: "Schadensdarstellung schreiben",
    painPoints: [
      "15 Fotos vom Wasserschaden + Messwerte dokumentiert",
      "Jetzt: Alles in Flie\u00dftext umwandeln",
      "30 Minuten Schreibarbeit \u2013 bei jedem Gutachten",
      "\u201EFeuchtemessung ergab...\u201C \u2013 immer wieder dasselbe",
    ],
    iconFrom: RiCameraLine,
    iconTo: RiFileTextLine,
  },
  {
    number: "02",
    label: "Recherchieren",
    title: "\u00c4hnliche F\u00e4lle finden",
    painPoints: [
      "\u201EWo war nochmal das Schimmelgutachten von 2022?\u201C",
      "PDFs auf Laufwerk durchsuchen",
      "Textbausteine rauskopieren",
      "Oft aufwendiger als neu schreiben",
    ],
    iconFrom: RiSearchLine,
    iconTo: RiFolderLine,
  },
  {
    number: "03",
    label: "Pr\u00fcfen",
    title: "Qualit\u00e4tspr\u00fcfung vor Abgabe",
    painPoints: [
      "Wurden alle DIN-Normen ber\u00fccksichtigt?",
      "Plausibilit\u00e4tspr\u00fcfung vollst\u00e4ndig?",
      "Alle Fotos im Text referenziert?",
      "Keine Zeit f\u00fcr Vier-Augen-Prinzip \u2013 Haftungsrisiko",
    ],
    iconFrom: RiShieldCheckLine,
    iconTo: RiShieldCheckLine,
  },
];

export default function Page() {
  return (
    <div className="h-svh flex flex-col overflow-hidden">
      {/* ── Header / Branding ── */}
      <header className="flex items-center gap-3 px-6 pt-5 shrink-0">
        <Image
          src="/aron-profile.png"
          alt="Aron Scheffczyk"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-tight">
            Aron Scheffczyk
          </span>
          <a
            href="https://agentenschmiede.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Image
              src="/agentenschmiede-logo.png"
              alt="Agentenschmiede"
              width={14}
              height={14}
              className="shrink-0"
            />
            agentenschmiede
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center gap-3 px-6 pt-12 pb-8 text-center sm:pt-16 sm:pb-10">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          KI-gestützte Prüfungslösung
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Kennen Sie das aus Ihrem Büro?
        </h1>
        <p className="text-muted-foreground max-w-lg text-lg">
          Drei typische Aufgaben, die jeden Bausachverständigen Zeit und Nerven
          kosten – und wie KI sie in Minuten erledigt.
        </p>
      </section>

      {/* ── Steps ── */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-8 flex-1 flex flex-col">
        {/* Step indicator bar (desktop) */}
        <div className="mb-8 hidden items-center justify-center gap-0 md:flex">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-xs font-bold">
                  {s.number}
                </span>
                <span className="text-sm font-medium">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <RiArrowRightSLine className="text-muted-foreground mx-6 size-5 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const IconFrom = step.iconFrom;
            const IconTo = step.iconTo;
            return (
              <div
                key={step.number}
                className="ring-border group relative flex flex-col gap-5 rounded-xl bg-white p-6 shadow-xs ring-1 transition-shadow hover:shadow-md"
              >
                {/* Number + Icons */}
                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground text-3xl font-bold tabular-nums leading-none">
                    {step.number}
                  </span>
                  <div className="bg-muted flex items-center gap-1.5 rounded-lg px-3 py-2">
                    <IconFrom className="text-muted-foreground size-5" />
                    <RiArrowRightLine className="text-muted-foreground/50 size-3.5" />
                    <IconTo className="text-primary size-5" />
                  </div>
                </div>

                {/* Copy */}
                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-base font-semibold leading-snug">
                    {step.title}
                  </h3>
                  <ul className="text-muted-foreground space-y-1 text-sm leading-relaxed">
                    {step.painPoints.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="text-muted-foreground/40 select-none">
                          &#x2022;
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobile step label */}
                <span className="bg-muted text-muted-foreground mt-auto w-fit rounded-full px-3 py-1 text-xs font-medium md:hidden">
                  Schritt {step.number}: {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="flex flex-col items-center gap-2 px-6 pb-8 shrink-0">
        <Button size="lg" className="gap-2 px-6 text-base" asChild>
          <a href="/demo">
            Demo starten
            <RiArrowRightLine className="size-4" />
          </a>
        </Button>
      </section>
    </div>
  );
}
