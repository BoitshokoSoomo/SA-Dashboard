# AGENTS.md - SA Insight Dashboard

## Project
Interactive data dashboard visualising South African unemployment, load shedding, and crime statistics from 2019 to 2024. Built to demonstrate data analysis, Python data pipelines, and React visualisation skills.

## Stack
- Data processing: Python 3 (csv, json standard library — no pandas dependency)
- Frontend: React with Recharts for all charts
- Styling: Inline styles only (no CSS files, no Tailwind)
- Data format: clean.json (output of process.py — single source of truth)

## Folder Structure
sa-dashboard/
├── data/
│   ├── raw/
│   │   ├── unemployment.csv   # DO NOT EDIT
│   │   ├── loadshedding.csv   # DO NOT EDIT
│   │   └── crime.csv          # DO NOT EDIT
│   └── clean.json             # Output of process.py. DO NOT EDIT manually.
├── src/
│   └── App.jsx                # Entire React app. Single file.
├── process.py                 # Data cleaning and transformation script
├── README.md
├── AGENTS.md
└── package.json

## Rules
- All data transformation happens in process.py only. Never manipulate data inside React.
- clean.json is the only data source for the frontend. Never import raw CSVs into React.
- All charts use Recharts only. Do not add Chart.js, D3, or any other chart library.
- Filters and selected state live in each tab component. Pass data down as props only.
- Each chart component receives data as a prop. No fetching or processing inside chart components.
- Colors are defined in the COLORS constant at the top of App.jsx. Never hardcode hex values elsewhere.
- All styling is inline. Do not create separate CSS files.

## Tabs
1. Unemployment — national AreaChart trend + province LineChart with toggle filters
2. Load Shedding — annual hours AreaChart + max stage AreaChart
3. Crime — murder AreaChart + all-categories LineChart with toggle filters

## Data Schema (clean.json)
{
  "meta": { "sources": {...}, "years_covered": "2019-2024" },
  "unemployment": {
    "national_trend": [{ "year": int, "rate": float, "unemployed": int }],
    "province_trends": { "Province": [{ "year": int, "rate": float }] },
    "summary": { "national_rate": float, "highest_province": {...}, "lowest_province": {...} }
  },
  "loadshedding": {
    "annual": [{ "year": int, "total_hours": int, "max_stage": int, "incidents": int }],
    "summary": { "worst_year": {...}, "best_year": {...} }
  },
  "crime": {
    "category_trends": { "Category": [{ "year": int, "incidents": int }] },
    "summary": { "highest_crime_province": str, "lowest_crime_province": str }
  }
}

## Data Sources
- Unemployment: Stats SA Quarterly Labour Force Survey — statssa.gov.za
- Load Shedding: Eskom / EskomSePush records — eskom.co.za
- Crime: SAPS Annual Crime Statistics — saps.gov.za

## What NOT to touch
- Do not edit files in data/raw/
- Do not add a backend or API. This is a static frontend app.
- Do not change the clean.json schema without updating both process.py and App.jsx
- Do not add a build tool or bundler. This runs as a React artifact.

## Current Status
Complete. Three tabs: Unemployment, Load Shedding, Crime. Python pipeline + React dashboard.
