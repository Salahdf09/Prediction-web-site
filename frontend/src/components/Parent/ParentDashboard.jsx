import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getParentProfile,
  getParentChildren,
  getParentChildProgress,
  getParentChildPrediction,
  getParentChildOrientation,
} from "../../api/api";
import ParentSidebar from "./ParentSidebar";
import SwitchChildModal from "./SwitchChildModal";
import "./ParentDashboard.css";

// ─── SVG Charts ───────────────────────────────────────────────────────────────

function LineChart({ data, large = false }) {
  const W = 500;
  const H = large ? 220 : 100;
  const pad = large
    ? { top: 20, right: 24, bottom: 48, left: 48 }
    : { top: 16, right: 16, bottom: 28, left: 32 };
  const vals = data.map((d) => d.grade);
  const min = Math.floor(Math.min(...vals)) - 1;
  const max = Math.ceil(Math.max(...vals)) + 1;
  const xStep = (W - pad.left - pad.right) / (data.length - 1);
  const toX = (i) => pad.left + i * xStep;
  const toY = (v) =>
    pad.top + (H - pad.top - pad.bottom) * (1 - (v - min) / (max - min));
  const pts = data.map((d, i) => `${toX(i)},${toY(d.grade)}`).join(" ");
  const area = [
    `${toX(0)},${H - pad.bottom}`,
    ...data.map((d, i) => `${toX(i)},${toY(d.grade)}`),
    `${toX(data.length - 1)},${H - pad.bottom}`,
  ].join(" ");
  const yTicks = [
    Math.floor(min + 1),
    Math.floor((min + max) / 2),
    Math.floor(max - 1),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const dotR = large ? 9 : 5;
  const fontSize = large ? 13 : 6.5;
  const tickFontSize = large ? 13 : 8;

  return (
    <div style={{ width: "100%", overflow: "visible" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`pdAreaGrad${large ? "L" : "S"}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a6a92" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#3a6a92" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={pad.left} y1={toY(v)} x2={W - pad.right} y2={toY(v)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={pad.left - 6} y={toY(v)} textAnchor="end" dominantBaseline="middle" fontSize={tickFontSize} fill="#8899aa" fontWeight="700">{v}</text>
          </g>
        ))}
        <polygon points={area} fill={`url(#pdAreaGrad${large ? "L" : "S"})`} />
        <polyline points={pts} fill="none" stroke="#3a6a92" strokeWidth={large ? 3 : 2.5} strokeLinejoin="round" />
        {data.map((d, i) => (
          <circle key={i} cx={toX(i)} cy={toY(d.grade)} r={dotR} fill={i === data.length - 1 ? "#f5c800" : "#3a6a92"} stroke="#fff" strokeWidth={large ? 3 : 2} />
        ))}
        {data.map((d, i) => (
          <text key={i} x={toX(i)} y={H - (large ? 10 : 6)} textAnchor="middle" fontSize={fontSize} fill="#8899aa" fontWeight="700">
            {d.label.toUpperCase()}
          </text>
        ))}
      </svg>
    </div>
  );
}

function ThreeSegmentDonut({ passVal, riskVal, failVal }) {
  const total = passVal + riskVal + failVal || 1;
  const passPct = Math.round((passVal / total) * 100);
  const riskPct = Math.round((riskVal / total) * 100);
  const failPct = 100 - passPct - riskPct;

  const segments = [
    { label: "Pass", percentage: passPct, color: "#4DBDB5" },
    { label: "Risk", percentage: riskPct, color: "#F5C842" },
    { label: "Fail", percentage: failPct, color: "#F28B8B" },
  ];

  function getConicGradient(segs) {
    let result = "";
    let cum = 0;
    segs.forEach(({ color, percentage }, i) => {
      result += `${color} ${cum}% ${cum + percentage}%`;
      cum += percentage;
      if (i < segs.length - 1) result += ", ";
    });
    return `conic-gradient(${result})`;
  }

  function getLabelPosition(startPct, endPct, radius = 36) {
    const midPct = (startPct + endPct) / 2;
    const angle = (midPct / 100) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    return { left: `${50 + radius * Math.cos(rad)}%`, top: `${50 + radius * Math.sin(rad)}%` };
  }

  let cumulative = 0;

  return (
    <div className="pd-donut-widget">
      <div className="pd-donut-wrapper">
        <div className="pd-donut-circle" style={{ background: getConicGradient(segments) }}>
          <div className="pd-donut-hole" />
        </div>
        {segments.map(({ label, percentage }) => {
          const pos = getLabelPosition(cumulative, cumulative + percentage);
          cumulative += percentage;
          return (
            <span key={label} className="pd-donut-label" style={pos}>
              {percentage}%
            </span>
          );
        })}
      </div>
      <div className="pd-donut-legend">
        {segments.map(({ label, color }) => (
          <div className="pd-legend-entry" key={label}>
            <span className="pd-legend-entry-dot" style={{ backgroundColor: color }} />
            <span className="pd-legend-entry-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BacProgress({ student }) {
  return (
    <div className="pd-bac-section">
      <div className="pd-bac-row">
        <span className="pd-bac-label">Predicted BAC</span>
        <div className="pd-progress-bar">
          <div className="pd-progress-fill--split" style={{ width: `${(student.predictedBAC / 20) * 100}%` }} />
        </div>
        <span className="pd-bac-val">{student.predictedBAC}</span>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

function DashboardPage({ student }) {
  const risk = computeRiskLevel(student.attendanceRate);

  return (
    <div className="pd-dash-layout">
      <div className="pd-dash-left">
        <div className="pd-trimester-cards">
          {student.trimesters.map((t, i) => (
            <div key={i} className="pd-tri-card">
              <p className="pd-tri-card-label">{t.label}</p>
              <p className="pd-tri-card-grade">{t.grade}</p>
            </div>
          ))}
        </div>

        <div className="pd-stats-row">
          <div className="pd-card pd-stat-card">
            <p className="pd-stat-label">Current Average</p>
            <p className="pd-stat-value pd-gold">{student.currentAverage}</p>
            <p className="pd-stat-sub">Last update · {student.lastUpdate}</p>
          </div>
          <div className="pd-card pd-stat-card">
            <p className="pd-stat-label">Attendance Rate</p>
            <p className="pd-stat-value">{student.attendanceRate}%</p>
            <div style={{ marginTop: 4 }}>
              <span className={`pd-badge pd-badge--${risk.toLowerCase()}`}>
                Risk Level : {risk}
              </span>
            </div>
          </div>
        </div>

        <div className="pd-card">
          <BacProgress student={student} />
        </div>

        <div className="pd-bottom-charts">
          <div className="pd-card pd-chart-card">
            <h3 className="pd-card-title">Academic Progress</h3>
            <LineChart data={student.trimesters} large />
          </div>
          <div className="pd-card pd-donut-card">
            <ThreeSegmentDonut
              passVal={student.attendance?.pass ?? 873}
              riskVal={student.attendance?.risk ?? 295}
              failVal={student.attendance?.fall ?? 119}
            />
          </div>
        </div>
      </div>

      <div className="pd-dash-right">
        <div className="pd-card">
          <h3 className="pd-card-title">Risk Alerts</h3>
          <div className="pd-card-divider" />
          {student.riskAlerts && student.riskAlerts.length > 0 ? (
            student.riskAlerts.map((alert, i) => (
              <p key={i} className="pd-alert-text">
                <strong>Trimester {alert.trimester}</strong> {alert.change}
              </p>
            ))
          ) : (
            <p className="pd-alert-text">No risk alerts — keep it up!</p>
          )}
          <button className="pd-btn-yellow">View All</button>
        </div>

        <div className="pd-card">
          <div className="pd-orient-header">
            <span className="pd-bulb">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5c800" strokeWidth="2" strokeLinecap="round">
                <line x1="9" y1="18" x2="15" y2="18" />
                <line x1="10" y1="22" x2="14" y2="22" />
                <path d="M12 2a7 7 0 0 1 7 7c0 3.1-2 5.6-4.5 6.6V17H9.5v-1.4C7 14.6 5 12.1 5 9a7 7 0 0 1 7-7z" />
              </svg>
            </span>
            <h3 className="pd-card-title">Suggested Orientation</h3>
          </div>
          <p className="pd-orient-name">{student.orientation?.recommended?.name ?? "Science Stream"}</p>
          <p className="pd-orient-compat">{student.orientation?.recommended?.compatibility ?? 82}% compatibility</p>
          <p className="pd-orient-desc">{student.orientation?.recommended?.description ?? "Option based on strong math and physics performance"}</p>
          <button className="pd-btn-yellow">View Details</button>
        </div>
      </div>
    </div>
  );
}

// ─── Simulation Page ──────────────────────────────────────────────────────────

function SimulationPage() {
  const [inputs, setInputs] = useState({ t1: "", t2: "", t3: "" });
  const [result, setResult] = useState(null);

  const handleChange = (key) => (e) => {
    const raw = e.target.value;
    if (raw === "" || /^\d{0,2}(\.\d{0,2})?$/.test(raw)) {
      setInputs((prev) => ({ ...prev, [key]: raw }));
      setResult(null);
    }
  };

  const handleCalculate = () => {
    const t1 = parseFloat(inputs.t1);
    const t2 = parseFloat(inputs.t2);
    const t3 = parseFloat(inputs.t3);
    if (isNaN(t1) || isNaN(t2) || isNaN(t3)) return;
    const clamped = [t1, t2, t3].map((v) => Math.min(20, Math.max(0, v)));
    const avg = (clamped[0] + clamped[1] + clamped[2]) / 3;
    setResult(Math.round(avg * 100) / 100);
  };

  const status = computeStatusLabel(result);

  return (
    <div className="pd-sim-layout">
      <div className="pd-card pd-sim-card">
        <h3 className="pd-sim-title">Average Calculator</h3>
        <p className="pd-section-sub">Calculate your child's year average.</p>

        <div className="pd-sim-inputs">
          {[
            { key: "t1", label: "Trimester 1" },
            { key: "t2", label: "Trimester 2" },
            { key: "t3", label: "Trimester 3" },
          ].map(({ key, label }) => (
            <div key={key} className="pd-sim-field">
              <label className="pd-sim-label">{label}</label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.01"
                placeholder="00.00"
                value={inputs[key]}
                onChange={handleChange(key)}
                className="pd-sim-input"
              />
            </div>
          ))}
        </div>

        <button className="pd-btn-yellow pd-sim-btn" onClick={handleCalculate}>
          Predict the average
        </button>

        <div className="pd-sim-result">
          <div className="pd-sim-result-left">
            <p className="pd-stat-label">Child's Average</p>
            {status && (
              <span className="pd-sim-status" style={{ background: status.bg, color: status.color }}>
                {status.label}
              </span>
            )}
          </div>
          <span className="pd-sim-avg pd-gold">
            {result !== null ? result.toFixed(2) : "00.00"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Prediction Page ──────────────────────────────────────────────────────────

function PredictionPage({ student }) {
  const recommended = student.orientation?.recommended ?? { name: "Science", compatibility: 82 };
  const alternatives = student.orientation?.alternatives ?? [
    { name: "Technical Math", compatibility: 74 },
    { name: "Literature", compatibility: 61 },
  ];
  const status = computeStatusLabel(student.currentAverage);

  return (
    <div className="pd-pred-layout">
      <div className="pd-card pd-orient-card">
        <div className="pd-orient-card-header">
          <h3 className="pd-orient-card-title">Orientation Recommendation</h3>
          <p className="pd-orient-card-sub">Helping you choose the best academic path</p>
        </div>

        <div className="pd-orient-avg-row">
          <span className="pd-orient-avg-label">Child's Average</span>
          {status && (
            <span className="pd-sim-status" style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
          )}
          <span className="pd-big-gold">
            {typeof student.currentAverage === "number" ? student.currentAverage.toFixed(2) : "00.00"}%
          </span>
        </div>

        <div className="pd-orient-recommended">
          <p className="pd-orient-rec-label">
            Recommended Stream : <span className="pd-orient-rec-name">{recommended.name.replace(" Stream", "")}</span>
          </p>
          <p className="pd-orient-rec-compat">Compatibility : {recommended.compatibility}%</p>
        </div>

        <p className="pd-orient-other-title">Other suitable streams</p>

        {alternatives.map((alt, i) => (
          <div key={i} className="pd-orient-alt">
            <div className="pd-orient-alt-header">
              <span className="pd-orient-alt-name">{alt.name}</span>
              <span className="pd-gold pd-orient-alt-pct">{alt.compatibility}%</span>
            </div>
            <div className="pd-progress-bar pd-orient-bar">
              <div className="pd-progress-fill pd-progress-fill--yellow" style={{ width: `${alt.compatibility}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const NAV_ITEMS = ["Dashboard", "Simulation", "Prediction", "Profile"];

const EMPTY_STUDENT = {
  id: null,
  firstName: "Child",
  lastName: "",
  email: "",
  trimesters: [
    { label: "Trimester 1", grade: 0 },
    { label: "Trimester 2", grade: 0 },
    { label: "Trimester 3", grade: 0 },
  ],
  currentAverage: 0,
  lastUpdate: "No data yet",
  attendanceRate: 0,
  predictedBAC: 0,
  attendance: { pass: 0, risk: 0, fall: 0 },
  riskAlerts: [],
  orientation: {
    recommended: {
      name: "No orientation yet",
      compatibility: 0,
      description: "Prediction and orientation will appear when grades are available.",
    },
    alternatives: [],
  },
};

function computeRiskLevel(value) {
  if (value >= 70) return "Low";
  if (value >= 40) return "Medium";
  return "High";
}

function computeStatusLabel(value) {
  if (value === null || value === undefined) return null;
  if (value >= 10) return { label: "Likely pass", bg: "#dff5ef", color: "#21735d" };
  return { label: "At risk", bg: "#fde8e8", color: "#9b2c2c" };
}

function splitName(name = "", email = "") {
  const cleaned = name || email.split("@")[0] || "Child";
  const parts = cleaned.trim().split(/\s+/);
  return {
    firstName: parts[0] || "Child",
    lastName: parts.slice(1).join(" "),
  };
}

function latestGrade(progress) {
  const records = progress?.grade_records;
  if (!records) return null;
  if (Array.isArray(records)) return records[records.length - 1] || null;
  const values = Object.values(records);
  return values[values.length - 1] || null;
}

function normalizeOrientation(orientation, prediction) {
  const names = prediction?.orientations || [];
  const recommendedName = orientation?.recommended_stream || names[0] || "No orientation yet";
  return {
    recommended: {
      name: recommendedName,
      compatibility: prediction?.pass_probability ? Math.round(prediction.pass_probability * 100) : 0,
      description: orientation?.explanation || "Prediction and orientation will appear when grades are available.",
    },
    alternatives: names.slice(1).map((name, index) => ({
      name,
      compatibility: Math.max(45, 75 - index * 8),
    })),
  };
}

function buildStudent(profile, progress, prediction, orientation) {
  const nameParts = splitName(profile?.name, profile?.email);
  const grade = latestGrade(progress);
  const trimesters = [
    { label: "Trimester 1", grade: Number(grade?.trimester1 ?? 0) },
    { label: "Trimester 2", grade: Number(grade?.trimester2 ?? 0) },
    { label: "Trimester 3", grade: Number(grade?.trimester3 ?? 0) },
  ];
  const currentAverage = Number(
    grade?.final_grade ??
      (trimesters.reduce((sum, item) => sum + item.grade, 0) / Math.max(trimesters.length, 1)),
  );
  const passPct = Math.round((prediction?.pass_probability ?? 0) * 100);
  const riskPct = Math.max(0, 100 - passPct);

  return {
    ...EMPTY_STUDENT,
    id: profile?.student_id ?? profile?.user_id ?? null,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    email: profile?.email || "",
    trimesters,
    currentAverage: Math.round(currentAverage * 100) / 100,
    predictedBAC: Number(prediction?.predicted_grade ?? grade?.final_grade ?? currentAverage ?? 0),
    attendanceRate: passPct,
    attendance: { pass: passPct, risk: riskPct, fall: 0 },
    riskAlerts: prediction?.risk_level
      ? [{ trimester: "latest", change: `Risk level is ${prediction.risk_level}.` }]
      : [],
    orientation: normalizeOrientation(orientation, prediction),
  };
}

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]           = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [switchOpen, setSwitchOpen]         = useState(false);
  const [linkedChildren, setLinkedChildren] = useState([EMPTY_STUDENT]);
  const [selectedId, setSelectedId]         = useState(EMPTY_STUDENT.id);
  const [parentProfile, setParentProfile]   = useState(null);

  const student = linkedChildren.find((s) => s.id === selectedId) ?? linkedChildren[0];

  // ── Parent's own avatar from localStorage ──
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("parentAvatar") || null;
  });

  useEffect(() => {
    const loadParentData = async () => {
      try {
        const parent = await getParentProfile();
        setParentProfile(parent);
        const childrenResponse = await getParentChildren(parent.parent_id || parent.user_id);
        const childProfiles = childrenResponse.children || [];
        const hydrated = await Promise.all(
          childProfiles.map(async (child) => {
            const studentId = child.student_id || child.user_id;
            const [progress, prediction, orientation] = await Promise.allSettled([
              getParentChildProgress(parent.parent_id || parent.user_id, studentId),
              getParentChildPrediction(parent.parent_id || parent.user_id, studentId),
              getParentChildOrientation(parent.parent_id || parent.user_id, studentId),
            ]);
            return buildStudent(
              child,
              progress.status === "fulfilled" ? progress.value : null,
              prediction.status === "fulfilled" ? prediction.value : null,
              orientation.status === "fulfilled" ? orientation.value : null,
            );
          }),
        );
        const nextChildren = hydrated.length ? hydrated : [EMPTY_STUDENT];
        setLinkedChildren(nextChildren);
        setSelectedId(nextChildren[0].id);
      } catch {
        setLinkedChildren([EMPTY_STUDENT]);
        setSelectedId(EMPTY_STUDENT.id);
      }
    };
    loadParentData();

    const syncAvatar = () => {
      setAvatar(localStorage.getItem("parentAvatar") || null);
    };
    window.addEventListener("storage", syncAvatar);
    window.addEventListener("focus", syncAvatar);
    return () => {
      window.removeEventListener("storage", syncAvatar);
      window.removeEventListener("focus", syncAvatar);
    };
  }, []);

  const parentName = parentProfile?.name || parentProfile?.email?.split("@")[0] || "Parent";

  const parentInitials = parentName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleAddChild = ({ fullName, studentId, email }) => {
    const found = linkedChildren.find((s) => String(s.id) === studentId.trim());
    if (!found) return "not_found";
    const nameMatch = `${found.firstName} ${found.lastName}`.trim().toLowerCase() === fullName.trim().toLowerCase();
    const emailMatch = !email || found.email.toLowerCase() === email.trim().toLowerCase();
    return nameMatch && emailMatch ? "already_added" : "mismatch";
  };

  const handleNavClick = (item) => {
    setSidebarOpen(false);
    if (item === "Profile") {
      navigate("/parent/settings");
      return;
    }
    setActiveNav(item);
  };

  const renderPage = () => {
    switch (activeNav) {
      case "Simulation": return <SimulationPage />;
      case "Prediction": return <PredictionPage student={student} />;
      default:           return <DashboardPage student={student} />;
    }
  };

  return (
    <div className="pd-root">
      {switchOpen && (
        <SwitchChildModal
          linkedChildren={linkedChildren}
          currentId={selectedId}
          onSelect={setSelectedId}
          onAddChild={handleAddChild}
          onClose={() => setSwitchOpen(false)}
        />
      )}

      <ParentSidebar
        activePage={activeNav}
        onNavClick={handleNavClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSwitchChild={() => setSwitchOpen(true)}
      />

      {sidebarOpen && <div className="pd-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="pd-main">
        <header className="pd-topbar-wrapper">
          <div className="pd-topbar-inner">
            <button className="pd-hamburger" onClick={() => setSidebarOpen((o) => !o)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="pd-topbar">
              <h2 className="pd-welcome">
                Viewing: <span>"{student.firstName} {student.lastName}"</span>.
              </h2>
            </div>
            <div className="pd-avatar-circle">
              {avatar ? (
                <img src={avatar} alt="profile" />
              ) : (
                <div className="pd-avatar-initials" style={{ background: "#3a6a92" }}>
                  <span>{parentInitials}</span>
                </div>
              )}
            </div>
          </div>
          <div className="pd-topbar-line" />
        </header>

        <div className="pd-content">{renderPage()}</div>
      </main>

      <nav className="pd-bottom-nav">
        {NAV_ITEMS.map((item) => {
          const emojis = { Dashboard: "📊", Simulation: "⏱️", Prediction: "🎯", Profile: "👤" };
          return (
            <button
              key={item}
              className={`pd-bottom-nav-item ${activeNav === item ? "active" : ""}`}
              onClick={() => handleNavClick(item)}
            >
              <span className="pd-bottom-nav-icon">{emojis[item]}</span>
              <span>{item}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
