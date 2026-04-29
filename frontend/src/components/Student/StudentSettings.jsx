import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentSettings.css";

import defaultAvatar from "../../assets/images/students/pfp.png";
import { logout } from "../../api/auth";
import StudentSidebar from "./Sidebar/Sidebar";

// ── Assets2 bottom nav icons ───────────────────────────────────────────────────
import dashboardWhite  from '../../../Assets2/icone1-school-white.png';
import dashboardBlue   from '../../../Assets2/icone1-school-blue.png';
import simulationWhite from '../../../Assets2/signes-vitaux (1).png';
import simulationBlue  from '../../../Assets2/signes-vitaux.png';
import predictionWhite from '../../../Assets2/prediction (1).png';
import predictionBlue  from '../../../Assets2/prediction.png';
import profileWhite    from '../../../Assets2/profile_white.png';
import profileBlue     from '../../../Assets2/profile_blue.png';

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Icons = {
  lock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  eye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  eyeOff: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
};

// ── Security Panel ─────────────────────────────────────────────────────────────
function SecurityPanel() {
  const [show, setShow] = useState({ current: false, newP: false, confirm: false });
  const toggle = (field) => setShow(prev => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="ss-security">
      <div className="ss-security-header">
        <span className="ss-lock-icon">{Icons.lock}</span>
        <div>
          <h3 className="ss-security-title">Change Password</h3>
          <p className="ss-security-desc">
            To change your password, please fill in the fields below.<br />
            Your password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
          </p>
        </div>
      </div>

      <form className="ss-form" onSubmit={(e) => e.preventDefault()}>
        <div className="ss-field full">
          <label>Current Password</label>
          <div className="ss-input-wrapper">
            <input type={show.current ? "text" : "password"} placeholder="Current Password" />
            <span className="ss-eye" onClick={() => toggle("current")}>{show.current ? Icons.eyeOff : Icons.eye}</span>
          </div>
        </div>
        <div className="ss-field full">
          <label>New Password</label>
          <div className="ss-input-wrapper">
            <input type={show.newP ? "text" : "password"} placeholder="New Password" />
            <span className="ss-eye" onClick={() => toggle("newP")}>{show.newP ? Icons.eyeOff : Icons.eye}</span>
          </div>
        </div>
        <div className="ss-field full">
          <label>Confirm New Password</label>
          <div className="ss-input-wrapper">
            <input type={show.confirm ? "text" : "password"} placeholder="Confirm Password" />
            <span className="ss-eye" onClick={() => toggle("confirm")}>{show.confirm ? Icons.eyeOff : Icons.eye}</span>
          </div>
        </div>
        <button type="submit" className="ss-btn-submit">Change Password</button>
      </form>
    </div>
  );
}

