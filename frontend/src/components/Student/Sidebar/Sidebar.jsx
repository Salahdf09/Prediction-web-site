import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

import dashboardWhite  from '../../../../Assets2/icone1-school-white.png';
import dashboardBlue   from '../../../../Assets2/icone1-school-blue.png';
import simulationWhite from '../../../../Assets2/signes-vitaux (1).png';
import simulationBlue  from '../../../../Assets2/signes-vitaux.png';
import predictionWhite from '../../../../Assets2/prediction (1).png';
import predictionBlue  from '../../../../Assets2/prediction.png';
import profileWhite    from '../../../../Assets2/profile_white.png';
import profileBlue     from '../../../../Assets2/profile_blue.png';
import logoutImg       from '../../../../Assets2/logout.png';
import { logout }      from '../../../api/auth';
import logo            from '../../../assets/images/logo.png';


// ── Nav Items ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    key:          'Dashboard',
    label:        'Dashboard',
    route:        '/student/dashboard',
    iconWhite:    dashboardWhite,
    iconBlue:     dashboardBlue,
  },
  {
    key:          'Simulation',
    label:        'Simulation',
    route:        '/student/simulation',
    iconWhite:    simulationWhite,
    iconBlue:     simulationBlue,
  },
  {
    key:          'Prediction',
    label:        'Prediction',
    route:        '/student/prediction',
    iconWhite:    predictionWhite,
    iconBlue:     predictionBlue,
  },
  {
    key:          'Profile',
    label:        'Profile',
    route:        '/student/settings',
    iconWhite:    profileWhite,
    iconBlue:     profileBlue,
  },
];

function StudentSidebar({ activePage, onNavClick, isOpen, onClose }) {
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (onNavClick) {
      onNavClick(item.key);
    } else {
      navigate(item.route);
    }
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="student-sidebar-overlay" onClick={onClose} />}

      <div className={`student-sidebar ${isOpen ? 'open' : ''}`}>

        {/* Logo */}
        <div className="student-sidebar-logo">
          <div className="student-sidebar-logo-circle">
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Nav */}
        <nav className="student-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.key;
            return (
              <div
                key={item.key}
                className={`student-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleClick(item)}
              >
                <span className="student-nav-icon">
                  <img
                    src={isActive ? item.iconBlue : item.iconWhite}
                    alt={item.label}
                    style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                  />
                </span>
                <span className="student-nav-label">{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="student-sidebar-footer">
          <div className="student-sidebar-divider" />
          <button className="student-sidebar-logout" onClick={handleLogout}>
            <span className="student-nav-icon">
              <img
                src={logoutImg}
                alt="logout"
                style={{ width: '20px', height: '20px', objectFit: 'contain' }}
              />
            </span>
            <span className="student-nav-label">Log out</span>
          </button>
        </div>

      </div>
    </>
  );
}

export default StudentSidebar;