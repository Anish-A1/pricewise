import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from imblearn.over_sampling import SMOTE
import warnings
import os

# Suppress warnings
warnings.filterwarnings("ignore")

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the price variations from the request
        data = request.get_json()
        price_variations = data.get("priceVariations", [])

        if not price_variations:
            return jsonify({"error": "No price variations provided."}), 400

        # Convert price variations into a DataFrame
        price_data = pd.DataFrame(price_variations)
        price_data.columns = ['Price', 'Date']  # Rename columns if necessary
        price_data['Date'] = pd.to_datetime(price_data['Date'])
        price_data = price_data.sort_values('Date').reset_index(drop=True)

        # Data Preprocessing
        if len(price_data) > 3:
            price_data['Price_t-1'] = price_data['Price'].shift(1)
            price_data['Price_t-2'] = price_data['Price'].shift(2)
            price_data['Price_MA_3'] = price_data['Price'].rolling(3).mean()

        price_data['Price_Diff'] = price_data['Price'].diff()
        price_data['Price_Change'] = price_data['Price_Diff'].apply(
            lambda x: 1 if x > 0.01 else (-1 if x < -0.01 else 0)
        )
        price_data = price_data.dropna().reset_index(drop=True)

        if price_data.empty:
            return jsonify({"error": "Dataset is empty after preprocessing. Ensure sufficient price variations."}), 400

        # Feature-Target Split
        features = ['Price_t-1', 'Price_t-2', 'Price_MA_3']
        features = [f for f in features if f in price_data.columns]
        X = price_data[features]
        y = price_data['Price_Change']

        if len(X) <= 1:
            return jsonify({"error": "Not enough data for training. Ensure price variations are sufficient."}), 400

        # Handle class imbalance with SMOTE
        if y.nunique() > 1:  # Ensure at least two classes
            smote = SMOTE(random_state=42, k_neighbors=min(3, len(X) - 1))
            X_resampled, y_resampled = smote.fit_resample(X, y)
        else:
            X_resampled, y_resampled = X, y  # Skip SMOTE if only one class exists

        # Train-Test Split
        if len(X_resampled) <= 1:
            return jsonify({"error": "Not enough data to train the model after resampling."}), 400
        X_train, X_test, y_train, y_test = train_test_split(
            X_resampled, y_resampled, test_size=0.2, random_state=42
        )

        # Train the Model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        # Evaluate the Model
        if len(X_test) > 0:  # Ensure there is a test set
            y_pred = model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            print(f"\nModel Accuracy: {accuracy:.2f}")
        else:
            print("\nNot enough data for test evaluation.")

        # Predict Future Trend
        if len(price_data) >= 2:
            last_row = price_data.iloc[-1]
            future_data = pd.DataFrame({
                'Price_t-1': [last_row['Price']],
                'Price_t-2': [last_row['Price_t-1']],
                'Price_MA_3': [last_row.get('Price_MA_3', last_row['Price'])]
            })
            future_prediction = model.predict(future_data)[0]

            # Map prediction to frontend-friendly values
            if future_prediction == 1:
                prediction_type = "Yes"
            elif future_prediction == -1:
                prediction_type = "Skip"
            else:
                prediction_type = "Wait"

            return jsonify({"predictionType": prediction_type})

        else:
            return jsonify({"error": "Not enough data to make a future prediction."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
