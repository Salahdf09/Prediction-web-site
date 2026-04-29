import './StatsCards.css';
import successIcon from '../../../../Assets/success-icon.png';
import schoolIcon from '../../../../Assets/school-iconn.png';
import parentsIcon from '../../../../Assets/parents-iconn.png';
import studentIcon from '../../../../Assets/students_icon .png';

const stats = [
  {
    label: 'Global success rate',
    value: '78,5%',
    icon: successIcon,
    alt: 'success',
    color: '#4DBDB5',
  },
  {
    label: 'Total schools number',
    value: '421',
    icon: schoolIcon,
    alt: 'schools',
    color: '#FFD230',
  },
  {
    label: 'Total parents number',
    value: '756',
    icon: parentsIcon,
    alt: 'parents',
    color: '#F28B8B',
  },
  {
    label: 'Total students number',
    value: '1,284',
    icon: studentIcon,
    alt: 'students',
    color: '#2E6A8E',
  },
];

function StatCards() {
  return (
    <div className="admin-stat-cards">
      {stats.map((stat, i) => (
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