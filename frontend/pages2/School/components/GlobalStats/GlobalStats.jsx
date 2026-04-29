import StatsCards from '../StatsCards/StatsCards';
import SchoolBarChart from '../BarChart/BarChart';
import SchoolPieChart from '../PieChart/PieChart';
import SchoolLineChart from '../LineChart/LineChart';
import './GlobalStats.css';

function GlobalStats({ stats }) {
  return (
    <div className="dashboard-main">
     <div className="dashboard-top">
      <div className="dashboard-Barcharts">
        <SchoolBarChart stats={stats} />
        </div>
      <div className="dashboard-stats">
        <StatsCards stats={stats} />
       </div>
     </div>
      <div className="dashboard-bottom-charts">
          <SchoolPieChart stats={stats} />
          <SchoolLineChart stats={stats} />
       </div>
    </div>
      
  );
}

export default GlobalStats;