// ── Notifications Panel ────────────────────────────────────────────────────────
function NotificationsPanel({ onNavigate }) {
  const notifications = [
    { id: 1, title: "New Prediction Available", desc: "Your updated predicted score for the final exam is ready!", action: "View Prediction", route: "Prediction" },
    { id: 2, title: "Great Progress! Well Done!", desc: "You increased your predicted score by 10%. Keep up the good work!", action: "View Report", route: "Dashboard" },
    { id: 3, title: "System Update", desc: "New features have been added to improve your experience.", action: "Learn More", route: null },
  ];

  return (
    <div className="ss-notif-panel">
      <h3 className="ss-notif-title">Notifications</h3>
      {notifications.map((n) => (
        <div key={n.id} className="ss-notif-item">
          <p className="ss-notif-item-title">{n.title}</p>
          <p className="ss-notif-item-desc">{n.desc}</p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="ss-notif-action-btn" onClick={() => n.route && onNavigate && onNavigate(n.route)}>
              {n.action}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Bottom Nav Items config ────────────────────────────────────────────────────
const BOTTOM_NAV = [
  { key: 'Dashboard',  label: 'Dashboard',  iconWhite: dashboardWhite,  iconBlue: dashboardBlue  },
  { key: 'Simulation', label: 'Simulation', iconWhite: simulationWhite, iconBlue: simulationBlue },
  { key: 'Prediction', label: 'Prediction', iconWhite: predictionWhite, iconBlue: predictionBlue },
  { key: 'Profile',    label: 'Profile',    iconWhite: profileWhite,    iconBlue: profileBlue    },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StudentSettings() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Profile");
  const [activeTab, setActiveTab] = useState("account");
  const [form, setForm] = useState({ fullName: "", phoneNumber: "", email: "", address: "" });
  const fileRef = useRef();

  // ── Avatar synced with localStorage ──
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("studentAvatar") || defaultAvatar;
  });

  // ── Student name from localStorage ──
  const studentName = (() => {
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("currentUser") || "{}";
      const u = JSON.parse(raw);
      if (u.firstName && u.lastName) return `${u.firstName} ${u.lastName}`;
      if (u.first_name && u.last_name) return `${u.first_name} ${u.last_name}`;
      if (u.name) return u.name;
      if (u.email) return u.email.split("@")[0];
    } catch {}
    return "Student";
  })();
  const studentInitials = studentName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setAvatar(url);
      localStorage.setItem("studentAvatar", url);
      window.dispatchEvent(new CustomEvent("studentAvatarChanged"));
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); console.log("Updated info:", form); };
  const handleLogout = () => { logout(); navigate("/"); };

  const handleNavClick = (item) => {
    setActiveNav(item);
    const routes = {
      Dashboard:  "/student/dashboard",
      Simulation: "/student/dashboard",
      Prediction: "/student/dashboard",
      Profile:    "/student/settings",
    };
    if (routes[item]) navigate(routes[item], { state: { page: item } });
  };

  const tabs = [
    { key: "account",       label: "Account Setting",    sub: "Details about your personal information"      },
    { key: "notifications", label: "Notifications",       sub: "See your latest notifications and updates"   },
    { key: "security",      label: "Password & Security", sub: "Manage your password and account security"   },
  ];

  return (
    <div className="ss-root">
      <StudentSidebar
        activePage="Profile"
        onNavClick={handleNavClick}
      />

      <main className="ss-main">
        <header className="ss-header">
          <div className="ss-header-bar">
            <p className="ss-header-title">
              Welcome back, <span>"{studentName}"</span>.
            </p>
            <div className="ss-header-avatar">
              {avatar && avatar !== defaultAvatar ? (
                <img src={avatar} alt="profile" />
              ) : (
                <span className="ss-header-initials">{studentInitials}</span>
              )}
            </div>
          </div>
          <div className="ss-header-line" />
        </header>

        <div className="ss-content">
          <div className="ss-page-header">
            <h1 className="ss-page-title">Settings</h1>
            <button className="ss-btn-cancel" onClick={() => navigate("/student/dashboard")}>Cancel</button>
          </div>

          <div className="ss-body">
            <div className="ss-tabs">
              {tabs.map(t => (
                <button key={t.key} className={`ss-tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
                  <p className="ss-tab-label">{t.label}</p>
                  <p className="ss-tab-sub">{t.sub}</p>
                </button>
              ))}
            </div>

            <div className="ss-panel">
              {activeTab === "account" && (
                <>
                  <div className="ss-photo-row">
                    <div className="ss-photo-avatar"><img src={avatar} alt="avatar" /></div>
                    <p className="ss-photo-label">Upload a new photo</p>
                    <button className="ss-btn-update-photo" onClick={() => fileRef.current.click()}>Update</button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                  </div>
                  <div className="ss-form-section">
                    <h3 className="ss-form-title">Change User Information here</h3>
                    <form onSubmit={handleSubmit} className="ss-form">
                      <div className="ss-form-row">
                        <div className="ss-field">
                          <label>Full name</label>
                          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} />
                        </div>
                        <div className="ss-field">
                          <label>Phone number</label>
                          <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="ss-field full">
                        <label>E-mail</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} />
                      </div>
                      <div className="ss-field full">
                        <label>Address</label>
                        <input type="text" name="address" value={form.address} onChange={handleChange} />
                      </div>
                      <button type="submit" className="ss-btn-submit">Update Information</button>
                    </form>
                  </div>
                </>
              )}

              {activeTab === "notifications" && (
                <NotificationsPanel onNavigate={(route) => navigate(`/student/${route.toLowerCase()}`)} />
              )}

              {activeTab === "security" && <SecurityPanel />}
            </div>
          </div>
        </div>
      </main>

      <nav className="ss-bottom-nav">
        {BOTTOM_NAV.map((item) => {
          const isActive = activeNav === item.key;
          return (
            <div
              key={item.key}
              className={`ss-bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.key)}
            >
              <img
                src={isActive ? item.iconBlue : item.iconWhite}
                alt={item.label}
                className="ss-bottom-nav-icon"
              />
              <p>{item.label}</p>
            </div>
          );
        })}
      </nav>
    </div>
  );
}