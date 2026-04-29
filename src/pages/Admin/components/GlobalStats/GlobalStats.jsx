import StatsCards from '../StatsCards/StatsCards';
import SuccessRate from '../SuccessRate/SuccessRate';
import PredictionStats from '../PredictionStats/PredictionStats';
import PieChart from '../PieChart/PieChart';
import './GlobalStats.css';

function GlobalStats() {
  return (
    <div className="global-stats">
      <div className="top-row">
        <StatsCards />
        <PredictionStats />
      </div>
      <div className="bottom-row">
        <SuccessRate />
        <PieChart />
      </div>
    </div>
  );
}

export default GlobalStats;