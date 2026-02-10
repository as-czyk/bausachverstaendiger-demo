import Link from "next/link";
import { RiAddLine, RiArrowRightSLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockData = [
  {
    id: "SD-2025-0012",
    titel: "Wasserschaden Kellergeschoss \u2013 Wohnanlage Bergstra\xdfe",
    datum: "2025-02-03",
    status: "Entwurf" as const,
    gutachten: "GA-2025-0091",
    schadensart: "Wassersch\xe4den",
    fotos: 12,
  },
  {
    id: "SD-2025-0011",
    titel: "Schimmelbefall Schlafzimmer \u2013 EFH M\xfcnchen-Pasing",
    datum: "2025-01-28",
    status: "Abgeschlossen" as const,
    gutachten: "GA-2025-0087",
    schadensart: "Schimmelbefall",
    fotos: 8,
  },
  {
    id: "SD-2025-0010",
    titel: "Rissbildung Fassade S\xfcdseite \u2013 MFH D\xfcsseldorf",
    datum: "2025-01-15",
    status: "Abgeschlossen" as const,
    gutachten: "GA-2025-0079",
    schadensart: "Risse (Mauerwerk, Putz, Estrich)",
    fotos: 15,
  },
  {
    id: "SD-2024-0098",
    titel: "Feuchtigkeitssch\xe4den Badezimmer \u2013 ETW K\xf6ln-Ehrenfeld",
    datum: "2024-12-19",
    status: "Abgeschlossen" as const,
    gutachten: "GA-2024-0847",
    schadensart: "Feuchtigkeitssch\xe4den / Abdichtungsm\xe4ngel",
    fotos: 10,
  },
  {
    id: "SD-2024-0097",
    titel: "D\xe4mmungsm\xe4ngel Au\xdfenwand \u2013 Neubau Hamburg-Altona",
    datum: "2024-12-05",
    status: "Abgeschlossen" as const,
    gutachten: "GA-2024-0612",
    schadensart: "W\xe4rmebr\xfccken / D\xe4mmungsm\xe4ngel",
    fotos: 18,
  },
  {
    id: "SD-2024-0096",
    titel: "Dachschaden nach Sturm \u2013 DHH Stuttgart-Vaihingen",
    datum: "2024-11-22",
    status: "Abgeschlossen" as const,
    gutachten: "GA-2024-0293",
    schadensart: "Dachsch\xe4den",
    fotos: 22,
  },
];

const statusColor: Record<string, "default" | "secondary"> = {
  Entwurf: "default",
  Abgeschlossen: "secondary",
};

export default function SchadensdarstellungSchreibenPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Schadensdarstellungen
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {"\xdcbersicht aller erstellten Schadensdarstellungen"}
          </p>
        </div>
        <Button className="gap-1.5 shrink-0" asChild>
          <Link href="/demo/schadensdarstellung-schreiben/neu">
            <RiAddLine className="size-4" />
            Neue Schadensdarstellung
          </Link>
        </Button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="text-muted-foreground pb-3 font-medium">Titel</th>
            <th className="text-muted-foreground pb-3 font-medium hidden sm:table-cell">
              Datum
            </th>
            <th className="text-muted-foreground pb-3 font-medium hidden md:table-cell">
              Schadensart
            </th>
            <th className="text-muted-foreground pb-3 font-medium hidden lg:table-cell text-center">
              Fotos
            </th>
            <th className="text-muted-foreground pb-3 font-medium">Status</th>
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
                <div className="font-medium">{row.titel}</div>
                <div className="text-muted-foreground mt-0.5 text-xs font-mono">
                  {row.id} &middot; {row.gutachten}
                </div>
              </td>
              <td className="text-muted-foreground py-4 pr-4 hidden sm:table-cell whitespace-nowrap">
                {new Date(row.datum).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="py-4 pr-4 hidden md:table-cell">
                <Badge variant="secondary" className="font-normal">
                  {row.schadensart}
                </Badge>
              </td>
              <td className="text-muted-foreground py-4 pr-4 hidden lg:table-cell text-center tabular-nums">
                {row.fotos}
              </td>
              <td className="py-4 pr-4">
                <Badge
                  variant={statusColor[row.status]}
                  className="font-normal"
                >
                  {row.status}
                </Badge>
              </td>
              <td className="py-4 text-right">
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href={`/demo/schadensdarstellung-schreiben/${row.id}`}>
                    Details
                    <RiArrowRightSLine className="size-4" />
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
