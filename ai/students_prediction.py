import joblib
import numpy as np

print("=" * 50)
print("AI GRADE PREDICTOR - PREDICTION")
print("=" * 50)

# Load model
print("\nLoading model...")
model = joblib.load('models/best_linear_model.joblib')
print("Model loaded")

# Get input
print("\nEnter trimester grades (0-20):")
t1 = float(input("Trimester 1: "))
t2 = float(input("Trimester 2: "))
t3 = float(input("Trimester 3: "))

# Predict
input_data = np.array([[t1, t2, t3]])
prediction = model.predict(input_data)[0]

# Determine result
if prediction >= 10:
    status = "PASS"
    if prediction >= 16:
        category = "Excellent"
    elif prediction >= 14:
        category = "Good"
    elif prediction >= 12:
        category = "Satisfactory"
    else:
        category = "Pass"
else:
    status = "FAIL"
    if prediction >= 8:
        category = "Needs Improvement"
    else:
        category = "Critical"

# Show result
print("\n" + "=" * 50)
print("PREDICTION RESULT")
print("=" * 50)
print(f"Trimester Grades: {t1}, {t2}, {t3}")
print(f"Predicted Final Grade: {prediction:.2f} / 20")
print(f"Status: {status}")
print(f"Category: {category}")
print("=" * 50)