"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  RiSearchLine,
  RiCloseLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiFileTextLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ── Filter options ──────────────────────────────────────────────────

const gutachtenartOptions = [
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

const schadensartOptions = [
  "Feuchtigkeitssch\xe4den / Abdichtungsm\xe4ngel",
  "Schimmelbefall",
  "Wassersch\xe4den",
  "Risse (Mauerwerk, Putz, Estrich)",
  "W\xe4rmebr\xfccken / D\xe4mmungsm\xe4ngel",
  "Fenster- und T\xfcrm\xe4ngel",
  "Dachsch\xe4den",
  "Estrichsch\xe4den",
  "Schallschutzm\xe4ngel",
  "Brandsch\xe4den",
  "Statische Sch\xe4den",
];

const gebaeudeartOptions = [
  "Einfamilienhaus",
  "Mehrfamilienhaus",
  "Reihenhaus",
  "Doppelhaush\xe4lfte",
  "Eigentumswohnung",
  "Gewerbeimmobilie",
  "Altbau (vor 1949)",
  "Neubau (nach 2000)",
  "Bestandsgeb\xe4ude (1950\u20132000)",
];

const datumOptions = [
  "Letzte 3 Monate",
  "Letzte 6 Monate",
  "Letztes Jahr",
  "Letzte 2 Jahre",
  "Letzte 5 Jahre",
  "\xc4lter als 5 Jahre",
];

const regionOptions = [
  "Baden-W\xfcrttemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Th\xfcringen",
];

const normOptions = [
  "DIN 18202 (Toleranzen im Hochbau)",
  "DIN 4108 (W\xe4rmeschutz)",
  "DIN 18195 (Bauwerksabdichtung)",
  "VOB/B (Allgemeine Vertragsbedingungen)",
  "VOB/C (Technische Vertragsbedingungen)",
  "EnEV / GEG (Energieeinsparung)",
  "WTA-Merkbl\xe4tter (Feuchteschutz)",
  "DIN 1961 (Mangeldefinition)",
  "DIN EN ISO 13788 (Feuchte)",
];

// ── Mock results ────────────────────────────────────────────────────

interface GutachtenResult {
  id: string;
  titel: string;
  datum: string;
  zusammenfassung: string;
  gutachtenart: string;
  schadensart: string;
  gebaeudeart: string;
  region: string;
  normen: string[];
  relevanz: number;
}

const mockResults: GutachtenResult[] = [
  {
    id: "GA-2024-0847",
    titel: "Schimmelbefall durch W\xe4rmebr\xfccke an Giebelwand",
    datum: "2024-11-14",
    zusammenfassung:
      "Im Bereich der nord\xf6stlichen Giebelwand wurde grofl\xe4chiger Schimmelbefall (Gattung Aspergillus) festgestellt. Die Feuchtemessung ergab eine relative Luftfeuchtigkeit von 78% bei einer Oberfl\xe4chentemperatur von 11,2\xb0C. Die thermografische Untersuchung best\xe4tigte eine ausgepr\xe4gte W\xe4rmebr\xfccke im Anschlussbereich Decke/Au\xdfenwand.",
    gutachtenart: "Schimmelgutachten",
    schadensart: "Schimmelbefall",
    gebaeudeart: "Altbau (vor 1949)",
    region: "Nordrhein-Westfalen",
    normen: ["DIN 4108 (W\xe4rmeschutz)", "DIN EN ISO 13788 (Feuchte)"],
    relevanz: 96,
  },
  {
    id: "GA-2024-0612",
    titel: "Feuchteschaden Kellerau\xdfenwand nach Starkregenereignis",
    datum: "2024-08-22",
    zusammenfassung:
      "Nach dem Starkregenereignis vom 15.08.2024 wurden erhebliche Feuchtigkeitseintr\xe4ge an der westlichen Kellerau\xdfenwand festgestellt. Die CM-Messung ergab Feuchtigkeitswerte von 6,8 CM-% im Mauerwerk. Die bestehende Abdichtung gem\xe4\xdf DIN 18195 war nicht fachgerecht ausgef\xfchrt.",
    gutachtenart: "Feuchtigkeitsschadengutachten",
    schadensart: "Feuchtigkeitssch\xe4den / Abdichtungsm\xe4ngel",
    gebaeudeart: "Einfamilienhaus",
    region: "Bayern",
    normen: [
      "DIN 18195 (Bauwerksabdichtung)",
      "WTA-Merkbl\xe4tter (Feuchteschutz)",
    ],
    relevanz: 89,
  },
  {
    id: "GA-2023-1205",
    titel: "Rissbildung im Estrich nach mangelhafter Trocknung",
    datum: "2023-12-03",
    zusammenfassung:
      "Im gesamten Erdgeschoss wurden netzartige Rissbildungen im Zementestrich dokumentiert. Die Estrichdicke betrug lediglich 52 mm statt der vorgeschriebenen 65 mm. Die Pr\xfcfung nach DIN 18202 ergab Ebenheitsabweichungen von bis zu 8 mm auf 1 m Messfl\xe4che.",
    gutachtenart: "Baum\xe4ngelgutachten",
    schadensart: "Risse (Mauerwerk, Putz, Estrich)",
    gebaeudeart: "Neubau (nach 2000)",
    region: "Baden-W\xfcrttemberg",
    normen: [
      "DIN 18202 (Toleranzen im Hochbau)",
      "VOB/C (Technische Vertragsbedingungen)",
    ],
    relevanz: 82,
  },
  {
    id: "GA-2024-0293",
    titel: "Wasserschaden durch defekte Flachdachabdichtung",
    datum: "2024-03-17",
    zusammenfassung:
      "An der Flachdachkonstruktion des Anbaus wurden mehrere Undichtigkeiten im Bereich der Randanschl\xfcsse festgestellt. Die Bitumenbahn wies Blasenbildung und Versprr\xf6dung auf. Durchfeuchtungen waren bis in die Holzbalkendecke nachweisbar, mit Holzfeuchten von bis zu 34%.",
    gutachtenart: "Wasserschadengutachten",
    schadensart: "Dachsch\xe4den",
    gebaeudeart: "Mehrfamilienhaus",
    region: "Hessen",
    normen: [
      "DIN 18195 (Bauwerksabdichtung)",
      "VOB/B (Allgemeine Vertragsbedingungen)",
    ],
    relevanz: 77,
  },
  {
    id: "GA-2023-0891",
    titel: "D\xe4mmungsm\xe4ngel an WDVS-Fassade \u2013 Gerichtsgutachten",
    datum: "2023-09-28",
    zusammenfassung:
      "Im Rahmen des gerichtlichen Beweissicherungsverfahrens wurde die WDVS-Fassade des Objekts untersucht. Die D\xe4mmplatten waren in Teilbereichen nicht vollfl\xe4chig verklebt, der Klebemittelantrag betrug stellenweise unter 40%. Die thermografische Untersuchung zeigte systematische W\xe4rmebr\xfccken an den D\xfcbelstellen.",
    gutachtenart: "Gerichtsgutachten",
    schadensart: "W\xe4rmebr\xfccken / D\xe4mmungsm\xe4ngel",
    gebaeudeart: "Mehrfamilienhaus",
    region: "Berlin",
    normen: [
      "DIN 4108 (W\xe4rmeschutz)",
      "EnEV / GEG (Energieeinsparung)",
      "VOB/C (Technische Vertragsbedingungen)",
    ],
    relevanz: 71,
  },
];

// ── Search states ───────────────────────────────────────────────────

type SearchState = "idle" | "searching" | "done";

// ── Multi-select trigger component ──────────────────────────────────

function MultiSelectTrigger({
  label,
  count,
  ...props
}: {
  label: string;
  count: number;
} & React.ComponentProps<"button">) {
  return (
    <Button
      variant="outline"
      size="default"
      className="w-full justify-between font-normal"
      {...props}
    >
      <span className="truncate">
        {count > 0 ? `${label} (${count})` : label}
      </span>
      <RiArrowDownSLine className="text-muted-foreground size-4 shrink-0" />
    </Button>
  );
}

// ── Progress bar ────────────────────────────────────────────────────

function SearchProgress({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("Datenbank wird durchsucht\u2026");
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const steps = [
      { at: 15, label: "Semantische Analyse\u2026" },
      { at: 40, label: "Vektordatenbank durchsuchen\u2026" },
      { at: 65, label: "\xc4hnliche Gutachten vergleichen\u2026" },
      { at: 85, label: "Ergebnisse aufbereiten\u2026" },
    ];

    let frame: number;
    let current = 0;

    const tick = () => {
      current += Math.random() * 3 + 0.5;
      if (current >= 100) {
        setProgress(100);
        setTimeout(() => onDoneRef.current(), 200);
        return;
      }
      setProgress(current);
      const step = [...steps].reverse().find((s) => current >= s.at);
      if (step) setLabel(step.label);
      const delay = current > 80 ? 60 : current > 50 ? 40 : 30;
      frame = window.setTimeout(tick, delay);
    };

    frame = window.setTimeout(tick, 100);
    return () => clearTimeout(frame);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <div className="bg-muted h-1.5 w-full max-w-md overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

// ── Result card ─────────────────────────────────────────────────────

function ResultCard({ result }: { result: GutachtenResult }) {
  const tags = [
    result.gutachtenart,
    result.schadensart,
    result.gebaeudeart,
    result.region,
    ...result.normen,
  ];

  return (
    <div className="ring-border group flex flex-col gap-4 rounded-xl bg-white p-5 shadow-xs ring-1 transition-shadow hover:shadow-md">
      {/* Top row: ID + date + relevance */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <RiFileTextLine className="text-muted-foreground size-5 shrink-0" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{result.titel}</h3>
            <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
              <span className="font-mono">{result.id}</span>
              <span>{"  \xb7  "}</span>
              <RiCalendarLine className="size-3" />
              <span>
                {new Date(result.datum).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 tabular-nums">
          {result.relevanz}% Relevanz
        </Badge>
      </div>

      {/* Summary */}
      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
        {result.zusammenfassung}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="font-normal">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Detail link */}
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link href={`/demo/gutachten-suchen/${result.id}`}>
            Details ansehen
            <RiArrowRightSLine className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────

export default function GutachtenSuchenPage() {
  const [query, setQuery] = useState("");
  const [gutachtenart, setGutachtenart] = useState("");
  const [schadensarten, setSchadensarten] = useState<string[]>([]);
  const [gebaeudeart, setGebaeudeart] = useState("");
  const [datum, setDatum] = useState("");
  const [region, setRegion] = useState("");
  const [normen, setNormen] = useState<string[]>([]);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [results, setResults] = useState<GutachtenResult[]>([]);

  const toggleMulti = useCallback(
    (
      current: string[],
      setter: React.Dispatch<React.SetStateAction<string[]>>,
      value: string,
    ) => {
      setter(
        current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      );
    },
    [],
  );

  const handleSearch = () => {
    setSearchState("searching");
    setResults([]);
  };

  const handleSearchDone = useCallback(() => {
    setResults(mockResults);
    setSearchState("done");
  }, []);

  // Collect all active filters as pills
  const activeFilters: { label: string; clear: () => void }[] = [];
  if (gutachtenart)
    activeFilters.push({
      label: gutachtenart,
      clear: () => setGutachtenart(""),
    });
  schadensarten.forEach((s) =>
    activeFilters.push({
      label: s,
      clear: () => setSchadensarten((prev) => prev.filter((v) => v !== s)),
    }),
  );
  if (gebaeudeart)
    activeFilters.push({
      label: gebaeudeart,
      clear: () => setGebaeudeart(""),
    });
  if (datum) activeFilters.push({ label: datum, clear: () => setDatum("") });
  if (region)
    activeFilters.push({ label: region, clear: () => setRegion("") });
  normen.forEach((n) =>
    activeFilters.push({
      label: n,
      clear: () => setNormen((prev) => prev.filter((v) => v !== n)),
    }),
  );

  const hasFilters = activeFilters.length > 0 || query.length > 0;

  const resetAll = () => {
    setQuery("");
    setGutachtenart("");
    setSchadensarten([]);
    setGebaeudeart("");
    setDatum("");
    setRegion("");
    setNormen([]);
    setSearchState("idle");
    setResults([]);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Gutachten suchen
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {"Finden Sie \xe4hnliche F\xe4lle aus Ihrer Gutachten-Datenbank"}
        </p>
      </div>

      {/* ── Search bar ── */}
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            "Beschreiben Sie den Fall, z.B. \u201ESchimmel durch W\xe4rmebr\xfccke an Au\xdfenwand im Altbau\u201C\u2026"
          }
          className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-12 w-full rounded-lg border py-3 pr-24 pl-4 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-3 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Button
          size="default"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 gap-1.5"
          onClick={handleSearch}
        >
          <RiSearchLine className="size-4" />
          Suchen
        </Button>
      </div>

      {/* ── Filters grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {/* 1. Gutachtenart */}
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Gutachtenart
          </label>
          <Select value={gutachtenart} onValueChange={setGutachtenart}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Alle Gutachtenarten" />
            </SelectTrigger>
            <SelectContent>
              {gutachtenartOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 2. Schadensart (multi) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Schadensart
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MultiSelectTrigger
                label="Alle Schadensarten"
                count={schadensarten.length}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-64">
              {schadensartOptions.map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt}
                  checked={schadensarten.includes(opt)}
                  onCheckedChange={() =>
                    toggleMulti(schadensarten, setSchadensarten, opt)
                  }
                  onSelect={(e) => e.preventDefault()}
                >
                  {opt}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 3. Gebaeudeart */}
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            {"Geb\xe4udeart"}
          </label>
          <Select value={gebaeudeart} onValueChange={setGebaeudeart}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={"Alle Geb\xe4udearten"} />
            </SelectTrigger>
            <SelectContent>
              {gebaeudeartOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Datum */}
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Zeitraum
          </label>
          <Select value={datum} onValueChange={setDatum}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={"Alle Zeitr\xe4ume"} />
            </SelectTrigger>
            <SelectContent>
              {datumOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 5. Region */}
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Ort / Region
          </label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Alle Regionen" />
            </SelectTrigger>
            <SelectContent>
              {regionOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 6. Norm-Referenzen (multi) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Norm-Referenzen
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MultiSelectTrigger label="Alle Normen" count={normen.length} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-64">
              {normOptions.map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt}
                  checked={normen.includes(opt)}
                  onCheckedChange={() => toggleMulti(normen, setNormen, opt)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {opt}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Active filters + reset ── */}
      {activeFilters.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <Badge
              key={f.label}
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer"
              onClick={f.clear}
            >
              {f.label}
              <RiCloseLine className="size-3" />
            </Badge>
          ))}
          <button
            onClick={resetAll}
            className="text-muted-foreground hover:text-foreground ml-1 text-xs underline underline-offset-2 transition-colors"
          >
            {"Alle Filter zur\xfccksetzen"}
          </button>
        </div>
      )}

      {/* ── Results area ── */}
      <div className="mt-6 border-t pt-6">
        {/* Searching animation */}
        {searchState === "searching" && (
          <SearchProgress onDone={handleSearchDone} />
        )}

        {/* Results */}
        {searchState === "done" && results.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-medium">
                  {results.length}
                </span>{" "}
                Gutachten gefunden
              </p>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={resetAll}>
                  {"Filter zur\xfccksetzen"}
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {results.map((r, i) => (
                <div
                  key={r.id}
                  className="animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                >
                  <ResultCard result={r} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Idle state */}
        {searchState === "idle" && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <RiSearchLine className="text-muted-foreground/30 size-10" />
            <p className="text-muted-foreground text-sm">
              Geben Sie einen Suchbegriff ein oder setzen Sie Filter, um
              Gutachten zu finden.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
