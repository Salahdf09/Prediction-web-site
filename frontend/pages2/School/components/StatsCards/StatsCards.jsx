import './StatsCard.css';
import studentsIcon from '../../../../Assets2/students_icon .png';
import attendanceIcon from '../../../../Assets2/attandance_icon.png';
import gradeIcon from '../../../../Assets2/grade_icon.png';

function StatsCards({ stats }) {
  const cards = [
    {
      id: 1,
      label: "Total students number",
      value: stats?.total_students ?? 0,
      icon: studentsIcon,
      color: "#284B69"
    },
    {
      id: 2,
      label: "Pass rate",
      value: `${stats?.pass_rate ?? 0}%`,
      icon: attendanceIcon,
      color: "#da8e9f"
    },
    {
      id: 3,
      label: "Average grade",
      value: stats?.average_score ?? 0,
      icon: gradeIcon,
      color: "#FFD230"
    }
  ];

  return (
    <div className="stats-cards">
      {cards.map((stat) => (
        <div className="stat-card" key={stat.id}  style={{ borderLeft: `4px solid ${stat.color}` }}>
          <div className="stat-card-left">
            <p className="stat-label">{stat.label}</p>
            <h2 className="stat-value">{stat.value}</h2>
          </div>
          <img src={stat.icon} alt={stat.label} className="stat-icon" />
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
