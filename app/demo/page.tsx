import {
  RiFileEditLine,
  RiSearchLine,
  RiShieldCheckLine,
  RiArrowRightLine,
} from "@remixicon/react";
import Link from "next/link";

const quickLinks = [
  {
    title: "Schadensdarstellung schreiben",
    description: "KI-gestützte Erstellung von Schadensdarstellungen",
    href: "/demo/schadensdarstellung-schreiben",
    icon: RiFileEditLine,
  },
  {
    title: "Gutachten suchen",
    description: "Semantische Suche in allen Gutachten",
    href: "/demo/gutachten-suchen",
    icon: RiSearchLine,
  },
  {
    title: "Qualitätsmanagement",
    description: "Regeln verwalten und Gutachten prüfen",
    href: "/demo/qualitaetsmanagement/pruefung",
    icon: RiShieldCheckLine,
  },
];

export default function DemoPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-10">
        <p className="text-muted-foreground text-sm">Willkommen zurück,</p>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">
          Aron Scheffczyk
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-xl border p-5 transition-colors hover:bg-muted/50"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <link.icon className="size-5 text-primary" />
            </div>
            <h2 className="text-sm font-medium">{link.title}</h2>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {link.description}
            </p>
            <div className="text-muted-foreground mt-3 flex items-center gap-1 text-xs group-hover:text-foreground transition-colors">
              Öffnen
              <RiArrowRightLine className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
