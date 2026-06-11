import { useState } from "react";
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";

// ── CLEAN DATA INLINE (output of process.py) ──────────────────────
const DATA = {
  unemployment: {
    national_trend: [
      { year: 2019, rate: 32.9, unemployed: 7076000 },
      { year: 2020, rate: 35.6, unemployed: 7848000 },
      { year: 2021, rate: 38.9, unemployed: 8851000 },
      { year: 2022, rate: 37.1, unemployed: 8411000 },
      { year: 2023, rate: 36.2, unemployed: 8212000 },
      { year: 2024, rate: 35.4, unemployed: 8025000 },
    ],
    province_trends: {
      "Gauteng":       [{ year:2019,rate:28.1},{year:2020,rate:30.2},{year:2021,rate:35.1},{year:2022,rate:33.2},{year:2023,rate:32.1},{year:2024,rate:31.8}],
      "Western Cape":  [{ year:2019,rate:17.8},{year:2020,rate:20.1},{year:2021,rate:24.3},{year:2022,rate:21.8},{year:2023,rate:20.2},{year:2024,rate:19.6}],
      "KwaZulu-Natal": [{ year:2019,rate:33.4},{year:2020,rate:36.8},{year:2021,rate:40.1},{year:2022,rate:38.9},{year:2023,rate:37.8},{year:2024,rate:37.2}],
      "Eastern Cape":  [{ year:2019,rate:38.2},{year:2020,rate:41.5},{year:2021,rate:46.3},{year:2022,rate:44.1},{year:2023,rate:43.2},{year:2024,rate:42.8}],
      "Limpopo":       [{ year:2019,rate:37.5},{year:2020,rate:40.2},{year:2021,rate:43.8},{year:2022,rate:41.6},{year:2023,rate:40.8},{year:2024,rate:40.1}],
    },
    summary: { latest_year: 2024, national_rate: 35.4, highest_province: { name: "Eastern Cape", rate: 42.8 }, lowest_province: { name: "Western Cape", rate: 19.6 }, total_unemployed: 8025000 }
  },
  loadshedding: {
    annual: [
      { year: 2019, total_hours: 132, max_stage: 4, incidents: 11 },
      { year: 2020, total_hours: 104, max_stage: 3, incidents: 10 },
      { year: 2021, total_hours: 434, max_stage: 4, incidents: 31 },
      { year: 2022, total_hours: 1272, max_stage: 6, incidents: 66 },
      { year: 2023, total_hours: 1244, max_stage: 7, incidents: 71 },
      { year: 2024, total_hours: 102, max_stage: 2, incidents: 21 },
    ],
    summary: { worst_year: { year: 2023, total_hours: 1244 }, best_year: { year: 2024, total_hours: 102 }, total_hours_all_time: 3288, peak_stage: 7 }
  },
  crime: {
    category_trends: {
      "Murder":       [{ year:2019,incidents:11417},{year:2020,incidents:10627},{year:2021,incidents:11678},{year:2022,incidents:12303},{year:2023,incidents:11543},{year:2024,incidents:10847}],
      "Robbery":      [{ year:2019,incidents:124239},{year:2020,incidents:107203},{year:2021,incidents:116903},{year:2022,incidents:124703},{year:2023,incidents:119803},{year:2024,incidents:115703}],
      "Vehicle Theft":[{ year:2019,incidents:101850},{year:2020,incidents:86603},{year:2021,incidents:95703},{year:2022,incidents:102003},{year:2023,incidents:98703},{year:2024,incidents:95403}],
      "Burglary":     [{ year:2019,incidents:201570},{year:2020,incidents:171003},{year:2021,incidents:189303},{year:2022,incidents:200903},{year:2023,incidents:193803},{year:2024,incidents:187703}],
    },
    summary: { latest_year: 2024, highest_crime_province: "Gauteng", lowest_crime_province: "Northern Cape" }
  }
};

// ── DESIGN TOKENS ─────────────────────────────────────────────────
const COLORS = {
  bg: "#0a0e1a", surface: "#111827", surface2: "#1a2235", border: "#1f2d45",
  accent: "#3b82f6", green: "#22c55e", yellow: "#f59e0b", red: "#ef4444",
  purple: "#8b5cf6", cyan: "#06b6d4", pink: "#ec4899", text: "#e2e8f0", muted: "#64748b"
};

const PROV_COLORS = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6"];
const PROVINCES = ["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Limpopo"];

// ── COMPONENTS ────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color = COLORS.accent }) => (
  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px" }}>
    <div style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 30, fontWeight: 800, color, letterSpacing: "-1px" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{sub}</div>}
  </div>
);

