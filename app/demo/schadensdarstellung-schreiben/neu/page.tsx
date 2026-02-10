"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCloseLine,
  RiImageLine,
  RiUploadCloud2Line,
  RiEditLine,
  RiFileCopyLine,
  RiSaveLine,
  RiDeleteBinLine,
  RiLoader4Line,
  RiCheckboxCircleLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ── Options ─────────────────────────────────────────────────────────

const gutachtenarten = [
  "Schimmelgutachten",
  "Wasserschadengutachten (Leitungswasser)",
  "Risse im Mauerwerk",
  "Feuchtigkeitsschaden",
  "Bauschadensgutachten (allgemein)",
];

// ── Types ───────────────────────────────────────────────────────────

type PageView = "form" | "generating" | "result";

// ── Mock generated text ─────────────────────────────────────────────

function generateMockText(art: string): string {
  if (art === "Schimmelgutachten") {
    return `SCHADENSDARSTELLUNG

Bei der Ortsbesichtigung am 15.01.2025 wurde ein Schimmelbefall an der 
nordwestlichen Außenwand im Schlafzimmer (1. OG) festgestellt.

Schadensbeschreibung:
Der Schimmelbefall erstreckt sich über eine Fläche von ca. 0,45 m² und 
befindet sich im Bereich der oberen Raumecke, etwa 2,20 m über 
Oberkante Fertigfußboden. Der Befall zeigt sich als dunkelgrau bis 
schwarze Verfärbung mit charakteristischem Stockfleckmuster.

Messungen und Untersuchungen:
Die durchgeführte Feuchtemessung mittels Bohrlochmethode (8 cm Tiefe) 
ergab eine relative Luftfeuchtigkeit im Mauerwerk von 96,3 %. Die 
Oberflächentemperatur an der betroffenen Stelle betrug zum Messzeitpunkt 
14,2 °C bei einer Raumtemperatur von 19,8 °C. Die Thermografie-Aufnahme 
zeigt eine deutliche Wärmebrücke im Eckbereich mit einer 
Temperaturdifferenz von ca. 7,5 °C zur angrenzenden Wandfläche.

Die Langzeitaufzeichnung des Raumklimas über 21 Tage (Datenlogger) ergab 
folgende Durchschnittswerte: Raumtemperatur 19,2 °C, relative 
Luftfeuchtigkeit 58 %. Das Lüftungsverhalten der Bewohner ist als 
regelkonform zu bewerten (3x täglich Stoßlüftung für jeweils 10-15 Minuten).

Fotodokumentation:
Die betroffenen Stellen wurden fotografisch dokumentiert (siehe Anlage 1, 
Fotos 1-8). Foto 1 zeigt die Gesamtansicht der nordwestlichen Raumecke, 
Foto 2-4 Detailaufnahmen des Schimmelbefalls, Foto 5-6 die 
Thermografie-Aufnahmen, Foto 7-8 die Messpunkte der Feuchtemessung.`;
  }

  if (art === "Wasserschadengutachten (Leitungswasser)") {
    return `SCHADENSDARSTELLUNG

Am 10.02.2025 erfolgte die Besichtigung des Leitungswasserschadens im 
Erdgeschoss des Objekts.

Schadensbeschreibung:
Der Wasserschaden betrifft die Küche sowie das angrenzende Wohnzimmer. 
Die Durchfeuchtung der nordwestlichen Außenwand erstreckt sich vertikal 
vom Bodenbereich bis zu einer Höhe von ca. 85 cm über Oberkante 
Fertigfußboden. Horizontal zeigt sich die Durchfeuchtung auf einer Länge 
von ca. 3,20 m entlang der Außenwand.

Der Parkettboden im Wohnzimmer weist auf einer Fläche von ca. 12 m² 
deutliche Aufwölbungen und Verformungen auf. Im Küchenbereich ist der 
Fliesenbelag auf ca. 4,5 m² hohl liegend (Klopfschallprüfung).

Schadensursache:
Als Schadensursache wurde ein Rohrbruch an der Kaltwasserleitung unter 
der Küchenspüle identifiziert. Die Lötverbindung am T-Stück (Cu-Rohr 
15 mm) weist eine Undichtigkeit auf. Nach Aussage der Bewohner wurde der 
Schaden am 08.02.2025 gegen 14:30 Uhr bemerkt.

Messungen:
Die CM-Messung (Calciumcarbid-Methode) ergab folgende Restfeuchtegehalte:
- Außenwand (Mauerwerk): 4,8 % (Sollwert: < 2,5 %)
- Estrich unter Parkett: 6,2 % (Sollwert: < 2,0 %)
- Estrich unter Fliesen: 3,9 % (Sollwert: < 2,0 %)

Die Messungen erfolgten nach DIN 18560 Teil 4 und sind in der 
Messtabelle (Anlage 2) detailliert aufgeführt.

Fotodokumentation:
Die Schadensstelle wurde umfassend dokumentiert (siehe Anlage 1, Fotos 
1-12). Foto 1-3 zeigen die Schadensursache (Rohrbruch), Foto 4-7 die 
Durchfeuchtung der Außenwand, Foto 8-10 die Parkettschäden, Foto 11-12 
die Messpunkte.`;
  }

  if (art === "Risse im Mauerwerk") {
    return `SCHADENSDARSTELLUNG

Bei der Begutachtung am 20.01.2025 wurden Risse im Innenputz des 
Wohnzimmers festgestellt.

Schadensbeschreibung:
Ein diagonal verlaufender Riss erstreckt sich von der südwestlichen 
Raumecke (ca. 40 cm unterhalb der Decke) bis zur Fensterkante (ca. 
120 cm über Oberkante Fertigfußboden). Die Risslänge beträgt ca. 2,80 m, 
die Rissbreite wurde mittels Risslupe an drei Messpunkten ermittelt:
- Messpunkt 1 (oben): 0,6 mm
- Messpunkt 2 (mittig): 0,8 mm  
- Messpunkt 3 (unten): 0,7 mm

Bewertung nach DIN 18202 (Toleranzen im Hochbau):
Die zulässige Abweichung für Innenputz beträgt gemäß DIN 18202, 
Tabelle 3, Zeile 6: 3 mm je 1 m Messlänge. Die festgestellten Rissbreiten 
liegen deutlich unterhalb dieser Toleranz.

Der Riss wurde mit Gipsmarken versehen, um eine mögliche Entwicklung über 
einen Zeitraum von 3 Monaten zu beobachten.

Fotodokumentation:
Siehe Anlage 1, Fotos 1-5 (Gesamtansicht und Detailaufnahmen mit Risslupe).`;
  }

  // Fallback für andere Gutachtenarten
  return `SCHADENSDARSTELLUNG

Bei der Ortsbegehung wurde ein Schaden festgestellt, der nachfolgend dokumentiert wird.

Die messtechnische Untersuchung und visuelle Begutachtung ergaben die im Folgenden dargestellten Befunde. Die Schadensursache sowie die empfohlenen Maßnahmen zur Mängelbeseitigung werden im Abschnitt Ursachenanalyse erläutert.`;
}

