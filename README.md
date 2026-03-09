# MindPulse

A remote therapeutic monitoring (RTM) dashboard for clinicians to monitor patients with depression and anxiety between clinic visits. MindPulse provides real-time visibility into patient risk levels, assessment trends, passive behavioral data, and clinical alerts — enabling earlier intervention and better outcomes.

> **Status:** Prototype with synthetic data. No backend integration — all patient data is algorithmically generated for demonstration purposes.

<!-- Add a screenshot: ![MindPulse Dashboard](./screenshot.png) -->

## Features

- **Risk Scoring & Stratification** — Composite risk scores (0–100) with four severity levels (low, moderate, elevated, critical) and trend tracking
- **Clinical Assessments** — PHQ-9 and GAD-7 score tracking over 26 weeks with severity band visualization
- **Passive Behavioral Monitoring** — 14 metrics across 7 categories (sleep, activity, screen time, social engagement, typing patterns, voice biomarkers, mobility)
- **Alert System** — Automated alerts for score spikes, missed assessments, passive data anomalies, medication gaps, and risk escalations
- **Patient Dashboard** — Filterable patient list with search, risk-level filtering, and condition-based views
- **Patient Detail View** — Tabbed interface with overview, passive data deep-dive, clinician notes & journal entries, and event timeline
- **Medication Adherence** — Visual adherence tracking timeline
- **Mood Tracking** — Daily mood rating charts with trend analysis

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS 4 (OKLch color system, dark theme) |
| Charts | Recharts 3 |
| Icons | Lucide React |

## Project Structure

```
mindpulse/
├── app/                        # Next.js pages
│   ├── page.tsx                # Dashboard (patient list)
│   └── patients/[id]/page.tsx  # Patient detail view
├── components/
│   ├── dashboard/              # Patient list, filters, summary metrics
│   ├── patient/                # Assessment charts, passive data, notes, timeline
│   ├── shared/                 # Reusable components (metric cards, badges, sparklines)
│   ├── layout/                 # Sidebar, top bar
│   └── ui/                     # shadcn/ui primitives
└── lib/
    ├── mock-data.ts            # Deterministic synthetic data generation
    ├── types.ts                # TypeScript type definitions
    ├── constants.ts            # Risk thresholds, severity bands, colors
    └── formatters.ts           # Date, score, and severity formatting
```

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Data Model

The mock data system generates 12 patient archetypes with realistic clinical patterns:

- **Assessment scores** follow configurable trend patterns (improving, declining, stable, cyclical)
- **Passive metrics** simulate real-world behavioral data with normal range deviations
- **Alerts** are generated based on clinical rules (score thresholds, missed assessments, anomaly detection)
- **Risk scores** are composite values derived from assessment trends, passive data, and alert history

All data generation uses a seeded PRNG for deterministic, reproducible results.

## License

MIT
