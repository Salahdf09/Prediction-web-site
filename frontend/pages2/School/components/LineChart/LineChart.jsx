import './LineChart.css';

const MIN = 10;
const MAX = 18;
const WIDTH = 400;
const HEIGHT = 160;
const PADDING = { top: 20, right: 30, bottom: 40, left: 40 };

function toX(index, dataLength) {
  const chartWidth = WIDTH - PADDING.left - PADDING.right;
  return PADDING.left + (index / Math.max(dataLength - 1, 1)) * chartWidth;
}

function toY(value) {
  const chartHeight = HEIGHT - PADDING.top - PADDING.bottom;
  return PADDING.top + ((MAX - value) / (MAX - MIN)) * chartHeight;
}

const gridValues = [12, 14, 16];

function LineChart({ stats }) {
  const average = Number(stats?.average_score ?? 0);
  const data = [
    { label: 'AVERAGE', value: average },
    { label: 'PASS RATE', value: Math.min(20, (Number(stats?.pass_rate ?? 0) / 100) * 20) },
    { label: 'PREDICTIONS', value: Math.min(20, Number(stats?.total_predictions ?? 0)) },
  ];
  const points = data.map((d, i) => ({ x: toX(i, data.length), y: toY(d.value) }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = [
    `M ${points[0].x} ${toY(MIN)}`,
    ...points.map(p => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${toY(MIN)}`,
    'Z',
  ].join(' ');

  return (
    <div className="linechart-card">
      <h3 className="linechart-title">Academic Progress</h3>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="linechart-svg"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8C9E0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#B8C9E0" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridValues.map(v => (
          <g key={v}>
            <line
              x1={PADDING.left} y1={toY(v)}
              x2={WIDTH - PADDING.right} y2={toY(v)}
              stroke="#e0e0e0" strokeWidth="1"
            />
            <text x={PADDING.left - 8} y={toY(v)} textAnchor="end" dominantBaseline="middle"
              fontSize="10" fill="#999">
              {v}
            </text>
          </g>
        ))}

        {/* Bottom axis line */}
        <line
          x1={PADDING.left} y1={toY(MIN)}
          x2={WIDTH - PADDING.right} y2={toY(MIN)}
          stroke="#e0e0e0" strokeWidth="1"
        />

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#6A90B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots + labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6" fill="#FFD230" stroke="#fff" strokeWidth="2" />
            <text
              x={p.x} y={toY(MIN) + 16}
              textAnchor="middle" fontSize="9"
              fontWeight="600" fill="#888" letterSpacing="0.5"
            >
              {data[i].label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default LineChart;
