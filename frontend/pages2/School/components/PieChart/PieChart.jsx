import './PieChart.css';

function getConicGradient(segments) {
  let result = '';
  let cumulative = 0;
  segments.forEach(({ color, percentage }, i) => {
    result += `${color} ${cumulative}% ${cumulative + percentage}%`;
    cumulative += percentage;
    if (i < segments.length - 1) result += ', ';
  });
  return `conic-gradient(${result})`;
}

function getLabelPosition(startPct, endPct, radius = 36) {
  const midPct = (startPct + endPct) / 2;
  const angle = (midPct / 100) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const x = 50 + radius * Math.cos(rad);
  const y = 50 + radius * Math.sin(rad);
  return { left: `${x}%`, top: `${y}%` };
}

function PieChart({ stats }) {
  const pass = Math.round(stats?.pass_rate ?? 0);
  const riskValue = Number(stats?.medium_risk_count ?? 0);
  const failValue = Number(stats?.high_risk_count ?? 0);
  const lowValue = Number(stats?.low_risk_count ?? 0);
  const totalRisk = lowValue + riskValue + failValue;
  const data = totalRisk
    ? [
        { label: 'Pass', value: lowValue, percentage: Math.round((lowValue / totalRisk) * 100), color: '#4DBDB5' },
        { label: 'Risk', value: riskValue, percentage: Math.round((riskValue / totalRisk) * 100), color: '#F5C842' },
        { label: 'Fail', value: failValue, percentage: Math.max(0, 100 - Math.round((lowValue / totalRisk) * 100) - Math.round((riskValue / totalRisk) * 100)), color: '#F28B8B' },
      ]
    : [
        { label: 'Pass', value: `${pass}%`, percentage: pass, color: '#4DBDB5' },
        { label: 'Risk', value: 0, percentage: 0, color: '#F5C842' },
        { label: 'Fail', value: 0, percentage: Math.max(0, 100 - pass), color: '#F28B8B' },
      ];
  let cumulative = 0;

  return (
    <div className="donut-card">
      <div className="donut-wrapper">
        <div className="donut" style={{ background: getConicGradient(data) }}>
          <div className="donut-hole" />
        </div>
        {data.map(({ label, percentage }) => {
          const pos = getLabelPosition(cumulative, cumulative + percentage);
          cumulative += percentage;
          return (
            <span key={label} className="donut-label" style={{ left: pos.left, top: pos.top }}>
              {percentage}%
            </span>
          );
        })}
      </div>

      <div className="donut-legend">
        {data.map(({ label, value, color }) => (
          <div className="legend-item" key={label}>
            <span className="legend-label">{label}</span>
            <span className="legend-dot" style={{ backgroundColor: color }} />
            <span className="legend-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PieChart;
