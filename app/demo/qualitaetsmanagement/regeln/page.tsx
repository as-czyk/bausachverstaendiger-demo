"use client";

import { useState } from "react";
import { RiErrorWarningLine, RiAlertLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ── Types ───────────────────────────────────────────────────────────

interface Regel {
  id: string;
  titel: string;
  beschreibung: string;
  details: string[];
  kategorie: "schimmel" | "allgemein";
  gutachtenarten: string[];
}

// ── Rules data ──────────────────────────────────────────────────────

const regeln: Regel[] = [
  // Schimmelgutachten-spezifisch
  {
    id: "S-01",
    titel: "Unvollst\xe4ndige Ursachenermittlung",
    beschreibung:
      "Gutachter schlie\xdft vorschnell auf \u201Efalsches L\xfcftungsverhalten\u201C des Mieters, ohne alle baulichen Ursachen gepr\xfcft zu haben.",
    details: [
      "Keine ausreichende Feuchtemessung (Bohrlochmethode fehlt)",
      "Keine W\xe4rmebr\xfcckenmessung (Thermografie)",
      "Keine Langzeitaufzeichnung des Raumklimas (Datenlogger \xfcber 3 Wochen)",
      "Keine Pr\xfcfung baulicher M\xe4ngel (D\xe4mmung, Abdichtung)",
    ],
    kategorie: "schimmel",
    gutachtenarten: ["Schimmelgutachten"],
  },
  {
    id: "S-02",
    titel: "Falsche Messtechnik",
    beschreibung:
      "Einfache elektrische Widerstandsmessger\xe4te liefern irrelevante Werte. Oberfl\xe4chenmessung statt Tiefenmessung.",
    details: [
      "Korrekt: Bohrlochmethode (8 cm Tiefe)",
      "Rel. Luftfeuchtigkeit >95% = Wasserschaden",
      "Oberfl\xe4chenmessger\xe4te sind f\xfcr Schimmelursachenanalyse ungeeignet",
    ],
    kategorie: "schimmel",
    gutachtenarten: ["Schimmelgutachten", "Feuchtigkeitsschadengutachten"],
  },
  {
    id: "S-03",
    titel: "Einseitige Schuldzuweisung",
    beschreibung:
      "Gutachter geht mit vorgefertigter Meinung an die Untersuchung. Plausibilit\xe4tspr\xfcfung fehlt: Wurden ALLE m\xf6glichen Ursachen ausgeschlossen?",
    details: [
      "Keine neutrale Herangehensweise an die Schadensursache",
      "Fehlende Pr\xfcfung alternativer Ursachen (baulich, nutzungsbedingt, extern)",
      "Kein Ausschlussverfahren dokumentiert",
    ],
    kategorie: "schimmel",
    gutachtenarten: ["Schimmelgutachten"],
  },
  {
    id: "S-04",
    titel: "Unzureichende Dokumentation",
    beschreibung:
      "Keine Fotodokumentation der betroffenen Stellen, fehlende Messwerttabellen, keine Darstellung der Historie.",
    details: [
      "Fotodokumentation der betroffenen Stellen fehlt",
      "Keine Messwerttabellen beigef\xfcgt",
      "Historie (Vorbefunde, Reparaturen) nicht dargestellt",
    ],
    kategorie: "schimmel",
    gutachtenarten: [
      "Schimmelgutachten",
      "Feuchtigkeitsschadengutachten",
      "Wasserschadengutachten",
    ],
  },
  // Allgemeine Gutachtenfehler
  {
    id: "A-01",
    titel: "Vermischung von Sach- und Rechtsfragen",
    beschreibung:
      "Gutachter darf NUR Sachfragen beantworten. Rechtliche Bewertung (z.B. \u201EMangel liegt vor\u201C) ist Aufgabe des Gerichts/Anwalts.",
    details: [
      "Gutachter \xfcberschreitet seine Kompetenz",
      "Rechtsbegriffe wie \u201EMangel\u201C oder \u201EHaftung\u201C d\xfcrfen nicht verwendet werden",
      "Stattdessen: technische Abweichungen benennen und bewerten",
    ],
    kategorie: "allgemein",
    gutachtenarten: [
      "Gerichtsgutachten",
      "Privatgutachten",
      "Versicherungsgutachten",
    ],
  },
  {
    id: "A-02",
    titel: "Fehlende Plausibilit\xe4tspr\xfcfung",
    beschreibung:
      "Wurden andere m\xf6gliche Ursachen ausgeschlossen? Nur EINE Ursache genannt, ohne Alternativen zu pr\xfcfen.",
    details: [
      "Beispiel Riss in der Wand: M\xf6gliche Ursachen sind Setzung, Materialfehler, Ersch\xfctterung, Temperatur",
      "Alle Ursachen m\xfcssen benannt und systematisch ausgeschlossen werden",
      "Ausschlussverfahren dokumentieren",
    ],
    kategorie: "allgemein",
    gutachtenarten: [
      "Bauschadensgutachten",
      "Baum\xe4ngelgutachten",
      "Gerichtsgutachten",
    ],
  },
  {
    id: "A-03",
    titel: "Unvollst\xe4ndige Bestandsaufnahme",
    beschreibung:
      "Nicht alle relevanten Bauteile untersucht. Versteckte Sch\xe4den nicht aufgedeckt.",
    details: [
      "Hinter Verkleidungen, unter Estrich nicht gepr\xfcft",
      "Keine Bauteil\xf6ffnung wo n\xf6tig",
      "Angrenzende Bauteile nicht mit untersucht",
    ],
    kategorie: "allgemein",
    gutachtenarten: [
      "Bauschadensgutachten",
      "Baum\xe4ngelgutachten",
      "Hauskaufgutachten",
    ],
  },
  {
    id: "A-04",
    titel: "Fehlende Norm-Referenzen",
    beschreibung:
      "Gutachten nennt nicht die relevanten DIN-Normen. VOB/B, VOB/C nicht zitiert bei M\xe4ngeln.",
    details: [
      "DIN 18202 (Toleranzen im Hochbau) nicht herangezogen",
      "VOB/B und VOB/C bei M\xe4ngelgutachten nicht zitiert",
      "Keine Gegen\xfcberstellung Ist-/Soll-Zustand nach Norm",
    ],
    kategorie: "allgemein",
    gutachtenarten: [
      "Baum\xe4ngelgutachten",
      "Gerichtsgutachten",
      "Bauschadensgutachten",
    ],
  },
  {
    id: "A-05",
    titel: "Ungenaue Schadensermittlung (Massenermittlung)",
    beschreibung:
      "Schadensumfang nicht exakt festgestellt. Sanierungskosten nicht plausibel.",
    details: [
      "Schadensumfang nicht quantifiziert (Fl\xe4che, L\xe4nge, Tiefe)",
      "Keine Unterscheidung: Neu-/Altschaden",
      "Sanierungskosten ohne Aufma\xdf und Einheitspreise",
    ],
    kategorie: "allgemein",
    gutachtenarten: [
      "Bauschadensgutachten",
      "Versicherungsgutachten",
      "Wasserschadengutachten",
    ],
  },
  {
    id: "A-06",
    titel: "Vorsch\xe4den nicht ber\xfccksichtigt",
    beschreibung:
      "Fr\xfchere Sch\xe4den nicht dokumentiert. Altsch\xe4den werden dem aktuellen Verursacher angelastet.",
    details: [
      "Wurden fr\xfchere Sch\xe4den dokumentiert?",
      "Haben Vorsch\xe4den Einfluss auf aktuellen Zustand?",
      "Abgrenzung Alt-/Neuschaden fehlt",
    ],
    kategorie: "allgemein",
    gutachtenarten: [
      "Versicherungsgutachten",
      "Gerichtsgutachten",
      "Bauschadensgutachten",
    ],
  },
  {
    id: "A-07",
    titel: "Mangelhafte Fotodokumentation",
    beschreibung:
      "Zu wenige Fotos, ohne Ma\xdfstab/Referenz. Keine \xdcbersichtsfotos (Raum \u2192 Detail).",
    details: [
      "Fotos ohne Ma\xdfstab oder Referenzobjekt",
      "Keine \xdcbersichts-zu-Detail-Abfolge",
      "Messpunkte nicht fotografisch dokumentiert",
    ],
    kategorie: "allgemein",
    gutachtenarten: [
      "Bauschadensgutachten",
      "Baum\xe4ngelgutachten",
      "Schimmelgutachten",
      "Hauskaufgutachten",
    ],
  },
  {
    id: "A-08",
    titel: "Unklare Handlungsempfehlungen",
    beschreibung:
      "Sanierungskonzept fehlt oder ist zu vage. Keine konkreten Ma\xdfnahmen zur M\xe4ngelbeseitigung.",
    details: [
      "Kein konkretes Sanierungskonzept",
      "Keine Risikoeinsch\xe4tzung f\xfcr zuk\xfcnftige Sch\xe4den",
      "Fehlende Priorisierung der Ma\xdfnahmen",
    ],
    kategorie: "allgemein",
    gutachtenarten: [
      "Bauschadensgutachten",
      "Baum\xe4ngelgutachten",
      "Privatgutachten",
    ],
  },
];

// ── All Gutachtenarten (from search filters) ────────────────────────

const alleGutachtenarten = [
  "Bauschadensgutachten",
  "Baum\xe4ngelgutachten",
  "Schimmelgutachten",
  "Feuchtigkeitsschadengutachten",
  "Wasserschadengutachten",
  "Hauskaufgutachten",
  "Gerichtsgutachten",
  "Privatgutachten",
  "Versicherungsgutachten",
];

// ── Page ────────────────────────────────────────────────────────────

export default function RegelnPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = activeFilter
    ? regeln.filter((r) => r.gutachtenarten.includes(activeFilter))
    : regeln;

  const schimmelRegeln = filtered.filter((r) => r.kategorie === "schimmel");
  const allgemeineRegeln = filtered.filter((r) => r.kategorie === "allgemein");

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {"Pr\xfcfregeln"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {"Regeln f\xfcr die automatische Qualit\xe4tspr\xfcfung von Gutachten, zugeordnet nach Gutachtenart"}
        </p>
      </div>

      {/* Filter pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          variant={activeFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter(null)}
        >
          Alle ({regeln.length})
        </Button>
        {alleGutachtenarten.map((ga) => {
          const count = regeln.filter((r) =>
            r.gutachtenarten.includes(ga),
          ).length;
          if (count === 0) return null;
          return (
            <Button
              key={ga}
              variant={activeFilter === ga ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setActiveFilter(activeFilter === ga ? null : ga)
              }
            >
              {ga} ({count})
            </Button>
          );
        })}
      </div>

      {/* Schimmelgutachten rules */}
      {schimmelRegeln.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <RiAlertLine className="text-chart-1 size-5" />
            <h2 className="text-lg font-semibold">
              {"Schimmelgutachten \u2013 Typische Fehler"}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {schimmelRegeln.map((regel) => (
              <RegelCard key={regel.id} regel={regel} />
            ))}
          </div>
        </section>
      )}

      {/* Allgemeine rules */}
      {allgemeineRegeln.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <RiErrorWarningLine className="text-muted-foreground size-5" />
            <h2 className="text-lg font-semibold">
              {"Allgemeine Gutachtenfehler"}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {allgemeineRegeln.map((regel) => (
              <RegelCard key={regel.id} regel={regel} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <RiErrorWarningLine className="text-muted-foreground/30 size-10" />
          <p className="text-muted-foreground text-sm">
            {"Keine Regeln f\xfcr diese Gutachtenart hinterlegt."}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Rule card ───────────────────────────────────────────────────────

function RegelCard({ regel }: { regel: Regel }) {
  return (
    <div className="ring-border rounded-xl p-5 ring-1 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-mono">
              {regel.id}
            </span>
            <h3 className="text-sm font-semibold">{regel.titel}</h3>
          </div>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {regel.beschreibung}
          </p>
        </div>
      </div>

      {/* Detail checklist */}
      <ul className="mt-3 space-y-1">
        {regel.details.map((d) => (
          <li
            key={d}
            className="text-muted-foreground flex gap-2 text-sm"
          >
            <span className="text-destructive select-none shrink-0">{"\u2716"}</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>

      {/* Gutachtenart tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {regel.gutachtenarten.map((ga) => (
          <Badge key={ga} variant="secondary" className="font-normal">
            {ga}
          </Badge>
        ))}
      </div>
    </div>
  );
}
