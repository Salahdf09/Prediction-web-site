import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ParentSettings.css";

import defaultAvatar from "../../assets/images/parent.png";
import { logout } from "../../api/auth";
import ParentSidebar from "./ParentSidebar";
import SwitchChildModal from "./SwitchChildModal";
import { mockStudents } from "../../data/mockData";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Icons = {
  hamburger: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
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
    <div className="ps-security">
      <div className="ps-security-header">
        <span className="ps-lock-icon">{Icons.lock}</span>
        <div>
          <h3 className="ps-security-title">Change Password</h3>
          <p className="ps-security-desc">
            To change your password, please fill in the fields below.<br />
            Your password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
          </p>
        </div>
      </div>

      <form className="ps-form" onSubmit={(e) => e.preventDefault()}>
        <div className="ps-field full">
          <label>Current Password</label>
          <div className="ps-input-wrapper">
            <input type={show.current ? "text" : "password"} placeholder="Current Password" />
            <span className="ps-eye" onClick={() => toggle("current")}>{show.current ? Icons.eyeOff : Icons.eye}</span>
          </div>
        </div>
        <div className="ps-field full">
          <label>New Password</label>
          <div className="ps-input-wrapper">
            <input type={show.newP ? "text" : "password"} placeholder="New Password" />
            <span className="ps-eye" onClick={() => toggle("newP")}>{show.newP ? Icons.eyeOff : Icons.eye}</span>
          </div>
        </div>
        <div className="ps-field full">
          <label>Confirm New Password</label>
          <div className="ps-input-wrapper">
            <input type={show.confirm ? "text" : "password"} placeholder="Confirm Password" />
            <span className="ps-eye" onClick={() => toggle("confirm")}>{show.confirm ? Icons.eyeOff : Icons.eye}</span>
          </div>
        </div>
        <button type="submit" className="ps-btn-submit">Change Password</button>
      </form>
    </div>
  );
}

