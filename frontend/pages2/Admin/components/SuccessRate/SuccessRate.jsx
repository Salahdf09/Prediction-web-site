import './SuccessRate.css';

function SuccessRate({ stats }) {
  const levels = [
    { label: 'Global', percentage: stats?.global_pass_rate ?? 0 },
    { label: 'Schools', percentage: Math.min(100, stats?.total_schools ?? 0) },
    { label: 'Students', percentage: Math.min(100, stats?.total_students ?? 0) },
  ];

  return (
    <div className="success-rate-card">
      <h3 className="success-rate-title">Success rate overview</h3>
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
