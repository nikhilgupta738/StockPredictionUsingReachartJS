import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export interface Company {
  ticker: string;
  name: string;
}

interface CompanyListProps {
  companies: Company[];
  selected: string;
  onSelect: (ticker: string) => void;
}

export default function CompanyList({ companies, selected, onSelect }: CompanyListProps) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return companies.filter(
      (c) => c.ticker.toLowerCase().includes(s) || c.name.toLowerCase().includes(s)
    );
  }, [companies, q]);

  return (
    <aside className="h-full flex flex-col">
      <div className="p-3">
        <Input
          placeholder="Search companies..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search companies"
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 pb-2 space-y-2">
          {filtered.map((c) => (
            <Card
              role="button"
              aria-pressed={selected === c.ticker}
              key={c.ticker}
              onClick={() => onSelect(c.ticker)}
              className={cn(
                "px-3 py-2 cursor-pointer transition-shadow hover:shadow-md",
                selected === c.ticker && "ring-2 ring-primary"
              )}
            >
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.ticker}</div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
