from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)

# Allow the React frontend running on Vite
CORS(app, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
])


# =========================================================
# LOAD TRAINED MODEL
# =========================================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "shg_financial_risk_model.pkl"
)

model = joblib.load(MODEL_PATH)


# =========================================================
# FEATURES USED DURING MODEL TRAINING
# =========================================================

FEATURES = [
    "Savings",
    "Loans",
    "Expenses",
    "Loan_Repayment",
    "Income_Records",
    "Business_Income",
    "Net_Balance",
    "Loan_Savings_Ratio",
    "Expense_Income_Ratio",
    "Repayment_Income_Ratio",
    "Business_Income_Ratio",
]


# =========================================================
# HOME / HEALTH CHECK
# =========================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "SHG Connect ML API is running",
        "model": "SHG Financial Risk Model"
    })


# =========================================================
# DATASET API ROUTES
# =========================================================

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

DATASETS = {
    "products": "Product_Dataset.csv",
    "members": "SHG_Member_Details.csv",
    "sales": "Sales_Dataset.csv",
    "financial-data": "Financial_Dataset.csv"
}


def load_dataset(dataset_name):
    filename = DATASETS[dataset_name]
    filepath = os.path.join(DATA_DIR, filename)

    if not os.path.isfile(filepath):
        return None

    df = pd.read_csv(filepath)

    # Convert records to JSON-safe Python values
    return __import__("json").loads(
        df.to_json(orient="records")
    )


def dataset_response(dataset_name):
    try:
        records = load_dataset(dataset_name)

        if records is None:
            return jsonify({
                "status": "error",
                "message": f"Dataset file not found: {DATASETS[dataset_name]}",
                "expected_folder": DATA_DIR
            }), 404

        return jsonify({
            "status": "success",
            "count": len(records),
            dataset_name.replace("-", "_"): records
        })

    except Exception as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


@app.route("/api/products", methods=["GET"])
def get_products():
    return dataset_response("products")


@app.route("/api/members", methods=["GET"])
def get_members():
    return dataset_response("members")


@app.route("/api/sales", methods=["GET"])
def get_sales():
    return dataset_response("sales")


@app.route("/api/financial-data", methods=["GET"])
def get_financial_data():
    return dataset_response("financial-data")

# =========================================================
# FINANCIAL RISK PREDICTION
# =========================================================

@app.route("/predict-risk", methods=["POST"])
def predict_risk():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "No input data received"
            }), 400


        # -------------------------------------------------
        # Required financial inputs
        # -------------------------------------------------

        required_fields = [
            "Savings",
            "Loans",
            "Expenses",
            "Loan_Repayment",
            "Income_Records",
            "Business_Income",
            "Net_Balance",
        ]

        missing_fields = [
            field for field in required_fields
            if field not in data
        ]

        if missing_fields:
            return jsonify({
                "status": "error",
                "message": "Missing required fields",
                "missing_fields": missing_fields
            }), 400


        # -------------------------------------------------
        # Convert input values to numbers
        # -------------------------------------------------

        try:

            savings = float(data["Savings"])
            loans = float(data["Loans"])
            expenses = float(data["Expenses"])
            loan_repayment = float(data["Loan_Repayment"])
            income_records = float(data["Income_Records"])
            business_income = float(data["Business_Income"])
            net_balance = float(data["Net_Balance"])

        except (TypeError, ValueError):

            return jsonify({
                "status": "error",
                "message": "All financial inputs must be numeric"
            }), 400


        # -------------------------------------------------
        # Create input DataFrame
        # -------------------------------------------------

        member = pd.DataFrame({
            "Savings": [savings],
            "Loans": [loans],
            "Expenses": [expenses],
            "Loan_Repayment": [loan_repayment],
            "Income_Records": [income_records],
            "Business_Income": [business_income],
            "Net_Balance": [net_balance],
        })


        # -------------------------------------------------
        # SAME FEATURE ENGINEERING USED DURING TRAINING
        # -------------------------------------------------

        member["Loan_Savings_Ratio"] = (
            member["Loans"] /
            (member["Savings"] + 1)
        )

        member["Expense_Income_Ratio"] = (
            member["Expenses"] /
            (member["Income_Records"] + 1)
        )

        member["Repayment_Income_Ratio"] = (
            member["Loan_Repayment"] /
            (member["Income_Records"] + 1)
        )

        member["Business_Income_Ratio"] = (
            member["Business_Income"] /
            (member["Income_Records"] + 1)
        )


        # -------------------------------------------------
        # Arrange columns exactly like training
        # -------------------------------------------------

        model_input = member[FEATURES]


        # -------------------------------------------------
        # PREDICTION
        # -------------------------------------------------

        prediction = model.predict(model_input)[0]


        # -------------------------------------------------
        # PREDICTION PROBABILITIES
        # -------------------------------------------------

        probabilities = model.predict_proba(model_input)[0]

        probability_dict = {
            str(risk): round(float(probability) * 100, 2)
            for risk, probability
            in zip(model.classes_, probabilities)
        }


        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return jsonify({
            "status": "success",
            "prediction": str(prediction),
            "probabilities": probability_dict
        })


    except Exception as error:

        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )