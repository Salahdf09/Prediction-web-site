import StatsCards from '../StatsCards/StatsCards';
import SchoolBarChart from '../BarChart/BarChart';
import SchoolPieChart from '../PieChart/PieChart';
import SchoolLineChart from '../LineChart/LineChart';
import './GlobalStats.css';

function GlobalStats() {
  return (
    <div className="dashboard-main">
     <div className="dashboard-top">
      <div className="dashboard-Barcharts">
        <SchoolBarChart />
        </div>
      <div className="dashboard-stats">
        <StatsCards />
       </div>
     </div>
      <div className="dashboard-bottom-charts">
          <SchoolPieChart />
          <SchoolLineChart />
       </div>
    </div>
      
  );
}

export default GlobalStats;