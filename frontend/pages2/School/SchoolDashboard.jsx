import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import GlobalStats from './components/GlobalStats/GlobalStats';
import StudentsList from './components/StudentsList/StudentsList';
import SchoolProfile from './components/SchoolProfile/SchoolProfile';
import { getSchoolStatistics, getSchoolStudents } from '../../src/api/api';
import { getUserId } from '../../src/api/auth';
import statsIconWhite from '../../Assets2/icone1-school-white.png';
import statsIconBlue from '../../Assets2/icone1-school-blue.png';
import studentsIconWhite from '../../Assets2/students_white.png';
import studentsIconBlue from '../../Assets2/students_blue.png';
import profileIconWhite from '../../Assets2/profile_white.png';
import profileIconBlue from '../../Assets2/profile_blue.png';
import './SchoolDashboard.css';

function SchoolDashboard() {
  const [activePage, setActivePage] = useState('global');
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const schoolId = getUserId();

  useEffect(() => {
    if (!schoolId) return;
    const loadSchoolData = async () => {
      const [statsResult, studentsResult] = await Promise.allSettled([
        getSchoolStatistics(schoolId),
        getSchoolStudents(schoolId),
      ]);
      if (statsResult.status === 'fulfilled') setStats(statsResult.value);
      if (studentsResult.status === 'fulfilled') setStudents(studentsResult.value.students || []);
    };
    loadSchoolData();
  }, [schoolId]);

  const reloadSchoolData = async () => {
    if (!schoolId) return;
    const [statsResult, studentsResult] = await Promise.allSettled([
      getSchoolStatistics(schoolId),
      getSchoolStudents(schoolId),
    ]);
    if (statsResult.status === 'fulfilled') setStats(statsResult.value);
    if (studentsResult.status === 'fulfilled') setStudents(studentsResult.value.students || []);
  };

  const renderContent = () => {
    if (activePage === 'global') return <GlobalStats stats={stats} />;
    if (activePage === 'students') return <StudentsList schoolId={schoolId} students={students} onStudentCreated={reloadSchoolData} />;
    if (activePage === 'profile') return <SchoolProfile />;
    return null;
  };

  return (
    <div className="school-dashboard">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="dashboard-content">
        <Header />
        {renderContent()}
      </div>

      <div className="bottom-nav">
        <div className={`bottom-nav-item ${activePage === 'global' ? 'active' : ''}`} onClick={() => setActivePage('global')}>
          <img src={activePage === 'global' ? statsIconBlue : statsIconWhite} alt="stats" className="bottom-nav-icon" />
          <p>Stats</p>
        </div>

        <div className={`bottom-nav-item ${activePage === 'students' ? 'active' : ''}`} onClick={() => setActivePage('students')}>
          <img src={activePage === 'students' ? studentsIconBlue : studentsIconWhite} alt="students" className="bottom-nav-icon" />
          <p>Students</p>
        </div>

        <div className={`bottom-nav-item ${activePage === 'profile' ? 'active' : ''}`} onClick={() => setActivePage('profile')}>
          <img src={activePage === 'profile' ? profileIconBlue : profileIconWhite} alt="profile" className="bottom-nav-icon" />
          <p>Profile</p>
        </div>
      </div>
    </div>
  );
}

export default SchoolDashboard;
