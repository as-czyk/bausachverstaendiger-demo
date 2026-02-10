"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  RiAddLine,
  RiExternalLinkLine,
  RiFilePdfLine,
  RiUploadCloud2Line,
  RiCheckLine,
  RiLoader4Line,
  RiCheckboxCircleLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Mock table data ─────────────────────────────────────────────────

const mockData = [
  {
    id: "QP-2025-0008",
    gutachtenRef: "GA-2025-0091",
    dateiname: "Wasserschaden_Bergstrasse_Gutachten.pdf",
    gutachtenart: "Wasserschadengutachten",
    erstellt: "2025-02-08",
  },
  {
    id: "QP-2025-0007",
    gutachtenRef: "GA-2025-0087",
    dateiname: "Schimmelbefall_EFH_München_Pasing.pdf",
    gutachtenart: "Schimmelgutachten",
    erstellt: "2025-02-01",
  },
  {
    id: "QP-2025-0006",
    gutachtenRef: "GA-2025-0079",
    dateiname: "Rissbildung_MFH_Düsseldorf.pdf",
    gutachtenart: "Bauschadensgutachten",
    erstellt: "2025-01-22",
  },
  {
    id: "QP-2025-0005",
    gutachtenRef: "GA-2024-0847",
    dateiname: "Feuchtigkeit_ETW_Köln_Ehrenfeld.pdf",
    gutachtenart: "Feuchtigkeitsschadengutachten",
    erstellt: "2025-01-10",
  },
  {
    id: "QP-2024-0004",
    gutachtenRef: "GA-2024-0612",
    dateiname: "Dämmungsmängel_Neubau_Hamburg.pdf",
    gutachtenart: "Baumängelgutachten",
    erstellt: "2024-12-18",
  },
  {
    id: "QP-2024-0003",
    gutachtenRef: "GA-2024-0293",
    dateiname: "Gerichtsgutachten_Dachschaden_Stuttgart.pdf",
    gutachtenart: "Gerichtsgutachten",
    erstellt: "2024-12-02",
  },
  {
    id: "QP-2024-0002",
    gutachtenRef: "GA-2024-0188",
    dateiname: "Hauskauf_Bewertung_Frankfurt.pdf",
    gutachtenart: "Hauskaufgutachten",
    erstellt: "2024-11-15",
  },
];

// ── Gutachtenarten ──────────────────────────────────────────────────

const gutachtenarten = [
  "Bauschadensgutachten",
  "Baumängelgutachten",
  "Schimmelgutachten",
  "Feuchtigkeitsschadengutachten",
  "Wasserschadengutachten",
  "Hauskaufgutachten",
  "Gerichtsgutachten",
  "Privatgutachten",
  "Versicherungsgutachten",
];

// ── Rules (id + titel + gutachtenarten for matching) ────────────────

const regeln = [
  { id: "S-01", titel: "Unvollständige Ursachenermittlung", gutachtenarten: ["Schimmelgutachten"] },
  { id: "S-02", titel: "Falsche Messtechnik", gutachtenarten: ["Schimmelgutachten", "Feuchtigkeitsschadengutachten"] },
  { id: "S-03", titel: "Einseitige Schuldzuweisung", gutachtenarten: ["Schimmelgutachten"] },
  { id: "S-04", titel: "Unzureichende Dokumentation", gutachtenarten: ["Schimmelgutachten", "Feuchtigkeitsschadengutachten", "Wasserschadengutachten"] },
  { id: "A-01", titel: "Vermischung von Sach- und Rechtsfragen", gutachtenarten: ["Gerichtsgutachten", "Privatgutachten", "Versicherungsgutachten"] },
  { id: "A-02", titel: "Fehlende Plausibilitätsprüfung", gutachtenarten: ["Bauschadensgutachten", "Baumängelgutachten", "Gerichtsgutachten"] },
  { id: "A-03", titel: "Unvollständige Bestandsaufnahme", gutachtenarten: ["Bauschadensgutachten", "Baumängelgutachten", "Hauskaufgutachten"] },
  { id: "A-04", titel: "Fehlende Norm-Referenzen", gutachtenarten: ["Baumängelgutachten", "Gerichtsgutachten", "Bauschadensgutachten"] },
  { id: "A-05", titel: "Ungenaue Schadensermittlung", gutachtenarten: ["Bauschadensgutachten", "Versicherungsgutachten", "Wasserschadengutachten"] },
  { id: "A-06", titel: "Vorschäden nicht berücksichtigt", gutachtenarten: ["Versicherungsgutachten", "Gerichtsgutachten", "Bauschadensgutachten"] },
  { id: "A-07", titel: "Mangelhafte Fotodokumentation", gutachtenarten: ["Bauschadensgutachten", "Baumängelgutachten", "Schimmelgutachten", "Hauskaufgutachten"] },
  { id: "A-08", titel: "Unklare Handlungsempfehlungen", gutachtenarten: ["Bauschadensgutachten", "Baumängelgutachten", "Privatgutachten"] },
];

// ── Types ───────────────────────────────────────────────────────────

