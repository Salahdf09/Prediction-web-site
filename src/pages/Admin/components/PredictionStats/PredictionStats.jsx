import './PredictionStats.css';
import accuracyIcon from '../../../../Assets/accuracy-icon.png';
import predictionsIcon from '../../../../Assets/predictions-icon.png';

const predictions = [
  {
    label: 'Prediction Accuracy',
    value: '74%',
    icon: accuracyIcon,
    alt: 'accuracy',
  },
  {
    label: 'Total predictions made',
    value: '734',
    icon: predictionsIcon,
    alt: 'predictions',
  },
];

function PredictionStats() {
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