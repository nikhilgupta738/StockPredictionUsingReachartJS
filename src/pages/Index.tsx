import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CompanyList from "@/components/CompanyList";
import StockChart from "@/components/StockChart";
import { COMPANIES, generateStockSeries, getStats, predictNextClose } from "@/lib/stocks";

const Index = () => {
  useEffect(() => {
    document.title = "Stock Market Dashboard – Interactive Charts & Stats";
  }, []);

  const [selected, setSelected] = useState(COMPANIES[0].ticker);
  const [predicted, setPredicted] = useState<number | null>(null);

  const datasets = useMemo(() => {
    const map = new Map<string, ReturnType<typeof generateStockSeries>>();
    for (const c of COMPANIES) {
      map.set(c.ticker, generateStockSeries(c.ticker));
    }
    return map;
  }, []);

  const data = datasets.get(selected)!;
  const stats = useMemo(() => getStats(data), [data]);

  const handlePredict = () => {
    const p = predictNextClose(data, 60);
    setPredicted(p);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Stock Market Dashboard</h1>
          <a href="#main" className="text-sm text-muted-foreground underline">Skip to content</a>
        </div>
      </header>

      <main id="main" className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        <section aria-label="Company list" className="md:col-span-3 lg:col-span-3 xl:col-span-3">
          <Card className="h-[70vh] md:h-[78vh] p-0">
            <CompanyList
              companies={COMPANIES}
              selected={selected}
              onSelect={(t) => {
                setSelected(t);
                setPredicted(null);
              }}
            />
          </Card>
        </section>

        <section aria-label="Chart & stats" className="md:col-span-9 lg:col-span-9 xl:col-span-9 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Last Price</div>
              <div className="text-2xl font-semibold">${stats.last.close.toFixed(2)}</div>
              <div className={stats.change >= 0 ? "text-primary text-sm" : "text-destructive text-sm"}>
                {stats.change >= 0 ? "+" : ""}{stats.change.toFixed(2)} ({stats.changePct.toFixed(2)}%)
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">52W High</div>
              <div className="text-xl font-medium">${stats.high52.toFixed(2)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">52W Low</div>
              <div className="text-xl font-medium">${stats.low52.toFixed(2)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Avg Volume (yr)</div>
              <div className="text-xl font-medium">{stats.avgVolume.toLocaleString()}</div>
            </Card>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{selected} — {COMPANIES.find(c => c.ticker === selected)?.name}</h2>
              <p className="text-sm text-muted-foreground">Mock data for demonstration. Switch companies from the left.</p>
            </div>
            <Button onClick={handlePredict} variant="default">Predict next day</Button>
          </div>

          <StockChart data={data} ticker={selected} predicted={predicted} />
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Data is simulated for demo purposes. Built with React, Vite, Tailwind, and Recharts.
        </div>
      </footer>
    </div>
  );
};

export default Index;
