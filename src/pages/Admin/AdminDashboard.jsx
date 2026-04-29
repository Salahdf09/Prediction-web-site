import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import GlobalStats from './components/GlobalStats/GlobalStats';
import UserManagement from './components/UserManagement/UserManagement';
import Profile from './components/Profile/Profile';
import AIControl from './components/AIControl/AIControl';
import './AdminDashboard.css';


function AdminDashboard() {
  const [activePage, setActivePage] = useState('global');

  const renderContent = () => {
    if (activePage === 'global') return <GlobalStats />;
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
    </div>
  );
}

export default AdminDashboard;