import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../../Assets/Logo.png';

// White icons (default)
import globalWhite from '../../../../Assets/icone1-school-white.png';
import studentsWhite from '../../../../Assets/icone2-school-white.png';
import profileWhite from '../../../../Assets/icone3-school-white.png';
import logout from '../../../../Assets/logout.png';

// Blue icons (active)
import globalBlue from '../../../../Assets/icone1-school-blue.png';
import studentsBlue from '../../../../Assets/icone2-school-blue.png';
import profileBlue from '../../../../Assets/icone3-school-blue.png';

import './Sidebar.css';

function Sidebar({ activePage, setActivePage }) { // 👈 receive props
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="sidebar-divider"></div>
      <nav className="sidebar-nav">
        <div
          className={`sidebar-item ${activePage === 'global' ? 'active' : ''}`}
          onClick={() => setActivePage('global')} // 👈 use prop
        >
          <img src={activePage === 'global' ? globalBlue : globalWhite} alt="global" className="sidebar-icon"/>
          <span>Global statistics</span>
        </div>

        <div
          className={`sidebar-item ${activePage === 'students' ? 'active' : ''}`}
          onClick={() => setActivePage('students')}
        >
          <img src={activePage === 'students' ? studentsBlue : studentsWhite} alt="students" className="sidebar-icon"/>
          <span>Students data</span>
        </div>

        <div
          className={`sidebar-item ${activePage === 'profile' ? 'active' : ''}`}
          onClick={() => setActivePage('profile')}
        >
          <img src={activePage === 'profile' ? profileBlue : profileWhite} alt="profile" className="sidebar-icon"/>
          <span>School Profile</span>
        </div>
      </nav>
      <div className="sidebar-divider"></div>
      <div className="sidebar-logout" onClick={() => navigate('/')}>
        <img src={logout} alt="logout" className="sidebar-icon"/>
        <span>Log out</span>
      </div>
    </div>
  );
}

export default Sidebar;