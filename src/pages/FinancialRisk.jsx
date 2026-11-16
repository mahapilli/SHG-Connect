import {
  ShieldCheck,
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Activity,
  Loader2,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useState } from "react";

function FinancialRisk() {
  const [formData, setFormData] = useState({
    Savings: "",
    Loans: "",
    Expenses: "",
    Loan_Repayment: "",
    Income_Records: "",
    Business_Income: "",
    Net_Balance: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [probabilities, setProbabilities] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setPrediction(null);
    setProbabilities(null);

    try {
      const body = {
        Savings: Number(formData.Savings),
        Loans: Number(formData.Loans),
        Expenses: Number(formData.Expenses),
        Loan_Repayment: Number(formData.Loan_Repayment),
        Income_Records: Number(formData.Income_Records),
        Business_Income: Number(formData.Business_Income),
        Net_Balance: Number(formData.Net_Balance),
      };

      const response = await fetch(
        "http://127.0.0.1:5000/predict-risk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(
          data.message || "Unable to get financial risk prediction."
        );
      }

      setPrediction(data.prediction);
      setProbabilities(data.probabilities);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the SHG Connect ML backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPredictionClass = () => {
    if (!prediction) return "";

    if (prediction.toLowerCase().includes("low")) {
      return "risk-low";
    }

    if (prediction.toLowerCase().includes("medium")) {
      return "risk-medium";
    }

    return "risk-high";
  };

  return (
    <div className="financial-risk-page">
      <div className="financial-risk-header">
        <div>
          <span className="page-eyebrow">SHG CONNECT ML</span>

          <h1>Financial Risk Prediction</h1>

          <p>
            Evaluate financial risk using the trained SHG
            financial risk model.
          </p>
        </div>

        <Link
          to="/financial-management"
          className="back-button"
        >
          <ArrowLeft size={17} />
          Financial Management
        </Link>
      </div>

      <div className="financial-risk-layout">
        <section className="financial-risk-card">
          <div className="financial-risk-card-header">
            <div className="financial-risk-icon">
              <ShieldCheck size={24} />
            </div>

            <div>
              <span className="page-eyebrow">
                RISK ASSESSMENT
              </span>

              <h2>Enter Financial Information</h2>

              <p>
                Enter the financial values to generate a
                risk prediction from the trained model.
              </p>
            </div>
          </div>

          <form
            className="financial-risk-form"
            onSubmit={handleSubmit}
          >
            <div className="risk-form-grid">
              <div className="risk-field">
                <label htmlFor="Savings">Savings</label>

                <input
                  id="Savings"
                  name="Savings"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.Savings}
                  onChange={handleChange}
                  placeholder="Enter savings"
                  required
                />
              </div>

              <div className="risk-field">
                <label htmlFor="Loans">Loans</label>

                <input
                  id="Loans"
                  name="Loans"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.Loans}
                  onChange={handleChange}
                  placeholder="Enter loans"
                  required
                />
              </div>

              <div className="risk-field">
                <label htmlFor="Expenses">Expenses</label>

                <input
                  id="Expenses"
                  name="Expenses"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.Expenses}
                  onChange={handleChange}
                  placeholder="Enter expenses"
                  required
                />
              </div>

              <div className="risk-field">
                <label htmlFor="Loan_Repayment">
                  Loan Repayment
                </label>

                <input
                  id="Loan_Repayment"
                  name="Loan_Repayment"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.Loan_Repayment}
                  onChange={handleChange}
                  placeholder="Enter repayment"
                  required
                />
              </div>

              <div className="risk-field">
                <label htmlFor="Income_Records">
                  Income Records
                </label>

                <input
                  id="Income_Records"
                  name="Income_Records"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.Income_Records}
                  onChange={handleChange}
                  placeholder="Enter income"
                  required
                />
              </div>

              <div className="risk-field">
                <label htmlFor="Business_Income">
                  Business Income
                </label>

                <input
                  id="Business_Income"
                  name="Business_Income"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.Business_Income}
                  onChange={handleChange}
                  placeholder="Enter business income"
                  required
                />
              </div>

              <div className="risk-field risk-field-full">
                <label htmlFor="Net_Balance">
                  Net Balance
                </label>

                <input
                  id="Net_Balance"
                  name="Net_Balance"
                  type="number"
                  step="any"
                  value={formData.Net_Balance}
                  onChange={handleChange}
                  placeholder="Enter net balance"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="risk-predict-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={19}
                    className="risk-loading-icon"
                  />
                  Predicting...
                </>
              ) : (
                <>
                  <Activity size={19} />
                  Predict Financial Risk
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="risk-error">
              <AlertTriangle size={21} />

              <div>
                <h3>Prediction Error</h3>

                <p>{error}</p>
              </div>
            </div>
          )}
        </section>

        <section className="risk-result-card">
          <div className="risk-result-header">
            <div className="risk-result-icon">
              <TrendingUp size={23} />
            </div>

            <div>
              <span className="page-eyebrow">
                MODEL RESULT
              </span>

              <h2>Risk Prediction</h2>
            </div>
          </div>

          {!prediction ? (
            <div className="risk-result-empty">
              <ShieldCheck size={42} />

              <h3>No prediction yet</h3>

              <p>
                Submit the financial information to receive
                a prediction from the trained ML model.
              </p>
            </div>
          ) : (
            <div className="risk-result-content">
              <div
                className={`risk-prediction ${getPredictionClass()}`}
              >
                <span>Predicted Risk</span>

                <strong>{prediction}</strong>
              </div>

              {probabilities && (
                <div className="risk-probabilities">
                  <h3>Prediction Probabilities</h3>

                  {Object.entries(probabilities).map(
                    ([risk, probability]) => (
                      <div
                        className="probability-row"
                        key={risk}
                      >
                        <div className="probability-label">
                          <span>{risk}</span>
                          <strong>
                            {probability}%
                          </strong>
                        </div>

                        <div className="probability-bar">
                          <div
                            className="probability-fill"
                            style={{
                              width: `${probability}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="risk-model-status">
                <ShieldCheck size={20} />

                <div>
                  <h3>Trained ML Model Connected</h3>

                  <p>
                    This result was returned by the SHG
                    Connect financial risk prediction API.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default FinancialRisk;