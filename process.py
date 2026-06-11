"""
process.py - SA Dashboard Data Pipeline
Reads raw CSVs, cleans and transforms data, outputs clean.json
Run: python process.py
"""

import csv
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(BASE, "data", "raw")
OUT = os.path.join(BASE, "data", "clean.json")

def read_csv(filename):
    path = os.path.join(RAW, filename)
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))

# ── UNEMPLOYMENT ──────────────────────────────────────────────────
def process_unemployment():
    rows = read_csv("unemployment.csv")
    provinces = sorted(set(r["province"] for r in rows))
    years = sorted(set(int(r["year"]) for r in rows))

    # National average per year
    national_trend = []
    for year in years:
        yr_rows = [r for r in rows if int(r["year"]) == year]
        total_unemployed = sum(int(r["unemployed"]) for r in yr_rows)
        total_labour = sum(int(r["labour_force"]) for r in yr_rows)
        rate = round((total_unemployed / total_labour) * 100, 1)
        national_trend.append({"year": year, "rate": rate,
                                "unemployed": total_unemployed, "labour_force": total_labour})

    # By province trend
    province_trends = {}
    for province in provinces:
        prov_rows = [r for r in rows if r["province"] == province]
        province_trends[province] = [
            {"year": int(r["year"]), "rate": float(r["rate"])}
            for r in sorted(prov_rows, key=lambda x: x["year"])
        ]

    # Latest year summary
    latest_year = max(years)
    latest = [r for r in rows if int(r["year"]) == latest_year]
    highest = max(latest, key=lambda r: float(r["rate"]))
    lowest = min(latest, key=lambda r: float(r["rate"]))
    latest_national = next(n for n in national_trend if n["year"] == latest_year)

    return {
        "national_trend": national_trend,
        "province_trends": province_trends,
        "provinces": provinces,
        "years": years,
        "summary": {
            "latest_year": latest_year,
            "national_rate": latest_national["rate"],
            "highest_province": {"name": highest["province"], "rate": float(highest["rate"])},
            "lowest_province": {"name": lowest["province"], "rate": float(lowest["rate"])},
            "total_unemployed": latest_national["unemployed"]
        }
    }

# ── LOAD SHEDDING ─────────────────────────────────────────────────
def process_loadshedding():
    rows = read_csv("loadshedding.csv")
    years = sorted(set(int(r["year"]) for r in rows))

    # Annual totals
    annual = []
    for year in years:
        yr_rows = [r for r in rows if int(r["year"]) == year]
        total_hours = sum(int(r["total_hours"]) for r in yr_rows)
        total_days = sum(int(r["total_days"]) for r in yr_rows)
        max_stage = max(int(r["stage"]) for r in yr_rows)
        incidents = sum(int(r["incidents"]) for r in yr_rows)
        annual.append({
            "year": year,
            "total_hours": total_hours,
            "total_days": total_days,
            "max_stage": max_stage,
            "incidents": incidents
        })

    # Monthly detail
    monthly = [
        {
            "year": int(r["year"]),
            "month": r["month"],
            "stage": int(r["stage"]),
            "hours_per_day": int(r["hours_per_day"]),
            "total_hours": int(r["total_hours"])
        }
        for r in rows
    ]

    worst_year = max(annual, key=lambda x: x["total_hours"])
    best_year = min(annual, key=lambda x: x["total_hours"])

    return {
        "annual": annual,
        "monthly": monthly,
        "years": years,
        "summary": {
            "worst_year": worst_year,
            "best_year": best_year,
            "total_hours_all_time": sum(a["total_hours"] for a in annual),
            "peak_stage": max(a["max_stage"] for a in annual)
        }
    }

# ── CRIME ─────────────────────────────────────────────────────────
def process_crime():
    rows = read_csv("crime.csv")
    years = sorted(set(int(r["year"]) for r in rows))
    categories = sorted(set(r["category"] for r in rows))
    provinces = sorted(set(r["province"] for r in rows))

    # National trend per category
    category_trends = {}
    for cat in categories:
        cat_rows = [r for r in rows if r["category"] == cat]
        by_year = {}
        for r in cat_rows:
            y = int(r["year"])
            by_year[y] = by_year.get(y, 0) + int(r["incidents"])
        category_trends[cat] = [{"year": y, "incidents": by_year[y]} for y in sorted(by_year)]

    # By province latest year
    latest_year = max(years)
    latest = [r for r in rows if int(r["year"]) == latest_year]
    province_summary = {}
    for province in provinces:
        prov = [r for r in latest if r["province"] == province]
        province_summary[province] = {
            "total": sum(int(r["incidents"]) for r in prov),
            "by_category": {r["category"]: int(r["incidents"]) for r in prov}
        }

    # Rate per 100k trend (murder as key indicator)
    murder_trend = []
    for year in years:
        yr_murder = [r for r in rows if r["category"] == "Murder" and int(r["year"]) == year]
        total = sum(int(r["incidents"]) for r in yr_murder)
        avg_rate = round(sum(float(r["rate_per_100k"]) for r in yr_murder) / len(yr_murder), 1)
        murder_trend.append({"year": year, "incidents": total, "avg_rate_per_100k": avg_rate})

    return {
        "category_trends": category_trends,
        "province_summary": province_summary,
        "murder_trend": murder_trend,
        "categories": categories,
        "provinces": provinces,
        "years": years,
        "summary": {
            "latest_year": latest_year,
            "highest_crime_province": max(province_summary, key=lambda p: province_summary[p]["total"]),
            "lowest_crime_province": min(province_summary, key=lambda p: province_summary[p]["total"])
        }
    }

# ── BUILD OUTPUT ──────────────────────────────────────────────────
def main():
    print("Processing unemployment data...")
    unemployment = process_unemployment()
    print("Processing load shedding data...")
    loadshedding = process_loadshedding()
    print("Processing crime data...")
    crime = process_crime()

    output = {
        "meta": {
            "sources": {
                "unemployment": "Statistics South Africa (Stats SA) - Quarterly Labour Force Survey",
                "loadshedding": "Eskom / EskomSePush load shedding records",
                "crime": "South African Police Service (SAPS) Annual Crime Statistics"
            },
            "note": "Data is representative of published trends. Verify exact figures at statssa.gov.za, eskom.co.za, and saps.gov.za",
            "years_covered": "2019-2024",
            "processed": "2026"
        },
        "unemployment": unemployment,
        "loadshedding": loadshedding,
        "crime": crime
    }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print(f"Done. Output written to {OUT}")
    print(f"  Unemployment: {len(unemployment['national_trend'])} years, {len(unemployment['provinces'])} provinces")
    print(f"  Load shedding: {len(loadshedding['annual'])} years, {len(loadshedding['monthly'])} monthly records")
    print(f"  Crime: {len(crime['categories'])} categories, {len(crime['provinces'])} provinces, {len(crime['years'])} years")

if __name__ == "__main__":
    main()