// ── Notifications Panel ────────────────────────────────────────────────────────
function NotificationsPanel({ onNavigate }) {
  const notifications = [
    { id: 1, title: "New Prediction Available", desc: "Your child's updated predicted score for the final exam is ready!", action: "View Prediction", route: "Prediction" },
    { id: 2, title: "Great Progress! Well Done!", desc: "Your child increased their predicted score by 10%. Keep it up!", action: "View Report", route: "Dashboard" },
    { id: 3, title: "System Update", desc: "New features have been added to improve your experience.", action: "Learn More", route: null },
  ];

  return (
    <div className="ps-notif-panel">
      <h3 className="ps-notif-title">Notifications</h3>
      {notifications.map((n) => (
        <div key={n.id} className="ps-notif-item">
          <p className="ps-notif-item-title">{n.title}</p>
          <p className="ps-notif-item-desc">{n.desc}</p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="ps-notif-action-btn" onClick={() => n.route && onNavigate && onNavigate(n.route)}>
              {n.action}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ParentSettings() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Profile");
  const [activeTab, setActiveTab] = useState("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [linkedChildren, setLinkedChildren] = useState([mockStudents[0]]);
  const [selectedId, setSelectedId] = useState(mockStudents[0].id);
  const [form, setForm] = useState({ fullName: "", phoneNumber: "", email: "", address: "" });
  const fileRef = useRef();

  const handleAddChild = ({ fullName, studentId, email }) => {
    const found = mockStudents.find((s) => s.userCode === studentId.trim().toUpperCase());
    if (!found) return "not_found";
    if (linkedChildren.some((s) => s.id === found.id)) return "already_added";
    const nameMatch = `${found.firstName} ${found.lastName}`.toLowerCase() === fullName.trim().toLowerCase();
    const emailMatch = found.email.toLowerCase() === email.trim().toLowerCase();
    if (!nameMatch || !emailMatch) return "mismatch";
    setLinkedChildren((prev) => [...prev, found]);
    return "ok";
  };

  // ── Avatar synced with "parentAvatar" localStorage key ──
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("parentAvatar") || defaultAvatar;
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setAvatar(url);
      localStorage.setItem("parentAvatar", url);
      window.dispatchEvent(new Event("focus"));
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); console.log("Updated info:", form); };
  const handleLogout = () => { logout(); navigate("/"); };

  const handleNavClick = (item) => {
    setActiveNav(item);
    setSidebarOpen(false);
    const routes = {
      Dashboard: "/parent/dashboard",
      Simulation: "/parent/dashboard",
      Prediction: "/parent/dashboard",
      Profile: "/parent/settings",
    };
    if (routes[item]) navigate(routes[item]);
  };

  const tabs = [
    { key: "account",       label: "Account Setting",    sub: "Details about your personal information" },
    { key: "notifications", label: "Notifications",       sub: "See your latest notifications and updates" },
    { key: "security",      label: "Password & Security", sub: "Manage your password and account security" },
  ];

  return (
    <div className="ps-root">
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
        activePage="Profile"
        onNavClick={handleNavClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSwitchChild={() => setSwitchOpen(true)}
      />

      <main className="ps-main">
        <header className="ps-topbar-wrapper">
          <button className="ps-hamburger" onClick={() => setSidebarOpen(o => !o)}>{Icons.hamburger}</button>
          <div className="ps-topbar">
            <h2 className="ps-welcome">Welcome back, <span>"Parent"</span>.</h2>
          </div>
          <div className="ps-avatar-circle"><img src={avatar} alt="profile" /></div>
        </header>

        <div className="ps-content">
          <div className="ps-page-header">
            <h1 className="ps-page-title">Settings</h1>
            <button className="ps-btn-cancel" onClick={() => navigate("/parent/dashboard")}>Cancel</button>
          </div>

          <div className="ps-body">
            <div className="ps-tabs">
              {tabs.map(t => (
                <button key={t.key} className={`ps-tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
                  <p className="ps-tab-label">{t.label}</p>
                  <p className="ps-tab-sub">{t.sub}</p>
                </button>
              ))}
            </div>

            <div className="ps-panel">
              {activeTab === "account" && (
                <>
                  <div className="ps-photo-row">
                    <div className="ps-photo-avatar"><img src={avatar} alt="avatar" /></div>
                    <p className="ps-photo-label">Upload a new photo</p>
                    <button className="ps-btn-update-photo" onClick={() => fileRef.current.click()}>Update</button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                  </div>
                  <div className="ps-form-section">
                    <h3 className="ps-form-title">Change User Information here</h3>
                    <form onSubmit={handleSubmit} className="ps-form">
                      <div className="ps-form-row">
                        <div className="ps-field">
                          <label>Full name</label>
                          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} />
                        </div>
                        <div className="ps-field">
                          <label>Phone number</label>
                          <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="ps-field full">
                        <label>E-mail</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} />
                      </div>
                      <div className="ps-field full">
                        <label>Address</label>
                        <input type="text" name="address" value={form.address} onChange={handleChange} />
                      </div>
                      <button type="submit" className="ps-btn-submit">Update Information</button>
                    </form>
                  </div>
                </>
              )}

              {activeTab === "notifications" && (
                <NotificationsPanel onNavigate={(route) => navigate(`/parent/dashboard`)} />
              )}

              {activeTab === "security" && <SecurityPanel />}
            </div>
          </div>
        </div>
      </main>

      <nav className="ps-bottom-nav">
        <button className={`ps-bottom-nav-item ${activeNav === "Dashboard" ? "active" : ""}`} onClick={() => handleNavClick("Dashboard")}>
          <span className="ps-bottom-nav-icon">📊</span><span>Dashboard</span>
        </button>
        <button className={`ps-bottom-nav-item ${activeNav === "Simulation" ? "active" : ""}`} onClick={() => handleNavClick("Simulation")}>
          <span className="ps-bottom-nav-icon">⏱️</span><span>Simulation</span>
        </button>
        <button className={`ps-bottom-nav-item ${activeNav === "Prediction" ? "active" : ""}`} onClick={() => handleNavClick("Prediction")}>
          <span className="ps-bottom-nav-icon">🎯</span><span>Prediction</span>
        </button>
        <button className={`ps-bottom-nav-item ${activeNav === "Profile" ? "active" : ""}`} onClick={() => handleNavClick("Profile")}>
          <span className="ps-bottom-nav-icon">👤</span><span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
