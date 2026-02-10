"use client";

import { useParams } from "next/navigation";
import {
  RiFilePdfLine,
  RiErrorWarningLine,
  RiAlarmWarningLine,
  RiInformationLine,
  RiFileTextLine,
  RiArrowLeftSLine,
  RiCheckboxCircleLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ── Mock Prüfungen (same as table) ──────────────────────────────────

const pruefungen: Record<
  string,
  { id: string; gutachtenRef: string; dateiname: string; gutachtenart: string; erstellt: string }
> = {
  "QP-2025-0008": {
    id: "QP-2025-0008",
    gutachtenRef: "GA-2025-0091",
    dateiname: "Wasserschaden_Bergstrasse_Gutachten.pdf",
    gutachtenart: "Wasserschadengutachten",
    erstellt: "2025-02-08",
  },
  "QP-2025-0007": {
    id: "QP-2025-0007",
    gutachtenRef: "GA-2025-0087",
    dateiname: "Schimmelbefall_EFH_München_Pasing.pdf",
    gutachtenart: "Schimmelgutachten",
    erstellt: "2025-02-01",
  },
  "QP-2025-0006": {
    id: "QP-2025-0006",
    gutachtenRef: "GA-2025-0079",
    dateiname: "Rissbildung_MFH_Düsseldorf.pdf",
    gutachtenart: "Bauschadensgutachten",
    erstellt: "2025-01-22",
  },
  "QP-2025-0005": {
    id: "QP-2025-0005",
    gutachtenRef: "GA-2024-0847",
    dateiname: "Feuchtigkeit_ETW_Köln_Ehrenfeld.pdf",
    gutachtenart: "Feuchtigkeitsschadengutachten",
    erstellt: "2025-01-10",
  },
  "QP-2024-0004": {
    id: "QP-2024-0004",
    gutachtenRef: "GA-2024-0612",
    dateiname: "Dämmungsmängel_Neubau_Hamburg.pdf",
    gutachtenart: "Baumängelgutachten",
    erstellt: "2024-12-18",
  },
  "QP-2024-0003": {
    id: "QP-2024-0003",
    gutachtenRef: "GA-2024-0293",
    dateiname: "Gerichtsgutachten_Dachschaden_Stuttgart.pdf",
    gutachtenart: "Gerichtsgutachten",
    erstellt: "2024-12-02",
  },
  "QP-2024-0002": {
    id: "QP-2024-0002",
    gutachtenRef: "GA-2024-0188",
    dateiname: "Hauskauf_Bewertung_Frankfurt.pdf",
    gutachtenart: "Hauskaufgutachten",
    erstellt: "2024-11-15",
  },
};

// ── Mock findings per Prüfung ───────────────────────────────────────

interface Finding {
  id: number;
  severity: "error" | "notice";
  regelId: string;
  regelTitel: string;
  seite: number;
  zitat: string;
  beschreibung: string;
  erwartet: string;
}

const findingsMap: Record<string, Finding[]> = {
  "QP-2025-0008": [
    {
      id: 1,
      severity: "error",
      regelId: "A-04",
      regelTitel: "Fehlende Norm-Referenzen",
      seite: 3,
      zitat: "\"Die Abdichtung des Kellermauerwerks war mangelhaft.\"",
      beschreibung:
        "Das Gutachten stellt einen Abdichtungsmangel fest, zitiert jedoch weder DIN 18195 (Bauwerksabdichtung) noch die aktuelle Nachfolgenorm DIN 18533. Ohne Normreferenz ist die Bewertung technisch nicht belastbar.",
      erwartet:
        "Verweis auf DIN 18195 / DIN 18533 mit Angabe der relevanten Abschnitte und Gegenüberstellung Ist-/Soll-Zustand.",
    },
    {
      id: 2,
      severity: "error",
      regelId: "A-05",
      regelTitel: "Ungenaue Schadensermittlung (Massenermittlung)",
      seite: 5,
      zitat: "\"Der Wasserschaden erstreckt sich über einen großen Bereich des Kellers.\"",
      beschreibung:
        "Der Schadensumfang wird nur qualitativ beschrieben (\"großer Bereich\"). Es fehlen exakte Flächenangaben (m²), Feuchtigkeitswerte je Messpunkt und eine Kostenschätzung für die Sanierung.",
      erwartet:
        "Quantifizierung der Schadensfläche in m², tabellarische Messwerte pro Messpunkt, Sanierungskostenschätzung mit Aufmaß.",
    },
    {
      id: 3,
      severity: "notice",
      regelId: "A-07",
      regelTitel: "Mangelhafte Fotodokumentation",
      seite: 8,
      zitat: "\"Siehe Anlage: Fotos 1-4\"",
      beschreibung:
        "Es werden nur 4 Fotos referenziert, obwohl der Schaden sich über mehrere Räume erstreckt. Es fehlen Übersichtsfotos der betroffenen Bereiche sowie Maßstäbe in den Detailaufnahmen.",
      erwartet:
        "Mindestens Übersichts- und Detailfotos je betroffenem Raum, mit Maßstab/Referenzobjekt und Beschriftung der Messpunkte.",
    },
    {
      id: 4,
      severity: "notice",
      regelId: "A-08",
      regelTitel: "Unklare Handlungsempfehlungen",
      seite: 11,
      zitat: "\"Eine Sanierung der betroffenen Bereiche wird empfohlen.\"",
      beschreibung:
        "Die Handlungsempfehlung ist zu vage. Es fehlt ein konkretes Sanierungskonzept mit Maßnahmenbeschreibung, Reihenfolge und Risikoeinschätzung.",
      erwartet:
        "Detailliertes Sanierungskonzept: Maßnahmen, Prioritäten, geschätzte Kosten, Zeitrahmen und Risikoeinschätzung.",
    },
  ],
  "QP-2025-0007": [
    {
      id: 1,
      severity: "error",
      regelId: "S-01",
      regelTitel: "Unvollständige Ursachenermittlung",
      seite: 4,
      zitat: "\"Der Schimmelbefall ist auf falsches Lüftungsverhalten der Bewohner zurückzuführen.\"",
      beschreibung:
        "Das Gutachten schließt vorschnell auf nutzungsbedingtes Fehlverhalten. Es wurden weder eine Thermografie zur Wärmebrückenermittlung noch Langzeit-Datenlogger-Aufzeichnungen durchgeführt. Bauliche Ursachen (Dämmung, Abdichtung) sind nicht ausgeschlossen.",
      erwartet:
        "Systematische Ursachenanalyse: Feuchtemessung (Bohrlochmethode), Thermografie, Datenlogger über mind. 3 Wochen, Prüfung baulicher Mängel.",
    },
    {
      id: 2,
      severity: "error",
      regelId: "S-02",
      regelTitel: "Falsche Messtechnik",
      seite: 5,
      zitat: "\"Feuchtemessung mit elektronischem Indikator: Wand zeigt erhöhte Feuchtigkeit.\"",
      beschreibung:
        "Es wurde lediglich ein einfaches Widerstandsmessgerät (Oberflächenmessung) verwendet. Für eine belastbare Schimmelursachenanalyse ist die Bohrlochmethode (8 cm Tiefe) erforderlich.",
      erwartet:
        "Bohrlochmessung in 8 cm Tiefe, relative Luftfeuchte mit kalibriertem Hygrometer, CM-Messung bei Estrich.",
    },
    {
      id: 3,
      severity: "error",
      regelId: "S-03",
      regelTitel: "Einseitige Schuldzuweisung",
      seite: 7,
      zitat: "\"Bei korrektem Lüftungsverhalten wäre der Schaden vermeidbar gewesen.\"",
      beschreibung:
        "Der Gutachter weist die Verantwortung einseitig dem Mieter zu, ohne ein Ausschlussverfahren für bauliche Ursachen zu dokumentieren. Es fehlt die neutrale Gegenüberstellung aller möglichen Schadensursachen.",
      erwartet:
        "Neutrale Auflistung aller möglichen Ursachen (baulich, nutzungsbedingt, extern) mit dokumentiertem Ausschlussverfahren.",
    },
    {
      id: 4,
      severity: "notice",
      regelId: "S-04",
      regelTitel: "Unzureichende Dokumentation",
      seite: 9,
      zitat: "\"Fotodokumentation siehe Anhang.\"",
      beschreibung:
        "Die Fotodokumentation enthält keine Messwerttabellen und keine Darstellung der Schadens-Historie (Vorbefunde, frühere Reparaturen). Die Fotos sind ohne Maßstab aufgenommen.",
      erwartet:
        "Tabellarische Messwerte, historische Vorbefunde dokumentiert, Fotos mit Maßstab und Referenz.",
    },
    {
      id: 5,
      severity: "notice",
      regelId: "A-04",
      regelTitel: "Fehlende Norm-Referenzen",
      seite: 2,
      zitat: "\"Der Schimmelbefall wurde gemäß üblichen Standards bewertet.\"",
      beschreibung:
        "\"Übliche Standards\" ist keine ausreichende Referenz. Es fehlen Verweise auf WTA-Merkblätter (Feuchteschutz), DIN 4108 (Wärmeschutz) und DIN EN ISO 13788 (Feuchte).",
      erwartet:
        "Explizite Nennung der WTA-Merkblätter, DIN 4108 und DIN EN ISO 13788 mit relevanten Abschnitten.",
    },
  ],
  "QP-2025-0006": [
    {
      id: 1,
      severity: "error",
      regelId: "A-02",
      regelTitel: "Fehlende Plausibilitätsprüfung",
      seite: 6,
      zitat: "\"Die Rissbildung ist auf Setzung des Fundaments zurückzuführen.\"",
      beschreibung:
        "Es wird nur eine Ursache (Setzung) benannt, ohne Alternativen wie Materialfehler, thermische Spannungen oder Erschütterungen zu prüfen und auszuschließen.",
      erwartet:
        "Systematisches Ausschlussverfahren: Alle möglichen Ursachen benennen, prüfen und dokumentiert ausschließen.",
    },
    {
      id: 2,
      severity: "error",
      regelId: "A-03",
      regelTitel: "Unvollständige Bestandsaufnahme",
      seite: 4,
      zitat: "\"Die Fassade wurde visuell begutachtet.\"",
      beschreibung:
        "Es wurde ausschließlich eine visuelle Begutachtung der Fassade durchgeführt. Innenseitige Rissverläufe, angrenzende Bauteile und verdeckte Bereiche hinter Verkleidungen wurden nicht untersucht.",
      erwartet:
        "Innenseitige Untersuchung, Prüfung angrenzender Bauteile, ggf. Bauteilöffnung zur Klärung der Schadensursache.",
    },
    {
      id: 3,
      severity: "error",
      regelId: "A-04",
      regelTitel: "Fehlende Norm-Referenzen",
      seite: 8,
      zitat: "\"Die Rissbreiten überschreiten das übliche Maß.\"",
      beschreibung:
        "Es fehlt der Verweis auf DIN 18202 (Toleranzen im Hochbau) zur Bewertung der Rissbreiten. Ohne Normreferenz ist \"das übliche Maß\" nicht definiert.",
      erwartet:
        "Verweis auf DIN 18202 mit Angabe der zulässigen Toleranzen und Gegenüberstellung der gemessenen Werte.",
    },
    {
      id: 4,
      severity: "notice",
      regelId: "A-06",
      regelTitel: "Vorschäden nicht berücksichtigt",
      seite: 3,
      zitat: "\"Das Gebäude wurde 2018 errichtet.\"",
      beschreibung:
        "Es wird nicht geprüft, ob bereits frühere Rissbildungen dokumentiert waren oder ob zwischenzeitlich Reparaturen stattgefunden haben. Eine Abgrenzung Alt-/Neuschaden fehlt.",
      erwartet:
        "Recherche und Dokumentation früherer Befunde, Abgrenzung von Vorschäden.",
    },
  ],
  "QP-2025-0005": [
    {
      id: 1,
      severity: "notice",
      regelId: "A-07",
      regelTitel: "Mangelhafte Fotodokumentation",
      seite: 6,
      zitat: "\"Fotos der Feuchtigkeitsstellen im Anhang.\"",
      beschreibung:
        "Die Fotos zeigen nur Detailaufnahmen ohne Raumübersicht. Es fehlen Maßstäbe und die Dokumentation der Messpunkte ist nicht fotografisch festgehalten.",
      erwartet:
        "Übersichts- und Detailfotos je Raum, Maßstab in allen Detailaufnahmen, fotografische Dokumentation aller Messpunkte.",
    },
  ],
  "QP-2024-0004": [
    {
      id: 1,
      severity: "error",
      regelId: "A-04",
      regelTitel: "Fehlende Norm-Referenzen",
      seite: 3,
      zitat: "\"Die Dämmung entspricht nicht den aktuellen Anforderungen.\"",
      beschreibung:
        "Es fehlen Verweise auf GEG (Gebäudeenergiegesetz) und DIN 4108 (Wärmeschutz). \"Aktuelle Anforderungen\" ist keine belastbare Referenz.",
      erwartet:
        "Verweis auf GEG/EnEV und DIN 4108 mit konkreten U-Wert-Anforderungen und Gegenüberstellung Ist-/Soll-Werte.",
    },
    {
      id: 2,
      severity: "error",
      regelId: "A-01",
      regelTitel: "Vermischung von Sach- und Rechtsfragen",
      seite: 7,
      zitat: "\"Es liegt ein Baumangel im Sinne des BGB vor.\"",
      beschreibung:
        "Der Gutachter verwendet den Rechtsbegriff \"Mangel im Sinne des BGB\". Als Sachverständiger darf er nur technische Abweichungen feststellen; die rechtliche Bewertung obliegt dem Gericht/Anwalt.",
      erwartet:
        "Technische Beschreibung der Abweichung vom Soll-Zustand, ohne rechtliche Wertung.",
    },
    {
      id: 3,
      severity: "error",
      regelId: "A-05",
      regelTitel: "Ungenaue Schadensermittlung (Massenermittlung)",
      seite: 9,
      zitat: "\"Die Sanierung wird voraussichtlich im mittleren fünfstelligen Bereich liegen.\"",
      beschreibung:
        "Die Kostenermittlung ist zu vage. Es fehlen ein detailliertes Aufmaß, Einheitspreise und eine nachvollziehbare Kostenaufstellung.",
      erwartet:
        "Detailliertes Aufmaß der betroffenen Flächen, Einheitspreise, nachvollziehbare Kostenschätzung mit Positionen.",
    },
    {
      id: 4,
      severity: "error",
      regelId: "A-03",
      regelTitel: "Unvollständige Bestandsaufnahme",
      seite: 4,
      zitat: "\"Die Außenwand im Wohnzimmer wurde untersucht.\"",
      beschreibung:
        "Es wurde nur eine Wand eines Raumes untersucht. Bei Dämmungsmängeln müssen alle Außenwände, Dach- und Kellerdeckenanschlüsse geprüft werden.",
      erwartet:
        "Untersuchung aller Außenbauteile inkl. Dach-/Kelleranschlüsse, Thermografie des gesamten Gebäudes.",
    },
    {
      id: 5,
      severity: "notice",
      regelId: "A-08",
      regelTitel: "Unklare Handlungsempfehlungen",
      seite: 12,
      zitat: "\"Die Dämmung sollte erneuert werden.\"",
      beschreibung:
        "Die Empfehlung benennt kein konkretes Dämmsystem, keine Materialwahl, keine Reihenfolge der Maßnahmen und keine Risikoeinschätzung.",
      erwartet:
        "Konkretes Sanierungskonzept: Dämmsystem, Materialien, Reihenfolge, Kosten, Risiken.",
    },
    {
      id: 6,
      severity: "notice",
      regelId: "A-07",
      regelTitel: "Mangelhafte Fotodokumentation",
      seite: 6,
      zitat: "\"Thermografie-Aufnahme siehe Anlage Bild 2.\"",
      beschreibung:
        "Es ist nur eine einzige Thermografie-Aufnahme vorhanden, obwohl mehrere Außenwände betroffen sind. Referenzfotos fehlen.",
      erwartet:
        "Thermografie aller betroffenen Außenbauteile, mit Innen- und Außenaufnahmen, Temperaturskala sichtbar.",
    },
    {
      id: 7,
      severity: "notice",
      regelId: "A-06",
      regelTitel: "Vorschäden nicht berücksichtigt",
      seite: 2,
      zitat: "\"Das Gebäude wurde 2021 fertiggestellt.\"",
      beschreibung:
        "Es wird nicht dokumentiert, ob bei der Bauabnahme bereits Mängel festgestellt wurden oder ob Gewährleistungsansprüche geltend gemacht wurden.",
      erwartet:
        "Recherche Bauabnahme-Protokoll, Gewährleistungsstatus, Dokumentation früherer Beanstandungen.",
    },
  ],
  "QP-2024-0003": [],
  "QP-2024-0002": [
    {
      id: 1,
      severity: "error",
      regelId: "A-03",
      regelTitel: "Unvollständige Bestandsaufnahme",
      seite: 5,
      zitat: "\"Keller und Dachboden waren zum Zeitpunkt der Begehung nicht zugänglich.\"",
      beschreibung:
        "Nicht zugängliche Bereiche wurden weder nachträglich begutachtet noch als Einschränkung im Gutachten kenntlich gemacht. Versteckte Schäden in Keller und Dachbereich bleiben unerkannt.",
      erwartet:
        "Zweittermin für Keller/Dach oder expliziter Hinweis auf Einschränkung mit Empfehlung zur Nachbegehung.",
    },
    {
      id: 2,
      severity: "error",
      regelId: "A-02",
      regelTitel: "Fehlende Plausibilitätsprüfung",
      seite: 8,
      zitat: "\"Feuchteflecken im Erdgeschoss deuten auf aufsteigende Feuchtigkeit hin.\"",
      beschreibung:
        "Es wird nur aufsteigende Feuchtigkeit als Ursache vermutet. Spritzwasser, defekte Horizontalsperre oder Leitungsschäden wurden nicht geprüft.",
      erwartet:
        "Prüfung aller möglichen Feuchtigkeitsquellen mit dokumentiertem Ausschlussverfahren.",
    },
    {
      id: 3,
      severity: "notice",
      regelId: "A-05",
      regelTitel: "Ungenaue Schadensermittlung (Massenermittlung)",
      seite: 10,
      zitat: "\"Sanierungsbedarf wird auf ca. 15.000-30.000 EUR geschätzt.\"",
      beschreibung:
        "Die Kostenschätzung hat eine Spanne von 100%. Ohne detailliertes Aufmaß und Einheitspreise ist die Schätzung für eine Kaufentscheidung unbrauchbar.",
      erwartet:
        "Aufmaß mit konkreten Flächen/Massen, Einheitspreise, nachvollziehbare Bandbreite max. ±20%.",
    },
  ],
};

// ── Severity config ─────────────────────────────────────────────────

const severityConfig = {
  error: {
    label: "Error",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
    icon: RiAlarmWarningLine,
    barClass: "bg-destructive",
  },
  notice: {
    label: "Notice",
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: RiInformationLine,
    barClass: "bg-amber-500",
  },
};

// ── Page ────────────────────────────────────────────────────────────

export default function PruefDashboardPage() {
  const params = useParams();
  const id = params.id as string;
  const pruefung = pruefungen[id];
  const findings = findingsMap[id] ?? [];

  const errors = findings.filter((f) => f.severity === "error").length;
  const notices = findings.filter((f) => f.severity === "notice").length;

  if (!pruefung) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Prüfung nicht gefunden.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="border-b bg-background px-6 py-3 flex items-center gap-4 shrink-0">
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <Link href="/demo/qualitaetsmanagement/pruefung">
            <RiArrowLeftSLine className="size-5" />
          </Link>
        </Button>

        <div className="flex items-center gap-2 min-w-0">
          <RiFilePdfLine className="text-destructive/70 size-5 shrink-0" />
          <span className="font-medium truncate text-sm">
            {pruefung.dateiname}
          </span>
        </div>

        <Badge variant="secondary" className="font-normal shrink-0">
          {pruefung.gutachtenart}
        </Badge>

        <span className="text-muted-foreground text-xs shrink-0 hidden sm:block">
          {new Date(pruefung.erstellt).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>

        <span className="text-muted-foreground text-xs font-mono shrink-0 hidden md:block">
          {pruefung.id} &middot; {pruefung.gutachtenRef}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Summary badges */}
        <div className="flex items-center gap-2 shrink-0">
          {errors > 0 && (
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-normal gap-1">
              <RiAlarmWarningLine className="size-3.5" />
              {errors} {errors === 1 ? "Error" : "Errors"}
            </Badge>
          )}
          {notices > 0 && (
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-normal gap-1">
              <RiInformationLine className="size-3.5" />
              {notices} {notices === 1 ? "Notice" : "Notices"}
            </Badge>
          )}
          {findings.length === 0 && (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-normal gap-1">
              <RiCheckboxCircleLine className="size-3.5" />
              Keine Befunde
            </Badge>
          )}
        </div>
      </header>

      {/* ── Body: PDF viewer + Review sidebar ─────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer (left) */}
        <div className="flex-1 bg-muted/30 flex flex-col items-center justify-center overflow-auto">
          <div className="w-full max-w-2xl mx-auto px-8 py-12">
            {/* Mock PDF */}
            <div className="bg-background rounded-lg shadow-sm border p-10 min-h-[80vh] flex flex-col items-center">
              <RiFileTextLine className="text-muted-foreground/20 size-16 mb-6" />
              <p className="text-muted-foreground text-sm font-medium mb-2">
                {pruefung.dateiname}
              </p>
              <p className="text-muted-foreground/60 text-xs text-center max-w-sm mb-8">
                PDF-Viewer – Das Gutachten wird hier angezeigt. Befunde aus der rechten Sidebar referenzieren die entsprechenden Seitenzahlen.
              </p>
              {/* Mock pages */}
              <div className="w-full space-y-4 mt-4">
                {[1, 2, 3, 4, 5].map((page) => (
                  <div
                    key={page}
                    className="border border-dashed rounded-md p-6 text-center"
                  >
                    <span className="text-muted-foreground/40 text-xs">
                      Seite {page}
                    </span>
                    <div className="mt-3 space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-2.5 bg-muted rounded-full mx-auto"
                          style={{ width: `${60 + Math.random() * 35}%` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review Sidebar (right) */}
        <aside className="w-[440px] shrink-0 border-l bg-background flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b shrink-0">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <RiErrorWarningLine className="size-4" />
              Prüfbefunde
              <span className="text-muted-foreground font-normal">
                ({findings.length})
              </span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {findings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 px-5">
                <RiCheckboxCircleLine className="size-10 text-emerald-500/30" />
                <p className="text-muted-foreground text-sm">
                  Keine Befunde – Gutachten hat die Prüfung bestanden.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {findings.map((finding, idx) => {
                  const sev = severityConfig[finding.severity];
                  const SevIcon = sev.icon;
                  return (
                    <div key={finding.id} className="px-5 py-4">
                      {/* Severity + Rule */}
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex size-6 items-center justify-center rounded-md shrink-0 ${
                            finding.severity === "error"
                              ? "bg-destructive/10"
                              : "bg-amber-500/10"
                          }`}
                        >
                          <SevIcon
                            className={`size-3.5 ${
                              finding.severity === "error"
                                ? "text-destructive"
                                : "text-amber-600"
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${sev.badgeClass} text-xs`}>
                              {sev.label}
                            </Badge>
                            <span className="text-muted-foreground text-xs">
                              Seite {finding.seite}
                            </span>
                          </div>
                          <h3 className="mt-1.5 text-sm font-semibold">
                            <span className="text-muted-foreground font-mono text-xs mr-1.5">
                              {finding.regelId}
                            </span>
                            {finding.regelTitel}
                          </h3>
                        </div>
                      </div>

                      {/* Zitat */}
                      <div className="mt-3 ml-9 border-l-2 border-muted pl-3">
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                          {finding.zitat}
                        </p>
                      </div>

                      {/* KI-Beschreibung */}
                      <div className="mt-3 ml-9 space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-0.5">
                            Feststellung
                          </p>
                          <p className="text-sm leading-relaxed">
                            {finding.beschreibung}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-0.5">
                            Erwartet
                          </p>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {finding.erwartet}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
