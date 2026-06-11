# SA Insight — South Africa Data Dashboard

An interactive data dashboard visualising South African unemployment, load shedding, and crime statistics from 2019 to 2024. Built to demonstrate real-world data analysis, Python data pipelines, and React visualisation skills.

---

## The Problem This Solves

South Africa's key socioeconomic datasets (Stats SA, Eskom, SAPS) are published as raw PDFs and spreadsheets. This dashboard transforms that data into a single, interactive interface where trends become immediately visible — no spreadsheet required.

---

## Features

### Unemployment Tab
- National unemployment rate trend (area chart) from 2019 to 2024
- Provincial comparison (line chart) with toggleable province filters
- Stat cards: national rate, total unemployed, highest and lowest provinces

### Load Shedding Tab
- Annual hours of load shedding lost (area chart)
- Maximum stage reached per year (area chart)
- Stat cards: worst year, total hours lost, 2024 recovery indicator

### Crime Tab
- National murder trend (area chart)
- All four crime categories (line chart) with toggleable category filters
- Stat cards: 2024 totals, year-on-year comparison

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Data pipeline | Python 3 (csv, json) | Lightweight, no dependencies, mirrors real data engineering |
| Frontend | React | Component-based, industry standard |
| Charts | Recharts | Built for React, clean API |
| Styling | Inline CSS | No build tool required, portable |

---

## Getting Started

### Run the data pipeline
```bash
python process.py
```
This reads the three raw CSVs in `data/raw/` and outputs `data/clean.json`.

### Run the React dashboard
Open `src/App.jsx` in a React-capable environment such as CodeSandbox or StackBlitz. This repository is structured as a React UI artifact and does not include a local bundler configuration.

```bash
npm install
```

---

## Data Pipeline

```
data/raw/unemployment.csv  ─┐
data/raw/loadshedding.csv  ─┤─→ process.py ─→ data/clean.json ─→ React App
data/raw/crime.csv         ─┘
```

`process.py` does the following for each dataset:
- Reads the raw CSV
- Aggregates rows by year and province/category
- Computes national totals and summary statistics
- Outputs a structured JSON file

The React app reads `clean.json` only. No raw data ever enters the frontend.

---

## Key Insights

1. **Unemployment peaked in 2021** at 38.9% nationally, driven by COVID-19 lockdown job losses. By 2024 it had declined to 35.4% but remains structurally high.

2. **2022 and 2023 were South Africa's worst load shedding years** — over 1,200 hours of outages annually. Stage 7 was recorded in 2023. By mid-2024 outages had dropped to near zero.

3. **Murder incidents peaked in 2022** at 12,303 nationally and declined to 10,847 by 2024, an 11.8% drop. Western Cape has the highest murder rate per 100,000 residents despite lower absolute numbers than Gauteng.

---

## Data Sources

| Dataset | Source | URL |
|---|---|---|
| Unemployment | Stats SA Quarterly Labour Force Survey | statssa.gov.za |
| Load Shedding | Eskom / EskomSePush | eskom.co.za |
| Crime | SAPS Annual Crime Statistics | saps.gov.za |

> Data in this project is representative of published trends. Verify exact figures at the official sources above.

---

## Folder Structure

```
sa-dashboard/
├── data/
│   ├── raw/               # Original source files. Do not edit.
│   │   ├── unemployment.csv
│   │   ├── loadshedding.csv
│   │   └── crime.csv
│   └── clean.json         # Pipeline output. Do not edit manually.
├── src/
│   └── App.jsx            # Complete React dashboard
├── process.py             # Data cleaning and transformation
├── AGENTS.md              # AI prompt context file
├── README.md
└── package.json
```

---

## What I Learned

- Designing a data pipeline that separates raw data from application data
- Using Python's standard library (csv, json) without external dependencies
- Building interactive filter controls in React that update charts in real time
- Working with Recharts AreaChart and LineChart for trend visualisation
- Presenting data responsibly by citing sources and flagging data limitations

---

## Author

Boitshoko Soomo | [github.com/BoitshokoSoomo](https://github.com/BoitshokoSoomo) | [linkedin.com/in/boitshoko-soomo-13a0b7220](https://linkedin.com/in/boitshoko-soomo-13a0b7220)
