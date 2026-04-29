import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import GlobalStats from './components/GlobalStats/GlobalStats';
import UserManagement from './components/UserManagement/UserManagement';
import Profile from './components/Profile/Profile';
import AIControl from './components/AIControl/AIControl';
import { getAdminStatistics } from '../../src/api/api';
import { getUserId } from '../../src/api/auth';
import './AdminDashboard.css';

import statsIconWhite from '../../Assets2/icone1-school-white.png';
import statsIconBlue from '../../Assets2/icone1-school-blue.png';
import usersIconWhite from '../../Assets2/students_white.png';
import usersIconBlue from '../../Assets2/students_blue.png';
import profileIconWhite from '../../Assets2/profile_white.png';
import profileIconBlue from '../../Assets2/profile_blue.png';
import aiIconWhite from '../../Assets2/ai-white.png';
import aiIconBlue from '../../Assets2/ai-blue.png';

function AdminDashboard() {
  const [activePage, setActivePage] = useState('global');
  const [stats, setStats] = useState(null);
  const adminId = getUserId();

  useEffect(() => {
    if (!adminId) return;
    const loadStats = async () => {
      try {
        setStats(await getAdminStatistics(adminId));
      } catch {
        setStats(null);
      }
    };
    loadStats();
  }, [adminId]);

  const renderContent = () => {
    if (activePage === 'global') return <GlobalStats stats={stats} />;
    if (activePage === 'users') return <UserManagement />;
    if (activePage === 'profile') return <Profile />;
    if (activePage === 'ai') return <AIControl />;
  };

  return (
    <div className="admin-dashboard">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="dashboard-content">
        <Header />
        {renderContent()}
      </div>

      <div className="bottom-nav">
        <div
          className={`bottom-nav-item ${activePage === 'global' ? 'active' : ''}`}
          onClick={() => setActivePage('global')}
        >
          <img
            src={activePage === 'global' ? statsIconBlue : statsIconWhite}
            alt="stats"
            className="bottom-nav-icon"
          />
          <p>Stats</p>
        </div>
        <div
          className={`bottom-nav-item ${activePage === 'users' ? 'active' : ''}`}
          onClick={() => setActivePage('users')}
        >
          <img
            src={activePage === 'users' ? usersIconBlue : usersIconWhite}
            alt="users"
            className="bottom-nav-icon"
          />
          <p>Users</p>
        </div>
        <div
          className={`bottom-nav-item ${activePage === 'profile' ? 'active' : ''}`}
          onClick={() => setActivePage('profile')}
        >
          <img
            src={activePage === 'profile' ? profileIconBlue : profileIconWhite}
            alt="profile"
            className="bottom-nav-icon"
          />
          <p>Profile</p>
        </div>
        <div
          className={`bottom-nav-item ${activePage === 'ai' ? 'active' : ''}`}
          onClick={() => setActivePage('ai')}
        >
          <img
            src={activePage === 'ai' ? aiIconBlue : aiIconWhite}
            alt="ai"
            className="bottom-nav-icon"
          />
          <p>AI</p>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;
