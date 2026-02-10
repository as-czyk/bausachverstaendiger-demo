"use client";

import { useState } from "react";
import { RiErrorWarningLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ── Types ───────────────────────────────────────────────────────────

interface Regel {
  id: string;
  kategorie: string;
  titel: string;
  beschreibung: string;
  details: string[];
  gutachtenarten: string[];
  schweregrad: "SEHR HOCH" | "HOCH" | "MITTEL" | "NIEDRIG";
  rechtsgrundlage?: string;
}

// ── Rules data ──────────────────────────────────────────────────────

const regeln: Regel[] = [
  // KATEGORIE 1: PFLICHTDOKUMENTE & UNTERLAGEN
  {
    id: "1.1",
    kategorie: "Pflichtdokumente & Unterlagen",
    titel: "Fotodokumentation unvollständig",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob alle im Text referenzierten Fotos tatsächlich als Anlage vorhanden sind, sodass die Beweiskraft des Gutachtens nicht durch fehlende Bildnachweise beeinträchtigt wird.",
    details: [
      "Text enthält Verweise wie \"siehe Anlage 1, Foto 1-8\"",
      "System prüft: Sind 8 Fotos in Anlage 1 vorhanden?",
      "FEHLER wenn: Anzahl der Fotos < referenzierte Anzahl",
    ],
    gutachtenarten: [
      "Bauschadensgutachten",
      "Baumängelgutachten",
      "Schimmelgutachten",
      "Feuchtigkeitsschadengutachten",
      "Wasserschadengutachten",
      "Hauskaufgutachten",
      "Gerichtsgutachten",
      "Versicherungsgutachten",
    ],
    schweregrad: "HOCH",
  },
  {
    id: "1.2",
    kategorie: "Pflichtdokumente & Unterlagen",
    titel: "Baupläne/Baugenehmigung nicht beigefügt",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob relevante Baupläne oder die Baugenehmigung als Anlage beigefügt sind, sodass Soll-Ist-Vergleiche baulicher Ausführungen nachvollziehbar sind.",
    details: [
      "Gutachten enthält Aussagen zu \"vertraglich vereinbarter Ausführung\" oder \"Abweichung von Bauplan\"",
      "System prüft: Ist Bauplan/Baugenehmigung im Anhang?",
      "FEHLER wenn: Verweis ohne beigefügtes Dokument",
    ],
    gutachtenarten: [
      "Bauschadensgutachten",
      "Baumängelgutachten",
      "Gerichtsgutachten",
    ],
    schweregrad: "MITTEL",
  },
  {
    id: "1.3",
    kategorie: "Pflichtdokumente & Unterlagen",
    titel: "Messprotokoll fehlt bei Feuchtemessung",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob bei durchgeführter Feuchtemessung ein vollständiges Messprotokoll mit Messpunkten, Messwerten und Gerätekalibrierung beigefügt ist, sodass die Messergebnisse nachvollziehbar und gerichtsfest sind.",
    details: [
      "Text enthält: \"Feuchtemessung ergab X %\"",
      "System prüft Messprotokoll auf:",
      "✓ Messpunkte dokumentiert (Lage, Tiefe)?",
      "✓ Messmethode genannt (CM-Messung, Bohrlochmethode)?",
      "✓ Gerätekalibrierung dokumentiert?",
      "✓ Datum/Uhrzeit der Messung?",
      "FEHLER wenn: Fehlende Angaben",
    ],
    gutachtenarten: [
      "Schimmelgutachten",
      "Feuchtigkeitsschadengutachten",
      "Wasserschadengutachten",
    ],
    schweregrad: "HOCH",
    rechtsgrundlage: "DIN 18560 (Estrich), WTA-Merkblatt 4-5-99",
  },
  // KATEGORIE 2: NORMKONFORMITÄT & TECHNISCHE STANDARDS
  {
    id: "2.1",
    kategorie: "Normkonformität & Technische Standards",
    titel: "DIN 18202 bei Rissen nicht angewendet",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob bei Rissen in Mauerwerk/Putz die DIN 18202 (Toleranzen im Hochbau) zur Bewertung herangezogen wurde, sodass die Beurteilung \"Mangel oder Toleranz\" normkonform erfolgt.",
    details: [
      "Text enthält: \"Riss\" + Rissbreite in mm",
      "System prüft: Wird DIN 18202, Tabelle 3 zitiert?",
      "System prüft: Wird Sollwert (3 mm/1 m für Innenputz) genannt?",
      "FEHLER wenn: Riss ohne Norm-Referenz bewertet",
    ],
    gutachtenarten: ["Bauschadensgutachten", "Baumängelgutachten"],
    schweregrad: "HOCH",
    rechtsgrundlage: "DIN 18202:2019-07, Tabelle 3, Zeile 6",
  },
  {
    id: "2.2",
    kategorie: "Normkonformität & Technische Standards",
    titel: "Feuchtemessung ohne Sollwert-Angabe",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob bei Feuchtemessungen der normkonforme Sollwert angegeben ist, sodass die Bewertung \"zu feucht\" oder \"belegreif\" nachvollziehbar ist.",
    details: [
      "Text enthält: \"CM-Messung\" oder \"Restfeuchte\" + Prozentwert",
      "System prüft Sollwert-Angabe:",
      "Zementestrich: ≤ 2,0 % (unbeheizt) / ≤ 1,8 % (beheizt)",
      "Calciumsulfatestrich: ≤ 0,5 % (unbeheizt) / ≤ 0,3 % (beheizt)",
      "Mauerwerk: < 2,5 % (normal)",
      "FEHLER wenn: Messwert ohne Sollwert genannt",
    ],
    gutachtenarten: [
      "Schimmelgutachten",
      "Feuchtigkeitsschadengutachten",
      "Wasserschadengutachten",
    ],
    schweregrad: "HOCH",
    rechtsgrundlage: "DIN 18560, TKB-Merkblatt 16",
  },
  {
    id: "2.3",
    kategorie: "Normkonformität & Technische Standards",
    titel: "Wärmebrücke ohne Thermografie-Nachweis",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob bei Verdacht auf Wärmebrücken eine Thermografie-Aufnahme durchgeführt und dokumentiert wurde, sodass die Ursachenermittlung bei Schimmel wasserdicht ist.",
    details: [
      "Text enthält: \"Wärmebrücke\" oder \"Temperaturdifferenz\"",
      "System prüft: Sind Thermografie-Fotos in Anlage?",
      "System prüft: Ist Temperaturdifferenz quantifiziert (°C)?",
      "FEHLER wenn: Wärmebrücke ohne Bildnachweis behauptet",
    ],
    gutachtenarten: [
      "Schimmelgutachten",
      "Feuchtigkeitsschadengutachten",
    ],
    schweregrad: "HOCH",
    rechtsgrundlage: "DIN 4108-2 (Wärmeschutz), DIN EN 13187 (Thermografie)",
  },
  {
    id: "2.4",
    kategorie: "Normkonformität & Technische Standards",
    titel: "Schimmel ohne Feuchtemessung bewertet",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob bei Schimmelbefall IMMER eine Feuchtemessung im Bauteil durchgeführt wurde (Bohrlochmethode, 8 cm Tiefe), sodass die Unterscheidung \"Baumangel vs. Nutzerverhalten\" rechtssicher getroffen wird.",
    details: [
      "Text enthält: \"Schimmel\" oder \"Schimmelpilz\"",
      "System prüft Pflicht-Messungen:",
      "✓ Feuchtemessung im Bauteil (Bohrlochmethode)?",
      "✓ Messtiefe angegeben (mind. 8 cm)?",
      "✓ Grenzwert 95 % rel. LF geprüft?",
      "FEHLER wenn: Schimmel ohne Bauteil-Feuchtemessung",
    ],
    gutachtenarten: ["Schimmelgutachten"],
    schweregrad: "SEHR HOCH",
    rechtsgrundlage: "WTA-Merkblatt 4-5-99, Schimmelpilzleitfaden Umweltbundesamt",
  },
  // KATEGORIE 3: PLAUSIBILITÄTSPRÜFUNG & VOLLSTÄNDIGKEIT
  {
    id: "3.1",
    kategorie: "Plausibilitätsprüfung & Vollständigkeit",
    titel: "Keine Plausibilitätsprüfung bei Schimmel",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob bei Schimmelgutachten ALLE möglichen Ursachen ausgeschlossen wurden, sodass nicht vorschnell auf \"falsches Lüften\" geschlossen wird.",
    details: [
      "Text enthält: \"Schimmel\" + Ursache genannt",
      "System prüft Ausschluss alternativer Ursachen:",
      "✓ Wärmebrücke geprüft? (Thermografie)",
      "✓ Wasserschaden ausgeschlossen? (Feuchtemessung Bauteil)",
      "✓ Abdichtungsmangel geprüft? (bei Keller/Erdgeschoss)",
      "✓ Lüftungsverhalten dokumentiert? (Langzeitaufzeichnung)",
      "FEHLER wenn: Nur 1 Ursache genannt, andere nicht geprüft",
    ],
    gutachtenarten: ["Schimmelgutachten"],
    schweregrad: "SEHR HOCH",
    rechtsgrundlage: "VOB/B § 4 (Sorgfaltspflicht)",
  },
  {
    id: "3.2",
    kategorie: "Plausibilitätsprüfung & Vollständigkeit",
    titel: "Lüftungsverhalten nicht dokumentiert",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob bei Schimmelgutachten das Lüftungsverhalten der Bewohner objektiviert wurde (z.B. Datenlogger 3 Wochen), sodass Schuldzuweisungen an Nutzer belegt sind.",
    details: [
      "Text enthält: \"falsches Lüften\" oder \"unzureichende Lüftung\"",
      "System prüft:",
      "✓ Langzeitaufzeichnung durchgeführt? (mind. 14 Tage)",
      "✓ Raumtemperatur dokumentiert?",
      "✓ Relative Luftfeuchtigkeit dokumentiert?",
      "✓ Lüftungsfrequenz ermittelt?",
      "FEHLER wenn: Lüftungsverhalten ohne Messung bewertet",
    ],
    gutachtenarten: ["Schimmelgutachten"],
    schweregrad: "SEHR HOCH",
    rechtsgrundlage: "DIN 4108-2, Schimmelpilzleitfaden UBA",
  },
  {
    id: "3.3",
    kategorie: "Plausibilitätsprüfung & Vollständigkeit",
    titel: "Oberflächentemperatur nicht gemessen",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob bei Schimmelbefall die Oberflächentemperatur der betroffenen Wand gemessen wurde, sodass Tauwasserausfall als Ursache ausgeschlossen/bestätigt wird.",
    details: [
      "Text enthält: \"Schimmel\" an \"Außenwand\" oder \"Ecke\"",
      "System prüft:",
      "✓ Oberflächentemperatur in °C angegeben?",
      "✓ Raumtemperatur zum Vergleich angegeben?",
      "✓ Temperaturdifferenz berechnet?",
      "✓ Taupunkt-Bewertung durchgeführt?",
      "FEHLER wenn: Schimmel ohne Temperaturmessung",
    ],
    gutachtenarten: ["Schimmelgutachten"],
    schweregrad: "HOCH",
    rechtsgrundlage: "DIN 4108-2 (Mindestwärmeschutz)",
  },
  // KATEGORIE 4: MESSTECHNIK & METHODIK
  {
    id: "4.1",
    kategorie: "Messtechnik & Methodik",
    titel: "Elektrische Feuchtemessung bei Estrich",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert warnen, wenn bei Estrich nur elektrische Widerstandsmessung verwendet wurde, da diese für Belegreife-Prüfung nicht zulässig ist.",
    details: [
      "Text enthält: \"Feuchtemessung\" + \"Estrich\" oder \"Bodenbelag\"",
      "System prüft Messmethode:",
      "✓ CM-Messung (Calciumcarbid)? → OK",
      "✓ Darr-Methode (Trockenschrank)? → OK",
      "❌ Elektrische Messung (Widerstand/Kapazität)? → FEHLER",
      "FEHLER wenn: Nur elektrische Messung bei Estrich",
    ],
    gutachtenarten: [
      "Wasserschadengutachten",
      "Feuchtigkeitsschadengutachten",
    ],
    schweregrad: "SEHR HOCH",
    rechtsgrundlage: "DIN 18560, TKB-Merkblatt 16",
  },
  {
    id: "4.2",
    kategorie: "Messtechnik & Methodik",
    titel: "Oberflächenmessung statt Tiefenmessung",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob Feuchtemessung im Bauteil in ausreichender Tiefe erfolgte (mind. 8 cm), sodass nicht nur oberflächliche Trockenheit gemessen wird.",
    details: [
      "Text enthält: \"Feuchtemessung\" + \"Mauerwerk\" oder \"Wand\"",
      "System prüft:",
      "✓ Messtiefe angegeben?",
      "✓ Messtiefe ≥ 8 cm? (bei Bohrlochmethode)",
      "FEHLER wenn: Keine Tiefenangabe oder < 8 cm",
    ],
    gutachtenarten: [
      "Schimmelgutachten",
      "Feuchtigkeitsschadengutachten",
      "Wasserschadengutachten",
    ],
    schweregrad: "HOCH",
    rechtsgrundlage: "WTA-Merkblatt 4-5-99",
  },
  {
    id: "4.3",
    kategorie: "Messtechnik & Methodik",
    titel: "Probenentnahme-Ort nicht dokumentiert",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob bei CM-Messung der Entnahmeort der Estrichprobe dokumentiert ist (unterer bis mittlerer Bereich), sodass Messungen reproduzierbar sind.",
    details: [
      "Text enthält: \"CM-Messung\" + \"Estrich\"",
      "System prüft Protokoll:",
      "✓ Entnahmeort angegeben? (\"untere Hälfte\", \"mittlerer Bereich\")",
      "✓ Anzahl der Messpunkte genannt?",
      "✓ Raumangabe (welcher Raum)?",
      "FEHLER wenn: Entnahmeort fehlt",
    ],
    gutachtenarten: [
      "Wasserschadengutachten",
      "Feuchtigkeitsschadengutachten",
    ],
    schweregrad: "MITTEL",
    rechtsgrundlage: "TKB-Merkblatt 16, DIN 18560",
  },
  // KATEGORIE 5: RECHTLICHE ABGRENZUNG
  {
    id: "5.1",
    kategorie: "Rechtliche Abgrenzung",
    titel: "Vermischung von Sach- und Rechtsfragen",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert erkennen, ob der Gutachter Rechtsfragen beantwortet (z.B. Gewährleistungsansprüche), obwohl er nur Sachfragen beantworten darf, sodass Kompetenzüberschreitungen verhindert werden.",
    details: [
      "System prüft auf juristische Begriffe:",
      "❌ \"Gewährleistung\"",
      "❌ \"Schadensersatz\"",
      "❌ \"Haftung\"",
      "❌ \"Anspruch\"",
      "❌ \"Verjährung\"",
      "WARNUNG wenn: Juristischer Begriff im Gutachten",
    ],
    gutachtenarten: [
      "Gerichtsgutachten",
      "Privatgutachten",
      "Versicherungsgutachten",
    ],
    schweregrad: "MITTEL",
    rechtsgrundlage: "§ 404 ZPO (Sachverständigenbeweis)",
  },
  {
    id: "5.2",
    kategorie: "Rechtliche Abgrenzung",
    titel: "Sanierungsempfehlung ohne Kostenschätzung",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob bei Sanierungsempfehlungen zumindest eine grobe Kostenschätzung enthalten ist, sodass Auftraggeber wirtschaftliche Entscheidungen treffen können.",
    details: [
      "Text enthält: \"Sanierung\" oder \"Instandsetzung\" + Maßnahme",
      "System prüft:",
      "✓ Kostenrahmen angegeben? (\"ca. 5.000-8.000 €\")",
      "✓ Oder Hinweis: \"Kostenermittlung durch Fachfirma erforderlich\"",
      "WARNUNG wenn: Sanierung ohne Kostenindikation",
    ],
    gutachtenarten: [
      "Bauschadensgutachten",
      "Baumängelgutachten",
      "Versicherungsgutachten",
    ],
    schweregrad: "NIEDRIG",
  },
  // KATEGORIE 6: SCHADENSERMITTLUNG & DOKUMENTATION
  {
    id: "6.1",
    kategorie: "Schadensermittlung & Dokumentation",
    titel: "Schadensausmaß nicht quantifiziert",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob Schadensausmaße quantifiziert sind (Fläche in m², Länge in m), sodass Nachvollziehbarkeit und Vergleichbarkeit gegeben sind.",
    details: [
      "Text enthält Schadensbeschreibung",
      "System prüft Quantifizierung:",
      "✓ Bei Schimmel: Fläche in m² angegeben?",
      "✓ Bei Rissen: Länge in m, Breite in mm angegeben?",
      "✓ Bei Durchfeuchtung: Fläche oder Länge angegeben?",
      "FEHLER wenn: Nur qualitative Beschreibung (\"großflächig\")",
    ],
    gutachtenarten: [
      "Bauschadensgutachten",
      "Baumängelgutachten",
      "Schimmelgutachten",
      "Feuchtigkeitsschadengutachten",
      "Wasserschadengutachten",
      "Versicherungsgutachten",
    ],
    schweregrad: "MITTEL",
  },
  {
    id: "6.2",
    kategorie: "Schadensermittlung & Dokumentation",
    titel: "Fotos ohne Maßstab",
    beschreibung:
      "Als Prüfverantwortlicher möchte ich automatisiert prüfen, ob Detailfotos einen Maßstab (Zollstock, Münze) enthalten, sodass Größenverhältnisse nachvollziehbar sind.",
    details: [
      "Text verweist auf: \"Detail-Foto\" oder \"Nahaufnahme\"",
      "System prüft Foto-Metadaten oder Bildanalyse:",
      "✓ Zollstock im Bild?",
      "✓ Münze/Maßstabskarte im Bild?",
      "✓ Maßangabe in Bildunterschrift?",
      "WARNUNG wenn: Kein Maßstab erkennbar",
    ],
    gutachtenarten: [
      "Bauschadensgutachten",
      "Baumängelgutachten",
      "Schimmelgutachten",
      "Feuchtigkeitsschadengutachten",
      "Wasserschadengutachten",
      "Hauskaufgutachten",
    ],
    schweregrad: "NIEDRIG",
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

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {"Pr\xfcfregeln"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {"Regeln f\xfcr die automatische Qualit\xe4tspr\xfcfung von Gutachten. Jede Regel kann verschiedenen Gutachtenarten zugeordnet werden."}
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

      {/* Rules list */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((regel) => (
            <RegelCard key={regel.id} regel={regel} />
          ))}
        </div>
      ) : (
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
  const schweregradColor = {
    "SEHR HOCH": "bg-destructive/10 text-destructive border-destructive/20",
    HOCH: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    MITTEL: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    NIEDRIG: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  }[regel.schweregrad];

  return (
    <div className="ring-border rounded-xl p-5 ring-1 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-muted-foreground text-xs font-mono">
              {regel.id}
            </span>
            <Badge variant="outline" className="text-xs font-normal">
              {regel.kategorie}
            </Badge>
            <Badge className={`${schweregradColor} text-xs font-normal`}>
              {regel.schweregrad}
            </Badge>
          </div>
          <h3 className="text-sm font-semibold mb-1.5">{regel.titel}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {regel.beschreibung}
          </p>
        </div>
      </div>

      {/* Detail checklist */}
      <ul className="mt-3 space-y-1">
        {regel.details.map((d, idx) => (
          <li
            key={idx}
            className="text-muted-foreground flex gap-2 text-sm"
          >
            <span className="text-destructive select-none shrink-0">{"\u2716"}</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>

      {/* Rechtsgrundlage */}
      {regel.rechtsgrundlage && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-muted-foreground text-xs">
            <span className="font-medium">Rechtsgrundlage:</span>{" "}
            {regel.rechtsgrundlage}
          </p>
        </div>
      )}

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
