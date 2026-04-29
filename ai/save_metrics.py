import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

# Load model and data
model = joblib.load('models/best_linear_model.joblib')
df = pd.read_csv('data/students_finaldata.csv')

# Prepare data
X = df[["Trimester1", "Trimester2", "Trimester3"]]
Y = df["Final"]

# Make predictions
predictions = model.predict(X)
errors = abs(Y - predictions)

# Calculate metrics
mse = mean_squared_error(Y, predictions)
rmse = np.sqrt(mse)
r2 = r2_score(Y, predictions)
mae = mean_absolute_error(Y, predictions)


acc_05 = sum(errors <= 0.5) / len(errors) * 100
acc_1 = sum(errors <= 1) / len(errors) * 100
acc_2 = sum(errors <= 2) / len(errors) * 100

# Grade category performance
categories = {
    "Excellent (16-20)": {"count": 0, "total_error": 0},
    "Good (14-16)": {"count": 0, "total_error": 0},
    "Satisfactory (12-14)": {"count": 0, "total_error": 0},
    "Pass (10-12)": {"count": 0, "total_error": 0},
    "Fail (<10)": {"count": 0, "total_error": 0}
}

for actual, error in zip(Y, errors):
    if actual >= 16:
        cat = "Excellent (16-20)"
    elif actual >= 14:
        cat = "Good (14-16)"
    elif actual >= 12:
        cat = "Satisfactory (12-14)"
    elif actual >= 10:
        cat = "Pass (10-12)"
    else:
        cat = "Fail (<10)"
    
    categories[cat]["count"] += 1
    categories[cat]["total_error"] += error

# Calculate average error per category
for cat in categories:
    if categories[cat]["count"] > 0:
        categories[cat]["avg_error"] = round(categories[cat]["total_error"] / categories[cat]["count"], 3)
    del categories[cat]["total_error"]

# Create metrics dictionary
metrics = {
    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "model_file": "best_linear_model.joblib",
    "samples_evaluated": len(df),
    "performance": {
        "mse": round(mse, 4),
        "rmse": round(rmse, 4),
        "r2_score": round(r2, 4),
        "mae": round(mae, 4)
    },
    "accuracy": {
        "within_0.5_points": round(acc_05, 2),
        "within_1_point": round(acc_1, 2),
        "within_2_points": round(acc_2, 2)
    },
    "error_stats": {
        "min_error": round(min(errors), 3),
        "max_error": round(max(errors), 3),
        "mean_error": round(np.mean(errors), 3),
        "std_error": round(np.std(errors), 3)
    },
    "grade_performance": categories
}

# Save to JSON file
with open('models/model_metrics.json', 'w') as f:
    json.dump(metrics, f, indent=4)

# Print to console
print("\n" + "="*60)
print("MODEL METRICS SAVED")
print("="*60)
print(f" Metrics saved to: models/model_metrics.json")
print(f" Evaluated on: {len(df)} samples")
print(f" Time: {metrics['timestamp']}")

print("\n PERFORMANCE METRICS:")
print(f"   • MSE:  {metrics['performance']['mse']}")
print(f"   • RMSE: {metrics['performance']['rmse']}")
print(f"   • R²:   {metrics['performance']['r2_score']}")
print(f"   • MAE:  {metrics['performance']['mae']}")

print("\n ACCURACY:")
print(f"   • Within 0.5 points: {metrics['accuracy']['within_0.5_points']}%")
print(f"   • Within 1 point:   {metrics['accuracy']['within_1_point']}%")
print(f"   • Within 2 points:  {metrics['accuracy']['within_2_points']}%")

print("\n ERROR DISTRIBUTION:")
print(f"   • Min error:  {metrics['error_stats']['min_error']}")
print(f"   • Max error:  {metrics['error_stats']['max_error']}")
print(f"   • Mean error: {metrics['error_stats']['mean_error']}")
print(f"   • Std error:  {metrics['error_stats']['std_error']}")

print("\n PERFORMANCE BY GRADE CATEGORY:")
for category, data in metrics['grade_performance'].items():
    print(f"   • {category}:")
    print(f"     - Students: {data['count']}")
    print(f"     - Avg error: {data['avg_error']} points")

print("="*60)