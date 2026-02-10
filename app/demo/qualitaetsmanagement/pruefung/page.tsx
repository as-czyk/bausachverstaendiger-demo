import Link from "next/link";
import { RiAddLine, RiExternalLinkLine, RiFilePdfLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export default function PruefungPage() {
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
        <Button className="gap-1.5 shrink-0">
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
    </div>
  );
}
