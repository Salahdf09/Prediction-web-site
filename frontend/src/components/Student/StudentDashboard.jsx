import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getStudentProfile,
  getStudentProgress,
  getStudentPrediction,
  getStudentOrientation,
} from "../../api/api";
import StudentSidebar from "./Sidebar/Sidebar";
import "./StudentDashboard.css";

import dashboardWhite  from '../../../Assets2/icone1-school-white.png';
import dashboardBlue   from '../../../Assets2/icone1-school-blue.png';
import simulationWhite from '../../../Assets2/signes-vitaux (1).png';
import simulationBlue  from '../../../Assets2/signes-vitaux.png';
import predictionWhite from '../../../Assets2/prediction (1).png';
import predictionBlue  from '../../../Assets2/prediction.png';
import profileWhite    from '../../../Assets2/profile_white.png';
import profileBlue     from '../../../Assets2/profile_blue.png';

const BOTTOM_NAV = [
  { key: 'Dashboard',  label: 'Dashboard',  iconWhite: dashboardWhite,  iconBlue: dashboardBlue  },
  { key: 'Simulation', label: 'Simulation', iconWhite: simulationWhite, iconBlue: simulationBlue },
  { key: 'Prediction', label: 'Prediction', iconWhite: predictionWhite, iconBlue: predictionBlue },
  { key: 'Profile',    label: 'Profile',    iconWhite: profileWhite,    iconBlue: profileBlue    },
];

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
          <linearGradient id={`areaGrad${large ? "L" : "S"}`} x1="0" y1="0" x2="0" y2="1">
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
        <polygon points={area} fill={`url(#areaGrad${large ? "L" : "S"})`} />
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
    <div className="sd-donut-widget">
      <div className="sd-donut-wrapper">
        <div className="sd-donut-circle" style={{ background: getConicGradient(segments) }}>
          <div className="sd-donut-hole" />
        </div>
        {segments.map(({ label, percentage }) => {
          const pos = getLabelPosition(cumulative, cumulative + percentage);
          cumulative += percentage;
          return (
            <span key={label} className="sd-donut-label" style={pos}>
              {percentage}%
            </span>
          );
        })}
      </div>
      <div className="sd-donut-legend">
        {segments.map(({ label, color }) => (
          <div className="sd-legend-entry" key={label}>
            <span className="sd-legend-entry-dot" style={{ backgroundColor: color }} />
            <span className="sd-legend-entry-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BacProgress({ student }) {
  return (
    <div className="sd-bac-section">
      <div className="sd-bac-row">
        <span className="sd-bac-label">Predicted BAC</span>
        <div className="sd-progress-bar">
          <div className="sd-progress-fill--split" style={{ width: `${(student.predictedBAC / 20) * 100}%` }} />
        </div>
        <span className="sd-bac-val">{student.predictedBAC}</span>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

function DashboardPage({ student }) {
  const risk = computeRiskLevel(student.attendanceRate);

  return (
    <div className="sd-dash-layout">
      <div className="sd-dash-left">
        <div className="sd-trimester-cards">
          {student.trimesters.map((t, i) => (
            <div key={i} className="sd-tri-card">
              <p className="sd-tri-card-label">{t.label}</p>
              <p className="sd-tri-card-grade">{t.grade}</p>
            </div>
          ))}
        </div>

        <div className="sd-stats-row">
          <div className="sd-card sd-stat-card">
            <p className="sd-stat-label">Current Average</p>
            <p className="sd-stat-value sd-gold">{student.currentAverage}</p>
            <p className="sd-stat-sub">Last update · {student.lastUpdate}</p>
          </div>
          <div className="sd-card sd-stat-card">
            <p className="sd-stat-label">Attendance Rate</p>
            <p className="sd-stat-value">{student.attendanceRate}%</p>
            <div style={{ marginTop: 4 }}>
              <span className={`sd-badge sd-badge--${risk.toLowerCase()}`}>
                Risk Level : {risk}
              </span>
            </div>
          </div>
        </div>

        <div className="sd-card">
          <BacProgress student={student} />
        </div>

        <div className="sd-bottom-charts">
          <div className="sd-card sd-chart-card">
            <h3 className="sd-card-title">Academic Progress</h3>
            <LineChart data={student.trimesters} large />
          </div>
          <div className="sd-card sd-donut-card">
            <ThreeSegmentDonut
              passVal={student.attendance?.pass ?? 873}
              riskVal={student.attendance?.risk ?? 295}
              failVal={student.attendance?.fall ?? 119}
            />
          </div>
        </div>
      </div>

      <div className="sd-dash-right">
        <div className="sd-card">
          <h3 className="sd-card-title">Risk Alerts</h3>
          <div className="sd-card-divider" />
          {student.riskAlerts && student.riskAlerts.length > 0 ? (
            student.riskAlerts.map((alert, i) => (
              <p key={i} className="sd-alert-text">
                <strong>Trimester {alert.trimester}</strong> {alert.change}
              </p>
            ))
          ) : (
            <p className="sd-alert-text">No risk alerts — keep it up!</p>
          )}
          <button className="sd-btn-yellow">View All</button>
        </div>

        <div className="sd-card">
          <div className="sd-orient-header">
            <span className="sd-bulb">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5c800" strokeWidth="2" strokeLinecap="round">
                <line x1="9" y1="18" x2="15" y2="18" />
                <line x1="10" y1="22" x2="14" y2="22" />
                <path d="M12 2a7 7 0 0 1 7 7c0 3.1-2 5.6-4.5 6.6V17H9.5v-1.4C7 14.6 5 12.1 5 9a7 7 0 0 1 7-7z" />
              </svg>
            </span>
            <h3 className="sd-card-title">Suggested Orientation</h3>
          </div>
          <p className="sd-orient-name">{student.orientation?.recommended?.name ?? "Science Stream"}</p>
          <p className="sd-orient-compat">{student.orientation?.recommended?.compatibility ?? 82}% compatibility</p>
          <p className="sd-orient-desc">{student.orientation?.recommended?.description ?? "Option based on strong math and physics performance"}</p>
          <button className="sd-btn-yellow">View Details</button>
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
    <div className="sd-sim-layout">
      <div className="sd-card sd-sim-card">
        <h3 className="sd-sim-title">Average Calculator</h3>
        <p className="sd-section-sub">Calculate your year average.</p>

        <div className="sd-sim-inputs">
          {[
            { key: "t1", label: "Trimester 1" },
            { key: "t2", label: "Trimester 2" },
            { key: "t3", label: "Trimester 3" },
          ].map(({ key, label }) => (
            <div key={key} className="sd-sim-field">
              <label className="sd-sim-label">{label}</label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.01"
                placeholder="00.00"
                value={inputs[key]}
                onChange={handleChange(key)}
                className="sd-sim-input"
              />
            </div>
          ))}
        </div>

        <button className="sd-btn-yellow sd-sim-btn" onClick={handleCalculate}>
          Predict the average
        </button>

        <div className="sd-sim-result">
          <div className="sd-sim-result-left">
            <p className="sd-stat-label">Your Average</p>
            {status && (
              <span className="sd-sim-status" style={{ background: status.bg, color: status.color }}>
                {status.label}
              </span>
            )}
          </div>
          <span className="sd-sim-avg sd-gold">
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
    <div className="sd-pred-layout">
      <div className="sd-card sd-orient-card">
        <div className="sd-orient-card-header">
          <h3 className="sd-orient-card-title">Orientation Recommendation</h3>
          <p className="sd-orient-card-sub">Helping you choose the best academic path</p>
        </div>

        <div className="sd-orient-avg-row">
          <span className="sd-orient-avg-label">Your Average</span>
          {status && (
            <span className="sd-sim-status" style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
          )}
          <span className="sd-big-gold">
            {typeof student.currentAverage === "number" ? student.currentAverage.toFixed(2) : "00.00"}%
          </span>
        </div>

        <div className="sd-orient-recommended">
          <p className="sd-orient-rec-label">
            Recommended Stream : <span className="sd-orient-rec-name">{recommended.name.replace(" Stream", "")}</span>
          </p>
          <p className="sd-orient-rec-compat">Compatibility : {recommended.compatibility}%</p>
        </div>

        <p className="sd-orient-other-title">Other suitable streams</p>

        {alternatives.map((alt, i) => (
          <div key={i} className="sd-orient-alt">
            <div className="sd-orient-alt-header">
              <span className="sd-orient-alt-name">{alt.name}</span>
              <span className="sd-gold sd-orient-alt-pct">{alt.compatibility}%</span>
            </div>
            <div className="sd-progress-bar sd-orient-bar">
              <div className="sd-progress-fill sd-progress-fill--yellow" style={{ width: `${alt.compatibility}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const AVATAR_COLORS = ["#3a6a92", "#5a3a92", "#924a3a", "#3a9260", "#926a3a"];

const EMPTY_STUDENT = {
  id: null,
  firstName: "Student",
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
  const cleaned = name || email.split("@")[0] || "Student";
  const parts = cleaned.trim().split(/\s+/);
  return {
    firstName: parts[0] || "Student",
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
  const alternatives = names.slice(1).map((name, index) => ({
    name,
    compatibility: Math.max(45, 75 - index * 8),
  }));
  return {
    recommended: {
      name: recommendedName,
      compatibility: prediction?.pass_probability ? Math.round(prediction.pass_probability * 100) : 0,
      description: orientation?.explanation || "Prediction and orientation will appear when grades are available.",
    },
    alternatives,
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
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  };
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState(EMPTY_STUDENT);
  const [activeNav, setActiveNav] = useState(location.state?.page ?? "Dashboard");

  const [avatar, setAvatar] = useState(() => localStorage.getItem("studentAvatar") || null);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const profile = await getStudentProfile();
        const studentId = profile.student_id || profile.user_id;
        const [progress, prediction, orientation] = await Promise.allSettled([
          getStudentProgress(studentId),
          getStudentPrediction(studentId),
          getStudentOrientation(studentId),
        ]);
        setStudent(
          buildStudent(
            profile,
            progress.status === "fulfilled" ? progress.value : null,
            prediction.status === "fulfilled" ? prediction.value : null,
            orientation.status === "fulfilled" ? orientation.value : null,
          ),
        );
      } catch {
        setStudent(EMPTY_STUDENT);
      }
    };
    loadStudent();

    const syncAvatar = () => setAvatar(localStorage.getItem("studentAvatar") || null);
    window.addEventListener("focus", syncAvatar);
    window.addEventListener("studentAvatarChanged", syncAvatar);
    return () => {
      window.removeEventListener("focus", syncAvatar);
      window.removeEventListener("studentAvatarChanged", syncAvatar);
    };
  }, []);

  const studentName = `${student.firstName} ${student.lastName}`;
  const studentInitials = studentName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleNavClick = (item) => {
    if (item === "Profile") {
      navigate("/student/settings");
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
    <div className="sd-root">
      <StudentSidebar
        activePage={activeNav}
        onNavClick={handleNavClick}
      />

      <main className="sd-main">
        <header className="sd-header">
          <div className="sd-header-bar">
            <p className="sd-header-title">
              Welcome back, <span>"{student.firstName} {student.lastName}"</span>.
            </p>
            <div className="sd-header-avatar">
              {avatar ? (
                <img src={avatar} alt="profile" />
              ) : (
                <span className="sd-header-initials">{studentInitials}</span>
              )}
            </div>
          </div>
          <div className="sd-header-line" />
        </header>

        <div className="sd-content">{renderPage()}</div>
      </main>

      <nav className="sd-bottom-nav">
        {BOTTOM_NAV.map((item) => {
          const isActive = activeNav === item.key;
          return (
            <div
              key={item.key}
              className={`sd-bottom-nav-item ${isActive ? "active" : ""}`}
              onClick={() => handleNavClick(item.key)}
            >
              <img
                src={isActive ? item.iconBlue : item.iconWhite}
                alt={item.label}
                className="sd-bottom-nav-icon"
              />
              <p>{item.label}</p>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
