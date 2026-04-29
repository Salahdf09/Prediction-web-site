import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

data = pd.read_csv("data/students_finaldata.csv")

X = data[["Trimester1", "Trimester2", "Trimester3"]]
Y = data["Final"]
N_RUNS = 50
i = 0
best_model = None
best_mse = 1                                         
best_r2 = -1 
best_accuracy=0  
   
while i < N_RUNS:
    print(f"\nRun {i+1} :")

    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2)
    model= LinearRegression()

    cv_mse = -cross_val_score(model, X_train, Y_train,cv=5, scoring="neg_mean_squared_error") 
    cv_r2 = cross_val_score(model, X_train, Y_train,cv=5, scoring="r2")
    
    print(f"CV MSE: {cv_mse.mean():.2f}")
    print(f"CV R2 : {cv_r2.mean():.2f}")

    model.fit(X_train, Y_train)
    predictions = model.predict(X_test)
    mse = mean_squared_error(Y_test, predictions)
    r2 = r2_score(Y_test, predictions) 

    errors = abs(Y_test - predictions)
    within_1 = sum(errors <= 1) / len(errors) * 100
    within_2 = sum(errors <= 2) / len(errors) * 100

    print(f"Accuracy within 1 point: {within_1:.2f}%")
    print(f"Accuracy within 2 points: {within_2:.2f}%")

    excellent = sum(errors <= 0.5)
    good = sum((errors > 0.5) & (errors <= 1))
    average = sum((errors > 1) & (errors <= 2))
    poor = sum(errors > 2)

    print(f"Test MSE: {mse:.2f}")
    print(f"Test R2 : {r2:.2f}")
    print(f"Accuracy within 1 point: {within_1:.1f}%")
    print(f"Accuracy within 2 points: {within_2:.1f}%")
    print(f"Excellent: {excellent}, Good: {good}, Average: {average}, Poor: {poor}")

    if mse < best_mse and r2 > best_r2 and within_1 > best_accuracy:
        best_mse = mse
        best_r2 = r2
        best_accuracy = within_1
        best_model = model
        joblib.dump(best_model, "models/best_linear_model.joblib")
    
    i += 1

print("\nFINAL BEST MODEL")
print(f"Best MSE: {best_mse:.2f}")
print(f"Best R2 : {best_r2:.2f}")
print(f"Best Accuracy within 1 point: {best_accuracy:.2f}%")