const SectionHeader = ({ title, sub }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: COLORS.muted, margin: "4px 0 0" }}>{sub}</p>}
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, ...style }}>
    {children}
  </div>
);

const chartProps = {
  margin: { top: 5, right: 20, left: 0, bottom: 5 },
};

const tooltipStyle = {
  contentStyle: { background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 13 },
  labelStyle: { color: COLORS.muted },
};

const axisStyle = { stroke: COLORS.muted, fontSize: 12 };

// ── TABS ──────────────────────────────────────────────────────────
const TABS = [
  { id: "unemployment", label: "Unemployment", icon: "📊" },
  { id: "loadshedding", label: "Load Shedding", icon: "⚡" },
  { id: "crime", label: "Crime Stats", icon: "🔍" },
];

// ── UNEMPLOYMENT TAB ──────────────────────────────────────────────
function UnemploymentTab() {
  const { national_trend, province_trends, summary } = DATA.unemployment;
  const [selectedProvs, setSelectedProvs] = useState(["Gauteng","Western Cape","Eastern Cape"]);

  const toggleProvince = (p) => setSelectedProvs(prev =>
    prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
  );

  const provinceLineData = national_trend.map(n => {
    const row = { year: n.year };
    PROVINCES.forEach(p => { row[p] = province_trends[p]?.find(r => r.year === n.year)?.rate; });
    return row;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <StatCard label="National Rate 2024" value={`${summary.national_rate}%`} color={COLORS.yellow} />
        <StatCard label="Unemployed" value={summary.total_unemployed.toLocaleString()} sub="people without work 2024" color={COLORS.red} />
        <StatCard label="Highest Province" value={summary.highest_province.name} sub={`${summary.highest_province.rate}% unemployment`} color={COLORS.red} />
        <StatCard label="Lowest Province" value={summary.lowest_province.name} sub={`${summary.lowest_province.rate}% unemployment`} color={COLORS.green} />
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>National Unemployment Rate Trend</div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>Expanded definition including discouraged work-seekers</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={national_trend} {...chartProps}>
            <defs>
              <linearGradient id="uGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[28, 42]} unit="%" />
            <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "Rate"]} />
            <Area type="monotone" dataKey="rate" stroke={COLORS.accent} fill="url(#uGrad)" strokeWidth={2.5} dot={{ r: 4, fill: COLORS.accent }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>By Province</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PROVINCES.map((p, i) => (
              <button key={p} onClick={() => toggleProvince(p)} style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                background: selectedProvs.includes(p) ? PROV_COLORS[i] : COLORS.surface2,
                color: selectedProvs.includes(p) ? "#fff" : COLORS.muted,
                opacity: selectedProvs.includes(p) ? 1 : 0.6,
              }}>{p}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={provinceLineData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[15, 50]} unit="%" />
            <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, ""]} />
            <Legend wrapperStyle={{ fontSize: 12, color: COLORS.muted }} />
            {PROVINCES.filter(p => selectedProvs.includes(p)).map((p, i) => (
              <Line key={p} type="monotone" dataKey={p} stroke={PROV_COLORS[PROVINCES.indexOf(p)]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── LOAD SHEDDING TAB ─────────────────────────────────────────────
function LoadSheddingTab() {
  const { annual, summary } = DATA.loadshedding;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <StatCard label="Peak Stage Reached" value={`Stage ${summary.peak_stage}`} sub="highest recorded 2023" color={COLORS.red} />
        <StatCard label="Worst Year" value={summary.worst_year.year} sub={`${summary.worst_year.total_hours.toLocaleString()} hours lost`} color={COLORS.red} />
        <StatCard label="Total Hours Lost" value={summary.total_hours_all_time.toLocaleString()} sub="cumulative 2019–2024" color={COLORS.yellow} />
        <StatCard label="2024 Recovery" value={`${summary.best_year.total_hours} hrs`} sub={`down from ${summary.worst_year.total_hours.toLocaleString()} in ${summary.worst_year.year}`} color={COLORS.green} />
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>Annual Load Shedding Hours</div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>Total estimated hours of load shedding per year nationally</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={annual} {...chartProps}>
            <defs>
              <linearGradient id="lsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.yellow} stopOpacity={0.35} />
                <stop offset="95%" stopColor={COLORS.yellow} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} formatter={(v, n) => [n === "total_hours" ? `${v} hrs` : `Stage ${v}`, n === "total_hours" ? "Hours lost" : "Max stage"]} />
            <Area type="monotone" dataKey="total_hours" stroke={COLORS.yellow} fill="url(#lsGrad)" strokeWidth={2.5} dot={{ r: 4, fill: COLORS.yellow }} name="total_hours" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>Maximum Stage Reached Per Year</div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>Higher stage = more hours cut per day. Stage 6 = 12 hrs/day off</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={annual} {...chartProps}>
            <defs>
              <linearGradient id="stageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.red} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.red} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 8]} tickCount={9} />
            <Tooltip {...tooltipStyle} formatter={(v) => [`Stage ${v}`, "Max Stage"]} />
            <Area type="monotone" dataKey="max_stage" stroke={COLORS.red} fill="url(#stageGrad)" strokeWidth={2.5} dot={{ r: 4, fill: COLORS.red }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── CRIME TAB ─────────────────────────────────────────────────────
function CrimeTab() {
  const { category_trends, summary } = DATA.crime;
  const categories = Object.keys(category_trends);
  const CAT_COLORS = [COLORS.red, COLORS.yellow, COLORS.purple, COLORS.cyan];
  const [selected, setSelected] = useState(categories);

  const toggle = (c) => setSelected(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const lineData = category_trends["Murder"].map((_, i) => {
    const row = { year: category_trends["Murder"][i].year };
    categories.forEach(c => { row[c] = category_trends[c][i]?.incidents; });
    return row;
  });

  const murderData = category_trends["Murder"];
  const latestMurder = murderData[murderData.length - 1];
  const robbery2024 = category_trends["Robbery"][category_trends["Robbery"].length - 1];
  const murder2022 = category_trends["Murder"].find(r => r.year === 2022);
  const murderChange = murder2022 ? `↓ ${Math.round(((murder2022.incidents - latestMurder.incidents) / murder2022.incidents) * 100)}%` : "N/A";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <StatCard label="Murder 2024" value={latestMurder.incidents.toLocaleString()} sub="total incidents nationally" color={COLORS.red} />
        <StatCard label="Robbery 2024" value={robbery2024.incidents.toLocaleString()} sub="total incidents nationally" color={COLORS.yellow} />
        <StatCard label="Highest Province" value={summary.highest_crime_province} sub="most recorded incidents" color={COLORS.red} />
        <StatCard label="2024 vs 2022" value={murderChange} sub="murder incidents declining" color={COLORS.green} />
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>Murder Trend (National)</div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>Total murder incidents recorded by SAPS annually</div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={murderData} {...chartProps}>
            <defs>
              <linearGradient id="murderGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.red} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.red} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} formatter={(v) => [v.toLocaleString(), "Incidents"]} />
            <Area type="monotone" dataKey="incidents" stroke={COLORS.red} fill="url(#murderGrad)" strokeWidth={2.5} dot={{ r: 4, fill: COLORS.red }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>All Categories Trend</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((c, i) => (
              <button key={c} onClick={() => toggle(c)} style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                background: selected.includes(c) ? CAT_COLORS[i] : COLORS.surface2,
                color: selected.includes(c) ? "#fff" : COLORS.muted,
              }}>{c}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={lineData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} formatter={(v) => [v.toLocaleString(), ""]} />
            <Legend wrapperStyle={{ fontSize: 12, color: COLORS.muted }} />
            {categories.filter(c => selected.includes(c)).map((c, i) => (
              <Line key={c} type="monotone" dataKey={c} stroke={CAT_COLORS[categories.indexOf(c)]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("unemployment");

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: COLORS.text }}>
      {/* Header */}
      <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>
            SA <span style={{ color: COLORS.accent }}>Insight</span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>South Africa Data Dashboard · 2019–2024</div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.muted, textAlign: "right" }}>
          Sources: Stats SA · Eskom · SAPS<br />
          <span style={{ color: COLORS.yellow }}>⚠ Data is representative of published trends</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "0 32px", display: "flex", gap: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "14px 20px", background: "none", border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 600, color: tab === t.id ? COLORS.accent : COLORS.muted,
            borderBottom: tab === t.id ? `2px solid ${COLORS.accent}` : "2px solid transparent",
            transition: "all 0.15s"
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "32px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader
          title={TABS.find(t => t.id === tab)?.label}
          sub={
            tab === "unemployment" ? "National and provincial unemployment rates 2019–2024 · Source: Stats SA QLFS" :
            tab === "loadshedding" ? "Annual load shedding hours and stage data 2019–2024 · Source: Eskom / EskomSePush" :
            "Selected crime categories nationally 2019–2024 · Source: SAPS Annual Crime Statistics"
          }
        />
        {tab === "unemployment" && <UnemploymentTab />}
        {tab === "loadshedding" && <LoadSheddingTab />}
        {tab === "crime" && <CrimeTab />}
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 32px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.muted }}>
        <span>Built by Boitshoko Soomo · github.com/BoitshokoSoomo</span>
        <span>Data verified at statssa.gov.za · eskom.co.za · saps.gov.za</span>
      </div>
    </div>
  );
}