type ModalState = "form" | "reading" | "checking" | "done";

interface RuleCheckStatus {
  id: string;
  titel: string;
  status: "pending" | "checking" | "passed" | "failed";
}

// Deterministic fail pattern: these rule IDs will always fail
const FAIL_IDS = new Set(["S-01", "A-03", "A-04", "A-07"]);

// ── Page ────────────────────────────────────────────────────────────

export default function PruefungPage() {
  const [open, setOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>("form");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedArt, setSelectedArt] = useState("");
  const [ruleChecks, setRuleChecks] = useState<RuleCheckStatus[]>([]);
  const [readProgress, setReadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetModal = useCallback(() => {
    setModalState("form");
    setSelectedFile(null);
    setSelectedArt("");
    setRuleChecks([]);
    setReadProgress(0);
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        if (modalState === "reading" || modalState === "checking") return;
        resetModal();
      }
      setOpen(next);
    },
    [modalState, resetModal],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setSelectedFile(file);
    },
    [],
  );

  const startChecking = useCallback(() => {
    // ── Phase 1: Document reading animation ───────────────────
    setModalState("reading");
    setReadProgress(0);

    const readSteps = [12, 28, 45, 63, 78, 91, 100];
    let stepIdx = 0;

    const readInterval = setInterval(() => {
      if (stepIdx < readSteps.length) {
        setReadProgress(readSteps[stepIdx]);
        stepIdx++;
      } else {
        clearInterval(readInterval);

        // ── Phase 2: Rule checking ────────────────────────────
        setTimeout(() => {
          const applicable = regeln.filter(
            (r) =>
              r.gutachtenarten.includes(selectedArt) ||
              r.id.startsWith("A-"),
          );

          const checks: RuleCheckStatus[] = applicable.map((r) => ({
            id: r.id,
            titel: r.titel,
            status: "pending" as const,
          }));

          setRuleChecks(checks);
          setModalState("checking");

          let idx = 0;
          const interval = setInterval(() => {
            if (idx < checks.length) {
              setRuleChecks((prev) =>
                prev.map((c, i) =>
                  i === idx ? { ...c, status: "checking" } : c,
                ),
              );

              const currentIdx = idx;
              const currentId = checks[currentIdx].id;
              setTimeout(() => {
                setRuleChecks((prev) =>
                  prev.map((c, i) =>
                    i === currentIdx
                      ? {
                          ...c,
                          status: FAIL_IDS.has(currentId)
                            ? "failed"
                            : "passed",
                        }
                      : c,
                  ),
                );
              }, 400);

              idx++;
            } else {
              clearInterval(interval);
              setTimeout(() => {
                setModalState("done");
                setTimeout(() => {
                  setOpen(false);
                  resetModal();
                }, 1800);
              }, 600);
            }
          }, 700);
        }, 500);
      }
    }, 300);
  }, [selectedArt, resetModal]);

  const canStart = selectedFile && selectedArt;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gutachtenprüfungen
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Übersicht aller durchgeführten Qualitätsprüfungen
          </p>
        </div>
        <Button className="gap-1.5 shrink-0" onClick={() => setOpen(true)}>
          <RiAddLine className="size-4" />
          Neue Prüfung
        </Button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="text-muted-foreground pb-3 font-medium">
              Gutachten
            </th>
            <th className="text-muted-foreground pb-3 font-medium hidden md:table-cell">
              Gutachtenart
            </th>
            <th className="text-muted-foreground pb-3 font-medium hidden sm:table-cell">
              Erstellt
            </th>
            <th className="pb-3">
              <span className="sr-only">Aktionen</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((row) => (
            <tr
              key={row.id}
              className="border-b last:border-0 transition-colors hover:bg-muted/50"
            >
              <td className="py-4 pr-4">
                <div className="flex items-center gap-2 font-medium">
                  <RiFilePdfLine className="text-destructive/70 size-4 shrink-0" />
                  <span className="truncate">{row.dateiname}</span>
                </div>
                <div className="text-muted-foreground mt-0.5 text-xs font-mono">
                  {row.id} &middot; {row.gutachtenRef}
                </div>
              </td>
              <td className="py-4 pr-4 hidden md:table-cell">
                <Badge variant="secondary" className="font-normal">
                  {row.gutachtenart}
                </Badge>
              </td>
              <td className="text-muted-foreground py-4 pr-4 hidden sm:table-cell whitespace-nowrap">
                {new Date(row.erstellt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="py-4 text-right">
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link
                    href={`/pruefung-dashboard/${row.id}`}
                    target="_blank"
                  >
                    Dashboard
                    <RiExternalLinkLine className="size-3.5" />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Modal: Neue Prüfung ──────────────────────────────────── */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-lg"
          showCloseButton={modalState === "form" || modalState === "done"}
        >
          {/* ── Form state ─────────────────────────────────────────── */}
          {modalState === "form" && (
            <>
              <DialogHeader>
                <DialogTitle>Neue Gutachtenprüfung</DialogTitle>
                <DialogDescription>
                  Laden Sie ein Gutachten hoch und wählen Sie die Gutachtenart.
                  Die KI prüft das Dokument anhand der hinterlegten Regeln.
                </DialogDescription>
              </DialogHeader>

              {/* File upload */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Gutachten (PDF)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-lg border-2 border-dashed py-8 flex flex-col items-center gap-2 text-sm transition-colors hover:border-primary/40 hover:bg-muted/30 cursor-pointer"
                >
                  {selectedFile ? (
                    <>
                      <RiFilePdfLine className="size-8 text-destructive/70" />
                      <span className="font-medium">{selectedFile.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {(selectedFile.size / 1024).toFixed(0)} KB – Klicken zum
                        Ändern
                      </span>
                    </>
                  ) : (
                    <>
                      <RiUploadCloud2Line className="size-8 text-muted-foreground/50" />
                      <span className="text-muted-foreground">
                        PDF-Datei auswählen
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Gutachtenart select */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Gutachtenart
                </label>
                <Select value={selectedArt} onValueChange={setSelectedArt}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Gutachtenart auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {gutachtenarten.map((art) => (
                      <SelectItem key={art} value={art}>
                        {art}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Abbrechen
                </Button>
                <Button disabled={!canStart} onClick={startChecking}>
                  Prüfung starten
                </Button>
              </div>
            </>
          )}

          {/* ── Reading state ──────────────────────────────────────── */}
          {modalState === "reading" && (
            <>
              <DialogHeader>
                <DialogTitle>Dokument wird eingelesen…</DialogTitle>
                <DialogDescription>
                  {selectedFile?.name} &middot; {selectedArt}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center py-6 gap-4">
                <div className="relative size-16">
                  <RiFilePdfLine className="size-16 text-destructive/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RiLoader4Line className="size-6 text-primary animate-spin" />
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>PDF analysieren, Seiten extrahieren…</span>
                    <span className="tabular-nums">{readProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${readProgress}%` }}
                    />
                  </div>
                </div>

                <p className="text-muted-foreground/60 text-xs text-center">
                  Text und Struktur werden erkannt, Seiten werden indexiert…
                </p>
              </div>
            </>
          )}

          {/* ── Checking state ─────────────────────────────────────── */}
          {modalState === "checking" && (
            <>
              <DialogHeader>
                <DialogTitle>Gutachten wird geprüft…</DialogTitle>
                <DialogDescription>
                  {selectedFile?.name} &middot; {selectedArt}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-1 max-h-80 overflow-y-auto -mx-1 px-1">
                {ruleChecks.map((rule) => (
                  <div
                    key={rule.id}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 ${
                      rule.status === "checking"
                        ? "bg-primary/5"
                        : rule.status === "failed"
                          ? "bg-destructive/5"
                          : ""
                    }`}
                  >
                    {/* Status icon */}
                    <div className="size-5 shrink-0 flex items-center justify-center">
                      {rule.status === "pending" && (
                        <div className="size-2 rounded-full bg-muted-foreground/20" />
                      )}
                      {rule.status === "checking" && (
                        <RiLoader4Line className="size-4 text-primary animate-spin" />
                      )}
                      {rule.status === "passed" && (
                        <RiCheckLine className="size-4 text-emerald-500" />
                      )}
                      {rule.status === "failed" && (
                        <span className="text-destructive text-xs font-bold">✕</span>
                      )}
                    </div>

                    {/* Rule info */}
                    <span className="text-muted-foreground font-mono text-xs w-8 shrink-0">
                      {rule.id}
                    </span>
                    <span
                      className={`flex-1 ${
                        rule.status === "pending"
                          ? "text-muted-foreground/40"
                          : rule.status === "checking"
                            ? "text-foreground font-medium"
                            : rule.status === "failed"
                              ? "text-destructive"
                              : "text-muted-foreground"
                      }`}
                    >
                      {rule.titel}
                    </span>

                    {/* Result badge */}
                    {rule.status === "passed" && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal text-emerald-600"
                      >
                        Bestanden
                      </Badge>
                    )}
                    {rule.status === "failed" && (
                      <Badge
                        variant="destructive"
                        className="text-xs font-normal"
                      >
                        Verstoß
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress summary */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (ruleChecks.filter(
                          (r) => r.status === "passed" || r.status === "failed",
                        ).length /
                          ruleChecks.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <span className="tabular-nums">
                  {
                    ruleChecks.filter(
                      (r) => r.status === "passed" || r.status === "failed",
                    ).length
                  }
                  /{ruleChecks.length} Regeln geprüft
                </span>
              </div>
            </>
          )}

          {/* ── Done state ─────────────────────────────────────────── */}
          {modalState === "done" && (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <RiCheckboxCircleLine className="size-6 text-emerald-500" />
              </div>
              <p className="text-sm font-medium">Prüfung abgeschlossen</p>
              <p className="text-muted-foreground text-xs">
                {ruleChecks.filter((r) => r.status === "failed").length} Verstöße
                gefunden &middot;{" "}
                {ruleChecks.filter((r) => r.status === "passed").length} Regeln
                bestanden
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
