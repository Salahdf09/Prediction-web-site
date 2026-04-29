import './Header.css';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../api/auth';          // ✅ only ONE logout import
import schoolIcon from '../../../../Assets2/school-icon.png';
import notifIcon  from '../../../../Assets2/notification.png';
import logoutIcon from '../../../../Assets2/logout_icon.png';

/**
 * Shared Header — used by Admin, Student, Parent, School dashboards.
 *
 * Props:
 *  - avatar  {string|null}  URL of the user's profile picture.
 *                           When changed anywhere in the app (via localStorage
 *                           + global state), this re-renders automatically.
 *  - role    {string}       'admin' | 'student' | 'parent' | 'school'
 *  - name    {string}       Display name shown in the welcome message.
 */
function Header({ avatar = null, role = 'admin', name = '' }) {
  const navigate = useNavigate();

  // Derive welcome label from role
  const roleLabel = {
    admin:   'Admin',
    student: 'Student',
    parent:  'Parent',
    school:  'School',
  }[role] ?? 'User';

  const displayName = name || roleLabel + ' name';

  return (
    <div className="header">

      {/* ── Mobile top bar ─────────────────────────────────────────────────── */}
      <div className="mobile-topbar">
        <div className="mobile-topbar-left">
          <div className="notif-icon">
            <img src={notifIcon} alt="notification" />
          </div>
          <div className="logout-icon" onClick={() => { logout(); navigate('/'); }}>
            <img src={logoutIcon} alt="logout" />
          </div>
        </div>

        {/* Global avatar — shows profile picture if available */}
        {avatar && (
          <div className="mobile-topbar-avatar">
            <img src={avatar} alt="profile" />
          </div>
        )}
      </div>

      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <div className="header-bar">
        <div className="header-bar-text">
          <p className="header-title">
            Welcome back, <span>"{displayName}"</span>
          </p>
        </div>

        {/* Right side: profile avatar (if set) OR default school icon */}
        <div className="header-icon-wrapper">
          {avatar ? (
            <img
              src={avatar}
              alt="profile"
              className="header-icon header-avatar"
            />
          ) : (
            <img src={schoolIcon} alt="school" className="header-icon" />
          )}
        </div>
      </div>

      <div className="header-line"></div>
    </div>
  );
}

export default Header;