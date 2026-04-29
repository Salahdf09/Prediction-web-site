import { useState, useRef } from "react";
import "./StudentSettings.css";
import logoImg from "../../assets/images/logo.png";
import defaultAvatar from "../../assets/images/students/pfp.png";

const navItems = ["Dashboard", "Progress", "Simulation", "Prediction", "Profile"];

function SecurityPanel() {
  const [show, setShow] = useState({ current: false, newP: false, confirm: false });
  const toggle = (field) => setShow(prev => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="ss-security">
      <div className="ss-security-header">
        <span className="ss-lock-icon">🔒</span>
        <div>
          <h3 className="ss-security-title">Change Password</h3>
          <p className="ss-security-desc">
            To change your password, please fill in the fields below.<br />
            Your password must contain at least 8 characters, it must also include at least
            one upper case letter, one lower case letter, one number and one special character.
          </p>
        </div>
      </div>

      <form className="ss-form" onSubmit={(e) => e.preventDefault()}>
        <div className="ss-field full">
          <label>Current Password</label>
          <div className="ss-input-wrapper">
            <input type={show.current ? "text" : "password"} placeholder="Current Password" />
            <span className="ss-eye" onClick={() => toggle("current")}>
              {show.current ? "🙈" : "👁"}
            </span>
          </div>
        </div>

        <div className="ss-field full">
          <label>New Password</label>
          <div className="ss-input-wrapper">
            <input type={show.newP ? "text" : "password"} placeholder="New Password" />
            <span className="ss-eye" onClick={() => toggle("newP")}>
              {show.newP ? "🙈" : "👁"}
            </span>
          </div>
        </div>

        <div className="ss-field full">
          <label>Confirm New Password</label>
          <div className="ss-input-wrapper">
            <input type={show.confirm ? "text" : "password"} placeholder="Confirm Password" />
            <span className="ss-eye" onClick={() => toggle("confirm")}>
              {show.confirm ? "🙈" : "👁"}
            </span>
          </div>
        </div>

        <button type="submit" className="ss-btn-submit">Change Password</button>
      </form>
    </div>
  );
}

export default function StudentSettings() {
  const [activeNav, setActiveNav] = useState("Profile");
  const [activeTab, setActiveTab] = useState("account");
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [form, setForm] = useState({
    fullName: "", phoneNumber: "", email: "", address: "",
  });
  const fileRef = useRef();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated info:", form);
  };

  const tabs = [
    { key: "account",       label: "Account Setting",    sub: "Details about your personal information" },
    { key: "notifications", label: "Notifications",       sub: "See your latest notifications and updates" },
    { key: "security",      label: "Password & Security", sub: "Manage your password and account security" },
  ];

  return (
    <div className="ss-root">

      {/* ── SIDEBAR ── */}
      <aside className="ss-sidebar">
        <div className="ss-logo">
          <img src={logoImg} alt="logo" />
        </div>

        <nav className="ss-nav">
          {navItems.map(item => (
            <button
              key={item}
              className={`ss-nav-item ${activeNav === item ? "active" : ""}`}
              onClick={() => setActiveNav(item)}
            >
              <span className="ss-nav-icon">{navIcon(item)}</span>
              <span className="ss-nav-label">{item}</span>
            </button>
          ))}
        </nav>

        <button className="ss-logout">
          <span className="ss-nav-icon">↩</span>
          <span className="ss-nav-label">Log out</span>
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="ss-main">

        {/* Top bar */}
        <header className="ss-topbar-wrapper">
          <div className="ss-topbar">
            <h2 className="ss-welcome">
              Welcome back, <span>"Student name"</span>.
            </h2>
          </div>
          <div className="ss-avatar-circle">
            <img src={avatar} alt="profile" />
          </div>
        </header>

        {/* Page content */}
        <div className="ss-content">
          <div className="ss-page-header">
            <h1 className="ss-page-title">Settings</h1>
            <button className="ss-btn-cancel">Cancel</button>
          </div>

          <div className="ss-body">

            {/* Left: tab menu */}
            <div className="ss-tabs">
              {tabs.map(t => (
                <button
                  key={t.key}
                  className={`ss-tab ${activeTab === t.key ? "active" : ""}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  <p className="ss-tab-label">{t.label}</p>
                  <p className="ss-tab-sub">{t.sub}</p>
                </button>
              ))}
            </div>

            {/* Right: panel */}
            <div className="ss-panel">

              {activeTab === "account" && (
                <>
                  {/* Photo upload row */}
                  <div className="ss-photo-row">
                    <div className="ss-photo-avatar">
                      <img src={avatar} alt="avatar" />
                    </div>
                    <p className="ss-photo-label">Upload a new photo</p>
                    <button
                      className="ss-btn-update-photo"
                      onClick={() => fileRef.current.click()}
                    >
                      Update
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Form */}
                  <div className="ss-form-section">
                    <h3 className="ss-form-title">Change User Information here</h3>

                    <form onSubmit={handleSubmit} className="ss-form">
                      <div className="ss-form-row">
                        <div className="ss-field">
                          <label>Full name</label>
                          <input
                            type="text" name="fullName"
                            placeholder=""
                            value={form.fullName} onChange={handleChange}
                          />
                        </div>
                        <div className="ss-field">
                          <label>Phone number</label>
                          <input
                            type="tel" name="phoneNumber"
                            placeholder=""
                            value={form.phoneNumber} onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="ss-field full">
                        <label>E-mail</label>
                        <input
                          type="email" name="email"
                          placeholder=""
                          value={form.email} onChange={handleChange}
                        />
                      </div>

                      <div className="ss-field full">
                        <label>Adress</label>
                        <input
                          type="text" name="address"
                          placeholder=""
                          value={form.address} onChange={handleChange}
                        />
                      </div>

                      <button type="submit" className="ss-btn-submit">
                        Update Information
                      </button>
                    </form>
                  </div>
                </>
              )}

              {activeTab === "notifications" && (
                <div className="ss-empty-panel">
                  <p>🔔 Notifications settings coming soon.</p>
                </div>
              )}

              {activeTab === "security" && (
                <SecurityPanel />
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function navIcon(name) {
  return {
    Dashboard: "⊞", Progress: "↗", Simulation: "⟳",
    Prediction: "◎", Profile: "👤",
  }[name] ?? "•";
}