import './StatsCards.css';
import successIcon from '../../../../Assets2/success-icon.png';
import schoolIcon from '../../../../Assets2/school-iconn.png';
import parentsIcon from '../../../../Assets2/parents-iconn.png';
import studentIcon from '../../../../Assets2/students_icon .png';

function StatCards({ stats }) {
  const cards = [
    {
      label: 'Global success rate',
      value: `${stats?.global_pass_rate ?? 0}%`,
      icon: successIcon,
      alt: 'success',
      color: '#4DBDB5',
    },
    {
      label: 'Total schools number',
      value: stats?.total_schools ?? 0,
      icon: schoolIcon,
      alt: 'schools',
      color: '#FFD230',
    },
    {
      label: 'Total parents number',
      value: stats?.total_parents ?? 0,
      icon: parentsIcon,
      alt: 'parents',
      color: '#F28B8B',
    },
    {
      label: 'Total students number',
      value: stats?.total_students ?? 0,
      icon: studentIcon,
      alt: 'students',
      color: '#2E6A8E',
    },
  ];

  return (
    <div className="admin-stat-cards">
      {cards.map((stat, i) => (
        <div
  className="admin-stat-card"
  key={i}
  style={{ borderLeftColor: stat.color }} >
          <div className="admin-stat-info">
            <span className="admin-stat-label">{stat.label}</span>
            <span className="admin-stat-value">{stat.value}</span>
          </div>
          <img src={stat.icon} alt={stat.alt} className="admin-stat-icon" />
        </div>
      ))}
    </div>
  );
}

export default StatCards;
