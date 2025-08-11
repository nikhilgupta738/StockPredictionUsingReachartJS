import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { StockSeries } from "@/lib/stocks";
import { computeSMA } from "@/lib/stocks";

interface StockChartProps {
  data: StockSeries;
  ticker: string;
  predicted?: number | null;
}

const RANGES = ["1M", "3M", "6M", "1Y", "YTD", "ALL"] as const;
export type RangeKey = typeof RANGES[number];

function filterByRange(data: StockSeries, range: RangeKey) {
  if (range === "ALL") return data;
  const n = data.length;
  const idxBy = (days: number) => Math.max(0, n - days);
  switch (range) {
    case "1M":
      return data.slice(idxBy(30));
    case "3M":
      return data.slice(idxBy(90));
    case "6M":
      return data.slice(idxBy(180));
    case "1Y":
      return data.slice(idxBy(365));
    case "YTD": {
      const year = new Date().getFullYear();
      const start = `${year}-01-01`;
      const i = data.findIndex((d) => d.date >= start);
      return i === -1 ? data : data.slice(i);
    }
    default:
      return data;
  }
}

export default function StockChart({ data, ticker, predicted }: StockChartProps) {
  const [range, setRange] = useState<RangeKey>("6M");

  const { chartData, lastDatePlusOne } = useMemo(() => {
    const sma50 = computeSMA(data, 50);
    const sma200 = computeSMA(data, 200);

    const merged = data.map((d, i) => ({
      ...d,
      sma50: sma50[i],
      sma200: sma200[i],
    }));

    const filtered = filterByRange(merged, range);

    // Predicted point for next day
    const lastDate = new Date(merged[merged.length - 1].date);
    const next = new Date(lastDate);
    next.setDate(lastDate.getDate() + 1);
    const nextStr = next.toISOString().slice(0, 10);

    const out = [...filtered];
    if (predicted != null && !Number.isNaN(predicted)) {
      out.push({
        date: nextStr,
        open: predicted,
        high: predicted,
        low: predicted,
        close: predicted,
        volume: 0,
        sma50: NaN,
        sma200: NaN,
        predicted,
      } as any);
    }

    return { chartData: out, lastDatePlusOne: nextStr };
  }, [data, range, predicted]);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">{ticker} Price Chart</h2>
          <p className="text-sm text-muted-foreground">Close with 50/200-day SMA</p>
        </div>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={range === r ? "default" : "secondary"}
              onClick={() => setRange(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={24} />
            <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
            <Tooltip
              formatter={(v: any, n: any) =>
                n === "volume" ? (v as number).toLocaleString() : `$${Number(v).toFixed(2)}`
              }
            />
            <Legend />
            <Line type="monotone" dataKey="close" name="Close" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="sma50" name="SMA 50" stroke="hsl(var(--accent))" dot={false} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="sma200" name="SMA 200" stroke="hsl(var(--muted-foreground))" dot={false} strokeDasharray="2 6" />
            {predicted != null && (
              <>
                <Line type="linear" dataKey="predicted" name="Predicted" stroke="hsl(var(--ring))" dot={{ r: 4 }} strokeDasharray="2 2" />
                <ReferenceDot x={lastDatePlusOne} y={predicted} r={5} fill="hsl(var(--ring))" />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
