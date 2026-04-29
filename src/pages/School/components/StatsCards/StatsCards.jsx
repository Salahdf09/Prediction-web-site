import './StatsCard.css';
import studentsIcon from '../../../../Assets/students_icon .png';
import attendanceIcon from '../../../../Assets/attandance_icon.png';
import gradeIcon from '../../../../Assets/grade_icon.png';

const stats = [
  {
    id: 1,
    label: "Total students number",
    value: "1,284",
    icon: studentsIcon,
    color: "#284B69"
  },
  {
    id: 2,
    label: "Attendance rate",
    value: "87%",
    icon: attendanceIcon,
    color: "#da8e9f"
  },
  {
    id: 3,
    label: "Average grade",
    value: "12,5",
    icon: gradeIcon,
    color: "#FFD230"
  }
];

function StatsCards() {
  return (
    <div className="stats-cards">
      {stats.map((stat) => (
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