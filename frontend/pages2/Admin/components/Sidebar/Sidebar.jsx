import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../src/api/auth';
import logo from '../../../../Assets2/Logo.png';
import './Sidebar.css';

// white icons
import globalWhite from '../../../../Assets2/icone1-school-white.png';
import usersWhite from '../../../../Assets2/users-white.png';
import profileWhite from '../../../../Assets2/icone3-school-white.png';
import aiWhite from '../../../../Assets2/ai-white.png';
import logoutWhite from '../../../../Assets2/logout.png';

// blue icons
import globalBlue from '../../../../Assets2/icone1-school-blue.png';
import usersBlue from '../../../../Assets2/users-blue.png';
import profileBlue from '../../../../Assets2/icone3-school-blue.png';
import aiBlue from '../../../../Assets2/ai-blue.png';

function Sidebar({ activePage, setActivePage }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="sidebar-divider"></div>
      <nav className="sidebar-nav">
        <div className={`sidebar-item ${activePage === 'global' ? 'active' : ''}`} onClick={() => setActivePage('global')}>
          <img src={activePage === 'global' ? globalBlue : globalWhite} className="sidebar-icon" alt="global"/>
          <span>Global statistics</span>
        </div>
        <div className={`sidebar-item ${activePage === 'users' ? 'active' : ''}`} onClick={() => setActivePage('users')}>
          <img src={activePage === 'users' ? usersBlue : usersWhite} className="sidebar-icon" alt="users"/>
          <span>User management</span>
        </div>
        <div className={`sidebar-item ${activePage === 'profile' ? 'active' : ''}`} onClick={() => setActivePage('profile')}>
          <img src={activePage === 'profile' ? profileBlue : profileWhite} className="sidebar-icon" alt="profile"/>
          <span>Profile</span>
        </div>
        <div className={`sidebar-item ${activePage === 'ai' ? 'active' : ''}`} onClick={() => setActivePage('ai')}>
          <img src={activePage === 'ai' ? aiBlue : aiWhite} className="sidebar-icon" alt="ai"/>
          <span>AI control</span>
        </div>
      </nav>
      <div className="sidebar-divider"></div>
      <div className="sidebar-logout" onClick={() => { logout(); navigate('/'); }}>
        <img src={logoutWhite} alt="logout" className="sidebar-icon"/>
        <span>Log out</span>
      </div>
    </div>
  );
}

export default Sidebar;