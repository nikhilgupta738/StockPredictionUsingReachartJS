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

## Live/Deploy
Use Lovable Share → Publish to deploy. You can also dockerize or host on Render/Railway/Vercel.

## Screenshot
Open the running app and take a screenshot of the dashboard view.