// ── Page ────────────────────────────────────────────────────────────

export default function NeuePage() {
  const router = useRouter();
  const [view, setView] = useState<PageView>("form");

  // Form state
  const [gutachtenart, setGutachtenart] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [anmerkungen, setAnmerkungen] = useState("");
  const fotoInputRef = useRef<HTMLInputElement>(null);

  // Result state
  const [generatedText, setGeneratedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [confirmLeave, setConfirmLeave] = useState(false);

  // ── Helpers ─────────────────────────────────────────────────────

  const handleFotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      setFotos((prev) => [...prev, ...files].slice(0, 20));
      e.target.value = "";
    },
    [],
  );

  const removeFoto = useCallback((idx: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleGenerate = useCallback(() => {
    setView("generating");
    setTimeout(() => {
      const text = generateMockText(gutachtenart);
      setGeneratedText(text);
      setEditText(text);
      setView("result");
    }, 2500);
  }, [gutachtenart]);

  // ═════════════════════════════════════════════════════════════════
  // GENERATING VIEW
  // ═════════════════════════════════════════════════════════════════

  if (view === "generating") {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-24 flex flex-col items-center gap-6">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
          <RiLoader4Line className="size-7 text-primary animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-1">
            Schadensdarstellung wird generiert…
          </h2>
          <p className="text-muted-foreground text-sm">
            Die KI analysiert Ihre Eingaben und erstellt den Fließtext.
          </p>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // RESULT VIEW
  // ═════════════════════════════════════════════════════════════════

  if (view === "result") {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        {/* Success header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
            <RiCheckboxCircleLine className="size-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Schadensdarstellung wurde erfolgreich erstellt
            </h1>
            <p className="text-muted-foreground text-sm">{gutachtenart}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mb-6">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setIsEditing(true);
                  setEditText(generatedText);
                }}
              >
                <RiEditLine className="size-3.5" />
                Bearbeiten
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => navigator.clipboard.writeText(generatedText)}
              >
                <RiFileCopyLine className="size-3.5" />
                Kopieren
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <RiSaveLine className="size-3.5" />
                Speichern
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive"
                onClick={() => setView("form")}
              >
                <RiDeleteBinLine className="size-3.5" />
                Verwerfen
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setGeneratedText(editText);
                  setIsEditing(false);
                }}
              >
                <RiSaveLine className="size-3.5" />
                Änderungen speichern
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setIsEditing(false)}
              >
                Bearbeitung abbrechen
              </Button>
            </>
          )}
        </div>

        {/* Text area */}
        {isEditing ? (
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[60vh] font-mono text-sm leading-relaxed"
          />
        ) : (
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {generatedText}
            </pre>
          </div>
        )}

        {/* Footer navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              setView("form");
              setGeneratedText("");
            }}
          >
            <RiArrowLeftLine className="size-4" />
            Neue Schadensdarstellung
          </Button>
          <Button className="gap-1.5" asChild>
            <Link href="/demo/schadensdarstellung-schreiben">
              Zur Übersicht
              <RiArrowRightLine className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // FORM VIEW
  // ═════════════════════════════════════════════════════════════════

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Neue Schadensdarstellung
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Erfassen Sie die Schadensdaten. Die KI generiert daraus einen
          vollständigen Fließtext.
        </p>
      </div>

      <div className="space-y-8">
        {/* Gutachtenart */}
        <div>
          <Label className="text-sm font-medium mb-1.5 block">
            Gutachtenart
          </Label>
          <Select value={gutachtenart} onValueChange={setGutachtenart}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Gutachtenart auswählen" />
            </SelectTrigger>
            <SelectContent>
              {gutachtenarten.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fotos */}
        <div>
          <Label className="text-sm font-medium mb-1.5 block">
            Fotos hochladen ({fotos.length}/20)
          </Label>
          <input
            ref={fotoInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            onChange={handleFotoUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fotoInputRef.current?.click()}
            className="w-full rounded-lg border-2 border-dashed py-6 flex flex-col items-center gap-1.5 text-sm transition-colors hover:border-primary/40 hover:bg-muted/30 cursor-pointer"
          >
            <RiUploadCloud2Line className="size-7 text-muted-foreground/40" />
            <span className="text-muted-foreground">
              Klicken oder Dateien hierher ziehen
            </span>
            <span className="text-muted-foreground/50 text-xs">
              JPG, PNG – max. 20 Dateien
            </span>
          </button>

          {fotos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {fotos.map((f, i) => (
                <div
                  key={`${f.name}-${i}`}
                  className="group relative flex items-center gap-1.5 rounded-md border bg-muted/30 px-2.5 py-1.5 text-xs"
                >
                  <RiImageLine className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="max-w-32 truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFoto(i)}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <RiCloseLine className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Anmerkungen */}
        <div>
          <Label className="text-sm font-medium mb-1.5 block">
            Anmerkungen
          </Label>
          <Textarea
            placeholder="Freitext – z.B. Beobachtungen, Messwerte, Vorschäden, besondere Umstände…"
            value={anmerkungen}
            onChange={(e) => setAnmerkungen(e.target.value)}
            className="min-h-32"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => setConfirmLeave(true)}
          >
            <RiArrowLeftLine className="size-4" />
            Abbrechen
          </Button>
          <Button
            className="gap-1.5"
            disabled={!gutachtenart}
            onClick={handleGenerate}
          >
            Schadensdarstellung generieren
            <RiArrowRightLine className="size-4" />
          </Button>
        </div>
      </div>

      {/* Confirm leave dialog */}
      <Dialog open={confirmLeave} onOpenChange={setConfirmLeave}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eingaben verwerfen?</DialogTitle>
            <DialogDescription>
              Alle eingegebenen Daten gehen verloren. Möchten Sie wirklich
              zurück zur Übersicht?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmLeave(false)}
            >
              Weiter bearbeiten
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                router.push("/demo/schadensdarstellung-schreiben")
              }
            >
              Verwerfen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
