import './AIControl.css';

// 👇 FAKE DATA — replace with API calls later
const modelStatus = {
  model: "Linear Regression",
  status: "TRAINED",
  lastTraining: "2025-04-24 14:30:22",
  trainingTime: "4.2 seconds",
  datasetSize: "554 records"
};

const modelPerformance = {
  mae: 0.78,
  r2: 0.86,
  accuracy1: "82%",
  accuracy2: "94%"
};

const errorDistribution = [
  { label: "EXCELLENT (≤0.5 point)", count: 45, percentage: 80, color: "#2d7a3a" },
  { label: "GOOD (0.5-1 point)", count: 36, percentage: 60, color: "#2196F3" },
  { label: "AVERAGE (1-2 points)", count: 20, percentage: 40, color: "#FFD230" },
  { label: "POOR (>2 points)", count: 10, percentage: 20, color: "#e53935" }
];

const modelFormula = {
  equation: "Final Grade = (T1 × 0.32) + (T2 × 0.35) + (T3 × 0.38) + 2.15",
  trimesters: [
    { label: "Trimester 1", value: 0.32, percent: "32%", highlight: false },
    { label: "Trimester 2", value: 0.35, percent: "35%", highlight: false },
    { label: "Trimester 3", value: 0.38, percent: "38%", highlight: true }
  ],
  note: "Trimester 3 has the highest impact (38%)"
};

const trainingProgress = {
  progress: 100,
  status: "Training completed successfully",
  newMae: 0.78,
  newR2: 0.86
};

const trainingSessions = [
  { date: "2025-04-24", dataset: "students_data3.csv", mae: 0.78, r2: 0.86, status: "Completed" },
  { date: "2025-04-20", dataset: "students_data2.csv", mae: 0.82, r2: 0.84, status: "Completed" },
  { date: "2025-04-15", dataset: "students_data1.csv", mae: 0.91, r2: 0.79, status: "Completed" },
  { date: "2025-04-10", dataset: "old_data.csv", mae: 1.05, r2: 0.72, status: "Completed" }
];

