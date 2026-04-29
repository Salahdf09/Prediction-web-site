import pandas as pd
import joblib
import numpy as np

print("=" * 50)
print("AI GRADE PREDICTOR - BATCH PREDICTION")
print("=" * 50)

# Load model
print("\nLoading model...")
model = joblib.load('models/best_linear_model.joblib')
print("Model loaded")

# Load data
print("\nLoading student data...")
df = pd.read_csv('data/students_finaldata.csv')
print(f"Loaded {len(df)} students")

# Predict
print("\nPredicting grades...")
X = df[['Trimester1', 'Trimester2', 'Trimester3']]
predictions = model.predict(X)

# Add predictions to dataframe
df['Predicted_Final'] = predictions.round(2)
df['Status'] = np.where(predictions >= 10, 'PASS', 'FAIL')
df['Deviation'] = abs(df['Final'] - df['Predicted_Final']).round(2)

# Save results
df.to_csv('outputs/all_predictions.csv', index=False)
print(f"Results saved to: outputs/all_predictions.csv")

# Summary
print("\n" + "=" * 50)
print("SUMMARY")
print("=" * 50)
print(f"Total Students: {len(df)}")
print(f"Predicted PASS: {sum(df['Status'] == 'PASS')}")
print(f"Predicted FAIL: {sum(df['Status'] == 'FAIL')}")
print(f"Average Deviation: {df['Deviation'].mean():.2f} points")
print(f"Predictions within 1 point: {sum(df['Deviation'] <= 1)} / {len(df)} ({sum(df['Deviation'] <= 1)/len(df)*100:.1f}%)")
print("=" * 50)