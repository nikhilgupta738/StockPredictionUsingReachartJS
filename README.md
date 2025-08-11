# Stock Market Dashboard

A clean, responsive Stock Market Dashboard built with React, Vite, Tailwind CSS, shadcn-ui, and Recharts. It features a left company list, an interactive main chart with 50/200-day SMAs, 52-week statistics, average volume, and a lightweight ML-based next-day price prediction.

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS + shadcn-ui
- Recharts for charting
- Mock, deterministic stock data generator (no external API needed)

## Development Approach (short note)
This first version focuses on a delightful, performant frontend experience without external dependencies or CORS issues. I generated deterministic, repeatable mock time-series data for at least 10 well-known tickers using a seeded random walk, which allows consistent charts across reloads. The UI uses a two-panel layout: a scrollable company list on the left and a main panel for charts and key stats. The chart overlays 50/200-day simple moving averages and supports quick range filters (1M, 3M, 6M, 1Y, YTD, ALL). A lightweight linear regression over recent closes provides a simple next‑day prediction that’s clearly marked and visually distinct from historical data.

The design system is centralized in Tailwind CSS tokens (HSL), ensuring strong contrast, theming, and responsiveness. Components use semantic HTML and accessibility-friendly patterns. This sets a solid foundation for future enhancements like live data via a backend (FastAPI/Node or Supabase), database storage, technical indicators (RSI/MACD), and deployment (Render/Railway/Vercel).

## Features
- 10+ companies to browse
- Interactive line chart with SMAs
- 52‑week high/low and average volume
- Time ranges: 1M, 3M, 6M, 1Y, YTD, ALL
- One‑click next‑day prediction


## Screenshot
Open the running app and take a screenshot of the dashboard view.

## Development approach: 
I prioritized a fast, deterministic, and fully client-side experience to avoid external API constraints and ensure reproducible visuals. The app uses a seeded mock time-series generator to simulate realistic price/volume data across at least 10 tickers, enabling consistent charts, quick iteration, and reliable demos. The UI follows a two-panel layout: a searchable company list on the left and an interactive chart with key stats on the right. I emphasized accessibility, semantic HTML, and a centralized design system for maintainability. Lightweight ML via linear regression provides a clear, optional next‑day prediction to illustrate forecasting without overpromising accuracy.

## Technologies used: 
React with Vite and TypeScript for a fast DX and strong typing; Tailwind CSS with shadcn‑ui for a cohesive, token-driven design system; Recharts for performant, responsive charting and overlays (50/200-day SMAs, prediction marker). Router, toast/tooltip utilities, and SEO adjustments round out a production-friendly frontend foundation.

## Challenges encountered:

Balancing realism with determinism: crafting mock data that “feels” market-like while staying reproducible.
Chart clarity vs. density: layering price, SMAs, ranges, and predictions without clutter; careful color tokens and hierarchy helped.
Performance and responsiveness: ensuring smooth interactions across ranges and screen sizes, optimizing data transforms and renders.
Communicating prediction uncertainty: distinct styling and copy to avoid implying financial advice.
Design cohesion: maintaining accessible contrast and dark/light parity through semantic tokens. Future iterations could add live data, persistence, and auth via Supabase, plus advanced indicators (RSI/MACD) and deployment automation.
I’ll provide a 200–300 word note covering the approach, technologies, and challenges.