import { useNavigate } from 'react-router-dom';
import logo from '../../../../Assets/Logo.png';
import './Sidebar.css';

// white icons
import globalWhite from '../../../../Assets/icone1-school-white.png';
import usersWhite from '../../../../Assets/users-white.png';
import profileWhite from '../../../../Assets/icone3-school-white.png';
import aiWhite from '../../../../Assets/ai-white.png';
import logoutWhite from '../../../../Assets/logout.png';

// blue icons
import globalBlue from '../../../../Assets/icone1-school-blue.png';
import usersBlue from '../../../../Assets/users-blue.png';
import profileBlue from '../../../../Assets/icone3-school-blue.png';
import aiBlue from '../../../../Assets/ai-blue.png';

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
      <div className="sidebar-logout" onClick={() => navigate('/')}>
        <img src={logoutWhite} alt="logout" className="sidebar-icon"/>
        <span>Log out</span>
      </div>
    </div>
  );
}

export default Sidebar;