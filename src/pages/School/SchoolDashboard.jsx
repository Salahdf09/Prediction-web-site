import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import GlobalStats from './components/GlobalStats/GlobalStats';
import StudentsList from './components/StudentsList/StudentsList';
import SchoolProfile from './components/SchoolProfile/SchoolProfile';
import statsIconWhite from '../../Assets/stats_white.png';
import statsIconBlue from '../../Assets/stats_blue.png';
import studentsIconWhite from '../../Assets/students_white.png';
import studentsIconBlue from '../../Assets/students_blue.png';
import profileIconWhite from '../../Assets/profile_white.png';
import profileIconBlue from '../../Assets/profile_blue.png';
import './SchoolDashboard.css';

function SchoolDashboard() {
  const [activePage, setActivePage] = useState('global');

  const renderContent = () => {
    if (activePage === 'global') return <GlobalStats />;
    if (activePage === 'students') return <StudentsList />;
    if (activePage === 'profile') return <SchoolProfile />;
  };

  return (
    <div className="school-dashboard">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="dashboard-content">
        <Header />
        {renderContent()}
      </div>

      {/* 👇 Bottom nav — only shows on mobile */}
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
  className={`bottom-nav-item ${activePage === 'students' ? 'active' : ''}`}
  onClick={() => setActivePage('students')}
>
  <img 
    src={activePage === 'students' ? studentsIconBlue : studentsIconWhite}
    alt="students" 
    className="bottom-nav-icon" 
  />
  <p>Students</p>
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
</div>

    </div>
  );
}

export default SchoolDashboard;