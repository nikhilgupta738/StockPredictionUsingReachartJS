export interface StockPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type StockSeries = StockPoint[];

export const COMPANIES: { ticker: string; name: string }[] = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corp." },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "AMZN", name: "Amazon.com, Inc." },
  { ticker: "META", name: "Meta Platforms, Inc." },
  { ticker: "TSLA", name: "Tesla, Inc." },
  { ticker: "NVDA", name: "NVIDIA Corporation" },
  { ticker: "JPM", name: "JPMorgan Chase & Co." },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "V", name: "Visa Inc." },
  { ticker: "NFLX", name: "Netflix, Inc." },
];

// Deterministic PRNG for repeatable mock data
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

export function generateStockSeries(ticker: string, days = 3 * 365): StockSeries {
  const seed = hashCode(ticker);
  const rand = mulberry32(seed);

  // Base price per ticker for variety
  const basePrice = 50 + Math.floor(rand() * 400); // 50 - 450
  let lastClose = basePrice * (0.9 + rand() * 0.2); // +-10%

  const out: StockSeries = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    // Random walk dynamics
    const drift = (rand() - 0.5) * 0.02; // daily drift +-1%
    const volatility = 0.01 + rand() * 0.02; // 1% - 3%
    const shock = (rand() - 0.5) * volatility;

    const open = Math.max(1, lastClose * (1 + (rand() - 0.5) * 0.01));
    let close = Math.max(1, open * (1 + drift + shock));
    const high = Math.max(open, close) * (1 + rand() * 0.01);
    const low = Math.min(open, close) * (1 - rand() * 0.01);
    const volume = Math.floor(1_000_000 + rand() * 9_000_000); // 1M - 10M

    lastClose = close;

    out.push({
      date: d.toISOString().slice(0, 10),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });
  }

  return out;
}

export function computeSMA(series: StockSeries, window: number) {
  const result: number[] = new Array(series.length).fill(NaN);
  let sum = 0;
  for (let i = 0; i < series.length; i++) {
    sum += series[i].close;
    if (i >= window) sum -= series[i - window].close;
    if (i >= window - 1) result[i] = Number((sum / window).toFixed(2));
  }
  return result;
}

export function getStats(series: StockSeries) {
  const n = series.length;
  const last = series[n - 1];
  const prev = series[n - 2] ?? last;
  const change = last.close - prev.close;
  const changePct = (change / prev.close) * 100;

  const last365 = series.slice(-365);
  const high52 = Math.max(...last365.map((d) => d.high));
  const low52 = Math.min(...last365.map((d) => d.low));
  const avgVolume =
    last365.reduce((acc, d) => acc + d.volume, 0) / Math.max(1, last365.length);

  return {
    last,
    change: Number(change.toFixed(2)),
    changePct: Number(changePct.toFixed(2)),
    high52: Number(high52.toFixed(2)),
    low52: Number(low52.toFixed(2)),
    avgVolume: Math.round(avgVolume),
  };
}

// Simple linear regression for next-day prediction over lookback window
export function predictNextClose(series: StockSeries, lookback = 60) {
  const data = series.slice(-lookback);
  const n = data.length;
  if (n < 2) return data[data.length - 1]?.close ?? 0;

  // x: 0..n-1, y: close
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = data[i].close;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  const denom = n * sumXX - sumX * sumX;
  const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  const nextX = n; // next day index
  const pred = intercept + slope * nextX;
  return Number(pred.toFixed(2));
}