function AIControl() {
  return (
    <div className="ai-control">

      <h2 className="ai-title">AI Model Control</h2>

      {/* Row 1 */}
      <div className="ai-row">

        {/* Section 1 — Model Status */}
        <div className="ai-card">
          <div className="ai-card-header">
            <span className="ai-card-number">1</span>
            <h3>MODEL STATUS</h3>
          </div>
          <table className="status-table">
            <tbody>
              <tr>
                <td className="label">Model:</td>
                <td className="value">{modelStatus.model}</td>
              </tr>
              <tr>
                <td className="label">Status:</td>
                <td className="value">
                  <span className="badge-trained">✓ {modelStatus.status}</span>
                </td>
              </tr>
              <tr>
                <td className="label">Last Training:</td>
                <td className="value">{modelStatus.lastTraining}</td>
              </tr>
              <tr>
                <td className="label">Training Time:</td>
                <td className="value"><strong>{modelStatus.trainingTime}</strong></td>
              </tr>
              <tr>
                <td className="label">Dataset Size:</td>
                <td className="value"><strong>{modelStatus.datasetSize}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2 — Model Performance */}
        <div className="ai-card">
          <div className="ai-card-header">
            <span className="ai-card-number">2</span>
            <h3>MODEL PERFORMANCE</h3>
          </div>
          <div className="performance-grid">
            <div className="perf-card">
              <p className="perf-label">MAE</p>
              <p className="perf-sublabel">(Mean Error)</p>
              <h2 className="perf-value blue">{modelPerformance.mae}</h2>
              <p className="perf-unit">points</p>
            </div>
            <div className="perf-card">
              <p className="perf-label">R²</p>
              <p className="perf-sublabel">(Explained)</p>
              <h2 className="perf-value blue">{modelPerformance.r2}</h2>
            </div>
            <div className="perf-card">
              <p className="perf-label">Accuracy</p>
              <p className="perf-sublabel">(≤1 point)</p>
              <h2 className="perf-value green">{modelPerformance.accuracy1}</h2>
            </div>
            <div className="perf-card">
              <p className="perf-label">Accuracy</p>
              <p className="perf-sublabel">(≤2 points)</p>
              <h2 className="perf-value green">{modelPerformance.accuracy2}</h2>
            </div>
          </div>
        </div>

        {/* Section 3 — Error Distribution */}
        <div className="ai-card">
          <div className="ai-card-header">
            <span className="ai-card-number">3</span>
            <h3>ERROR DISTRIBUTION</h3>
          </div>
          <div className="error-dist">
            {errorDistribution.map((item, index) => (
              <div className="error-item" key={index}>
                <div className="error-info">
                  <span className="error-label">{item.label}</span>
                  <span className="error-count">{item.count} students</span>
                </div>
                <div className="error-bar-bg">
                  <div className="error-bar" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                </div>
              </div>
            ))}
            <div className="overall-eval">
              <span>Overall Evaluation:</span>
              <span className="eval-badge">🟢 GOOD</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2 */}
      <div className="ai-row">

        {/* Section 4 — Model Formula */}
        <div className="ai-card">
          <div className="ai-card-header">
            <span className="ai-card-number">4</span>
            <h3>MODEL FORMULA</h3>
          </div>
          <div className="formula-box">
            <p>{modelFormula.equation}</p>
          </div>
          <div className="trimester-grid">
            {modelFormula.trimesters.map((trim, index) => (
              <div className={`trimester-card ${trim.highlight ? 'highlight' : ''}`} key={index}>
                <p className="trim-label">{trim.label}</p>
                <h3 className={`trim-value ${trim.highlight ? 'green' : ''}`}>{trim.value}</h3>
                <p className={`trim-percent ${trim.highlight ? 'green' : ''}`}>{trim.percent}</p>
              </div>
            ))}
          </div>
          <p className="formula-note">↗ {modelFormula.note}</p>
        </div>

        {/* Section 5 — Training Controls */}
        <div className="ai-card">
          <div className="ai-card-header">
            <span className="ai-card-number">5</span>
            <h3>TRAINING CONTROLS</h3>
          </div>
          <div className="training-controls">
            <div className="dataset-row">
              <span className="dataset-label">Dataset:</span>
              <div className="file-input-box">
                <span>📄 Choose CSV File</span>
              </div>
            </div>
            <div className="training-buttons">
              <button className="btn-upload">⬆ Upload CSV</button>
              <button className="btn-train">▶ Train Model</button>
              <button className="btn-save">💾 Save Model</button>
            </div>
            <div className="training-progress">
              <p className="progress-label">Training Progress:</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${trainingProgress.progress}%` }}></div>
              </div>
              <p className="progress-status">
                Status: <span className="status-success">✅ {trainingProgress.status}</span>
              </p>
              <p className="progress-metrics">
                New MAE: <strong>{trainingProgress.newMae}</strong> | New R²: <strong>{trainingProgress.newR2}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Section 6 — Recent Training Sessions */}
        <div className="ai-card">
          <div className="ai-card-header">
            <span className="ai-card-number">6</span>
            <h3>RECENT TRAINING SESSIONS</h3>
          </div>
          <table className="sessions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Dataset</th>
                <th>MAE</th>
                <th>R²</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trainingSessions.map((session, index) => (
                <tr key={index}>
                  <td>{session.date}</td>
                  <td>{session.dataset}</td>
                  <td>{session.mae}</td>
                  <td>{session.r2}</td>
                  <td><span className="status-badge">✅ {session.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Section 7 — Actions */}
<div className="ai-card actions-card">
  <div className="ai-card-header">
    <span className="ai-card-number">7</span>
    <h3>ACTIONS</h3>
  </div>
  <div className="actions-grid">
    <button className="action-btn btn-report">
      📊 View Detailed Report
    </button>
    <button className="action-btn btn-export">
      ⬇ Export Model
    </button>
    <button className="action-btn btn-retrain">
      🔄 Retrain Model
    </button>
    <button className="action-btn btn-predictions">
      📈 View Predictions
    </button>
    <button className="action-btn btn-delete">
      🗑 Delete Model
    </button>
    <button className="action-btn btn-settings">
      ⚙️ Settings
    </button>
  </div>
</div>

    </div>
  );
}

export default AIControl;