import json

try:
    with open('models/model_metrics.json', 'r') as f:
        metrics = json.load(f)
    
    print("\n" + "="*60)
    print("SAVED MODEL METRICS")
    print("="*60)
    
    print(f"\n Last evaluated: {metrics['timestamp']}")
    print(f" Total samples: {metrics['samples_evaluated']}")
    
    print(f"\n Performance:")
    print(f"   • R² Score: {metrics['performance']['r2_score']}")
    print(f"   • RMSE: {metrics['performance']['rmse']}")
    print(f"   • MAE: {metrics['performance']['mae']}")
    
    print(f"\n Accuracy:")
    print(f"   • ±1 point: {metrics['accuracy']['within_1_point']}%")
    print(f"   • ±2 points: {metrics['accuracy']['within_2_points']}%")
    
    print(f"\n Average error: {metrics['error_stats']['mean_error']} points")
    
except FileNotFoundError:
    print("No metrics found. Run save_metrics.py first.")