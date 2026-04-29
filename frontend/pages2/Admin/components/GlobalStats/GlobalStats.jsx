import StatsCards from '../StatsCards/StatsCards';
import SuccessRate from '../SuccessRate/SuccessRate';
import PredictionStats from '../PredictionStats/PredictionStats';
import PieChart from '../PieChart/PieChart';
import './GlobalStats.css';

function GlobalStats({ stats }) {
  return (
    <div className="global-stats">
      <div className="top-row">
        <StatsCards stats={stats} />
        <PredictionStats stats={stats} />
      </div>
      <div className="bottom-row">
        <SuccessRate stats={stats} />
        <PieChart stats={stats} />
      </div>
    </div>
  );
}

export default GlobalStats;
