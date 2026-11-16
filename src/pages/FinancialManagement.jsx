
import {
  Wallet,
  ArrowLeft,
  PiggyBank,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  ReceiptText,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function FinancialManagement() {
  const [financialData, setFinancialData] = useState({
    savings: null,
    loans: null,
    income: null,
    expenses: null,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/financial-data")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load financial records.");
        return response.json();
      })
      .then((data) => {
        const records = data.financial_data || [];
        setFinancialData({
          savings: records.reduce((sum, item) => sum + Number(item.Savings || 0), 0),
          loans: records.reduce((sum, item) => sum + Number(item.Loans || 0), 0),
          income: records.reduce((sum, item) => sum + Number(item.Business_Income || 0), 0),
          expenses: records.reduce((sum, item) => sum + Number(item.Expenses || 0), 0),
        });
        setTransactions(records.slice(0, 6).map((item) => ({
          id: item.Record_ID,
          description: `${item.Member_ID} financial record`,
          date: item.Record_Date || "Latest record",
          amount: `₹${Number(item.Monthly_Profit || 0).toLocaleString("en-IN")}`,
        })));
      })
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false));
  }, []);

  const hasFinancialData = !loading && Object.values(financialData).some(
    (value) => value !== null
  );

  return (
    <div className="financial-page">

      {/* HEADER */}
      <div className="financial-header">
        <div>
          <span className="page-eyebrow">SHG CONNECT</span>

          <h1>Financial Management</h1>

          <p>
            Manage savings, loans, income, expenses,
            and financial activities of your Self-Help Group.
          </p>
        </div>

        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={17} />
          Dashboard
        </Link>
      </div>

      {/* FINANCIAL OVERVIEW */}
      <section className="financial-section">
        <div className="financial-section-heading">
          <div>
            <span className="page-eyebrow">OVERVIEW</span>
            <h2>Financial Overview</h2>
          </div>
        </div>

        <div className="financial-overview-grid">

          {/* SAVINGS */}
          <div className="financial-overview-card">
            <div className="financial-overview-icon savings-icon">
              <PiggyBank size={23} />
            </div>

            <div className="financial-overview-content">
              <span>Total Savings</span>

              <strong>
                {financialData.savings !== null
                  ? `₹${financialData.savings.toLocaleString("en-IN")}`
                  : "—"}
              </strong>

              <p>Group savings</p>
            </div>
          </div>

          {/* LOANS */}
          <div className="financial-overview-card">
            <div className="financial-overview-icon loan-icon">
              <CreditCard size={23} />
            </div>

            <div className="financial-overview-content">
              <span>Total Loans</span>

              <strong>
                {financialData.loans !== null
                  ? `₹${financialData.loans.toLocaleString("en-IN")}`
                  : "—"}
              </strong>

              <p>Outstanding loans</p>
            </div>
          </div>

          {/* INCOME */}
          <div className="financial-overview-card">
            <div className="financial-overview-icon income-icon">
              <ArrowUpRight size={23} />
            </div>

            <div className="financial-overview-content">
              <span>Total Income</span>

              <strong>
                {financialData.income !== null
                  ? `₹${financialData.income.toLocaleString("en-IN")}`
                  : "—"}
              </strong>

              <p>Recorded income</p>
            </div>
          </div>

          {/* EXPENSES */}
          <div className="financial-overview-card">
            <div className="financial-overview-icon expense-icon">
              <ArrowDownRight size={23} />
            </div>

            <div className="financial-overview-content">
              <span>Total Expenses</span>

              <strong>
                {financialData.expenses !== null
                  ? `₹${financialData.expenses.toLocaleString("en-IN")}`
                  : "—"}
              </strong>

              <p>Recorded expenses</p>
            </div>
          </div>

        </div>
      </section>

      {/* FINANCIAL ACTIVITIES */}
      <section className="financial-section">

        <div className="financial-section-heading">
          <div>
            <span className="page-eyebrow">MANAGEMENT</span>
            <h2>Financial Activities</h2>
          </div>
        </div>

        <div className="financial-actions">

          {/* SAVINGS */}
          <Link
            to="/savings"
            className="financial-action-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            <div className="financial-action-icon">
              <PiggyBank size={22} />
            </div>

            <div className="financial-action-content">
              <h3>Savings</h3>

              <p>
                Manage SHG member savings and contribution
                records.
              </p>
            </div>

            <ArrowRight
              size={19}
              className="financial-action-arrow"
            />
          </Link>

          {/* LOANS - ONLY ONE CLICKABLE CARD */}
          <Link
            to="/loans"
            className="financial-action-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            <div className="financial-action-icon">
              <CreditCard size={22} />
            </div>

            <div className="financial-action-content">
              <h3>Loans</h3>

              <p>
                Track loans, repayments, and outstanding
                balances.
              </p>
            </div>

            <ArrowRight
              size={19}
              className="financial-action-arrow"
            />
          </Link>

          {/* INCOME */}
          <div className="financial-action-card">
            <div className="financial-action-icon">
              <ArrowUpRight size={22} />
            </div>

            <div>
              <h3>Income</h3>

              <p>
                Maintain income records from SHG business
                activities.
              </p>
            </div>
          </div>

          {/* EXPENSES */}
          <div className="financial-action-card">
            <div className="financial-action-icon">
              <ArrowDownRight size={22} />
            </div>

            <div>
              <h3>Expenses</h3>

              <p>
                Record and monitor expenses related to SHG
                activities.
              </p>
            </div>
          </div>

          {/* FINANCIAL RISK PREDICTION */}
          <Link
            to="/financial-risk"
            className="financial-action-card financial-risk-action"
          >
            <div className="financial-action-icon">
              <ShieldCheck size={22} />
            </div>

            <div className="financial-action-content">
              <h3>Financial Risk Prediction</h3>

              <p>
                Use the trained ML model to assess financial
                risk using SHG financial information.
              </p>
            </div>

            <ArrowRight
              size={19}
              className="financial-action-arrow"
            />
          </Link>

        </div>
      </section>

      {/* RECENT TRANSACTIONS */}
      <section className="financial-section">

        <div className="financial-section-heading">
          <div>
            <span className="page-eyebrow">TRANSACTIONS</span>
            <h2>Recent Transactions</h2>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="financial-empty">

            <div className="financial-empty-icon">
              <ReceiptText size={38} />
            </div>

            <h3>No financial transactions available</h3>

            <p>
              Financial transactions will appear here after
              real financial records are connected to the
              SHG Connect backend.
            </p>

          </div>
        ) : (
          <div className="financial-transactions">

            {transactions.map((transaction) => (
              <div
                className="financial-transaction"
                key={transaction.id}
              >
                <div>
                  <h3>{transaction.description}</h3>
                  <span>{transaction.date}</span>
                </div>

                <strong>{transaction.amount}</strong>
              </div>
            ))}

          </div>
        )}

      </section>

      {/* DATA STATUS */}
      <section className="financial-data-status">

        <Wallet size={25} />

        <div>
          <h3>
            {hasFinancialData
            ? "Financial data connected"
            : error || "Loading financial records"}
          </h3>

          <p>
            {hasFinancialData
              ? "Financial information is available from the Flask dataset API."
              : "Connect the Flask backend on port 5000 to load financial records."}
          </p>
        </div>

      </section>

      {/* ML MODEL STATUS */}
      <section className="financial-ml-status">

        <div className="financial-ml-status-icon">
          <ShieldCheck size={24} />
        </div>

        <div>
          <span className="page-eyebrow">MACHINE LEARNING</span>

          <h3>Financial Risk Prediction</h3>

          <p>
            The trained SHG financial risk model is connected
            through the SHG Connect ML API.
          </p>
        </div>

        <Link
          to="/financial-risk"
          className="financial-ml-button"
        >
          Open Prediction
          <ArrowRight size={17} />
        </Link>

      </section>

    </div>
  );
}

export default FinancialManagement;
