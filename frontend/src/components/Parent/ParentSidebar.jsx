import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";
import logoImg from "../../assets/images/logo.png";
import "./ParentSidebar.css";

const Icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9" />
    </svg>
  ),
  simulation: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  ),
  prediction: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="8" cy="8" r="2.5" fill="currentColor" opacity=".8" />
    </svg>
  ),
  profile: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),
  switchChild: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="11 11 14 8 11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="14" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { key: "Dashboard",  label: "Dashboard",  icon: Icons.dashboard },
  { key: "Simulation", label: "Simulation", icon: Icons.simulation },
  { key: "Prediction", label: "Prediction", icon: Icons.prediction },
  { key: "Profile",    label: "Profile",    icon: Icons.profile },
];

export default function ParentSidebar({ activePage, onNavClick, isOpen, onClose, onSwitchChild }) {
  const navigate = useNavigate();

  const handleNav = (key) => {
    if (onClose) onClose();
    if (key === "Profile") {
      navigate("/parent/settings");
      return;
    }
    if (onNavClick) onNavClick(key);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {isOpen && <div className="parent-sidebar-overlay" onClick={onClose} />}

      <aside className={`parent-sidebar${isOpen ? " open" : ""}`}>
        <div className="parent-sidebar-logo">
          <div className="parent-sidebar-logo-circle">
            <img src={logoImg} alt="Logo" />
          </div>
        </div>

        <nav className="parent-sidebar-nav">
          {NAV_ITEMS.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`parent-nav-item${activePage === key ? " active" : ""}`}
              onClick={() => handleNav(key)}
            >
              <span className="parent-nav-icon">{icon}</span>
              <span className="parent-nav-label">{label}</span>
            </button>
          ))}
        </nav>

        <div className="parent-sidebar-footer">
          <div className="parent-sidebar-divider" />
          {onSwitchChild && (
            <button
              className="parent-switch-child-btn"
              onClick={() => { if (onClose) onClose(); onSwitchChild(); }}
            >
              <span className="parent-nav-icon">{Icons.switchChild}</span>
              <span className="parent-nav-label">Switch child</span>
            </button>
          )}
          <button className="parent-sidebar-logout" onClick={handleLogout}>
            <span className="parent-nav-icon">{Icons.logout}</span>
            <span className="parent-nav-label">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
