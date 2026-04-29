import './PredictionStats.css';
import accuracyIcon from '../../../../Assets2/accuracy-icon.png';
import predictionsIcon from "../../../../Assets2/prediction.png";
import predictionsIconWhite from "../../../../Assets2/prediction (1).png";

function PredictionStats({ stats }) {
  const predictions = [
    {
      label: 'Prediction Accuracy',
      value: `${stats?.global_pass_rate ?? 0}%`,
      icon: accuracyIcon,
      alt: 'accuracy',
    },
    {
      label: 'Total predictions made',
      value: stats?.total_predictions ?? 0,
      icon: predictionsIcon,
      alt: 'predictions',
    },
  ];

  return (
    <div className="prediction-cards">
      {predictions.map((item, i) => (
        <div className="prediction-card" key={i}>
          <img src={item.icon} alt={item.alt} className="prediction-icon" />
          <span className="prediction-value">{item.value}</span>
          <span className="prediction-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default PredictionStats;
