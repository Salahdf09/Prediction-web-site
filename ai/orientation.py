import numpy as np
import joblib

print("=" * 50)
print("AI STUDENT ORIENTATION SYSTEM")
print("=" * 50)


print("\nLoading model...")
model = joblib.load("models/best_linear_model.joblib")
print("Model loaded successfully!")


#Orientation function
def orient_student(pred):
    if pred < 10:
        return ["Not eligible"]

    elif pred < 11.5 and pred >= 10:
        return [
            "Economics, Management & Business",
            "Life & Natural Sciences",
            "Science & Technology",
            "Material Sciences",
            "Arabic Language & Literature",
            "Law",
        ]

    elif pred <= 13 and pred > 11.5:
        return [
            "English Language",
            "Civil Engineering",
            "Mechanical Engineering",
            "Electrical Engineering",
            "Philosophy",
            "Computer Science",
        ]

    elif pred < 14.5 and pred > 13:
        return [
            "Architecture",
            "Agricultural Sciences",
            "Computer Science",
            "Mathematics",
            "Veterinary Sciences",
            "Applied Economics"
        ]

    elif pred < 16 and pred >= 14.5:
        return [
            "Computer Science",
            "Physics",
            "Mathematics",
            "Industrial Engineering",
            "Natural Sciences",
            "Automation & Control",
        ]

    elif pred < 17.5 and pred >= 16:
        return [
            "Medicine",
            "Pharmacy",
            "Biology",
            "Computer Science",
            "Dentistry",
            "Nursing"
        ]

    elif pred <= 20 and pred >= 17.5:
        return [
            "National Schools — Computer Science",
            "National Schools — Artificial Intelligence",
            "Data Science",
            "Robotics",
            "National Schools — Advanced Cybersecurity",
            "National Schools — Polytechnic Engineering"
        ]


#Prediction function
def predict_and_orient(t1, t2, t3):
    X_new = np.array([[t1, t2, t3]])
    pred = model.predict(X_new)[0]
    orientations = orient_student(pred)
    return pred, orientations

try:
    t1 = float(input("\nEnter Trimester 1 grade: "))
    t2 = float(input("Enter Trimester 2 grade: "))
    t3 = float(input("Enter Trimester 3 grade: "))

    # Prediction
    pred, orientations = predict_and_orient(t1, t2, t3)

    # -------------------------------
    # 5. Display results
    # -------------------------------
    print("\n" + "=" * 50)
    print("PREDICTION RESULT")
    print("=" * 50)

    print(f"Predicted Final Grade: {pred:.2f}/20")

    print("\nSuggested Orientations:")
    for i, o in enumerate(orientations, 1):
        print(f"{i}. {o}")

    print("=" * 50)

except ValueError:
    print("Invalid input! Please enter numeric values.")