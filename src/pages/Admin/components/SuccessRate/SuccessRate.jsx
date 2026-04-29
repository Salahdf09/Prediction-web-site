import './SuccessRate.css';

const levels = [
  { label: '5éme', percentage: 72 },
  { label: 'Bem',  percentage: 58 },
  { label: 'Bac',  percentage: 45 },
];

function SuccessRate() {
  return (
    <div className="success-rate-card">
      <h3 className="success-rate-title">Success rate per level</h3>
      <div className="success-rate-list">
        {levels.map((level, i) => (
          <div className="success-rate-item" key={i}>
            <span className="success-rate-label">{level.label}</span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${level.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuccessRate;