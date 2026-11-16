
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  PiggyBank,
  Search,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";
import "./Loans.css";

function Loans() {
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState("All Banks");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH FINANCIAL AND MEMBER DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [financialResponse, membersResponse] =
          await Promise.all([
            fetch("http://127.0.0.1:5000/api/financial-data"),
            fetch("http://127.0.0.1:5000/api/members"),
          ]);

        if (!financialResponse.ok) {
          throw new Error("Unable to fetch financial data.");
        }

        if (!membersResponse.ok) {
          throw new Error("Unable to fetch member data.");
        }

        const financialResult = await financialResponse.json();
        const membersResult = await membersResponse.json();

        // IMPORTANT: API RECORDS ARE INSIDE financial_data
        const financialRecords = Array.isArray(financialResult)
          ? financialResult
          : financialResult.financial_data || [];

        const memberRecords = Array.isArray(membersResult)
          ? membersResult
          : membersResult.members || membersResult.data || [];

        // REMOVE EMPTY AND NOTE ROWS
        const validRecords = financialRecords.filter(
          (record) =>
            record.Member_ID &&
            record.Record_ID &&
            typeof record.Loans === "number"
        );

        // MAP API DATA
        const formattedRecords = validRecords.map((record) => {
          const member = memberRecords.find(
            (item) => item.Member_ID === record.Member_ID
          );

          return {
            id: record.Record_ID,
            memberId: record.Member_ID,
            memberName: member?.Name || record.Member_ID,
            contact: member?.Contact || "N/A",
            location: member?.Location || "N/A",
            savings: Number(record.Savings) || 0,
            loan: Number(record.Loans) || 0,
            repayment: Number(record.Loan_Repayment) || 0,
            bank: record.Bank_Linkage || "Not Available",
            creditRating: record.Credit_Rating || "N/A",
          };
        });

        setLoans(formattedRecords);
        setMembers(memberRecords);
      } catch (err) {
        console.error("Loans API Error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // CURRENCY FORMAT
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // TOTAL CALCULATIONS
  const totalLoans = loans.reduce(
    (total, item) => total + item.loan,
    0
  );

  const totalRepayments = loans.reduce(
    (total, item) => total + item.repayment,
    0
  );

  const totalSavings = loans.reduce(
    (total, item) => total + item.savings,
    0
  );

  // BANK FILTER OPTIONS
  const bankOptions = [
    "All Banks",
    ...new Set(loans.map((item) => item.bank)),
  ];

  // SEARCH AND FILTER
  const filteredLoans = useMemo(() => {
    return loans.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.memberName.toLowerCase().includes(searchValue) ||
        item.memberId.toLowerCase().includes(searchValue);

      const matchesBank =
        selectedBank === "All Banks" ||
        item.bank === selectedBank;

      return matchesSearch && matchesBank;
    });
  }, [loans, search, selectedBank]);

  // CHART SCALE
  const maximumLoan = Math.max(
    ...loans.map((item) => item.loan),
    1
  );

  return (
    <div className="loans-page">

      {/* HEADER */}
      <div className="loans-header">
        <div>
          <span className="page-eyebrow">SHG CONNECT</span>
          <h1>Loans Management</h1>

          <p>
            Monitor member loans, repayments and outstanding
            financial balances.
          </p>
        </div>

        <Link
          to="/financial-management"
          className="loans-back-button"
        >
          <ArrowLeft size={17} />
          Financial Management
        </Link>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="loans-message">
          <RefreshCw size={22} className="loading-icon" />
          <p>Loading financial records...</p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="loans-error">
          <h3>Unable to load loan records</h3>
          <p>{error}</p>
          <p>
            Check whether the Flask backend is running on
            port 5000.
          </p>
        </div>
      )}

      {/* MAIN CONTENT */}
      {!loading && !error && (
        <>
          {/* SUMMARY CARDS */}
          <section className="loans-summary-grid">

            <div className="loans-summary-card">
              <div className="loans-summary-icon loan-summary-icon">
                <CreditCard size={24} />
              </div>

              <div>
                <span>Total Loans</span>
                <h2>{formatCurrency(totalLoans)}</h2>
                <p>Total recorded member loans</p>
              </div>
            </div>

            <div className="loans-summary-card">
              <div className="loans-summary-icon repayment-summary-icon">
                <RefreshCw size={24} />
              </div>

              <div>
                <span>Total Repayments</span>
                <h2>{formatCurrency(totalRepayments)}</h2>
                <p>Recorded loan repayments</p>
              </div>
            </div>

            <div className="loans-summary-card">
              <div className="loans-summary-icon savings-summary-icon">
                <PiggyBank size={24} />
              </div>

              <div>
                <span>Total Savings</span>
                <h2>{formatCurrency(totalSavings)}</h2>
                <p>Member savings balance</p>
              </div>
            </div>

            <div className="loans-summary-card">
              <div className="loans-summary-icon members-summary-icon">
                <Wallet size={24} />
              </div>

              <div>
                <span>Members with Records</span>
                <h2>{loans.length}</h2>
                <p>Available financial records</p>
              </div>
            </div>

          </section>

          {/* LOAN ANALYTICS */}
          <section className="loans-section">

            <div className="loans-section-heading">
              <span className="page-eyebrow">ANALYTICS</span>
              <h2>Member-wise Loan Comparison</h2>

              <p>
                Compare recorded loan amounts across members.
              </p>
            </div>

            {loans.length === 0 ? (
              <div className="loans-empty">
                No loan records available.
              </div>
            ) : (
              <div className="loan-chart-container">

                {loans.map((item) => (
                  <div className="loan-chart-row" key={item.id}>

                    <div className="loan-chart-label">
                      <strong>{item.memberName}</strong>
                      <span>{item.memberId}</span>
                    </div>

                    <div className="loan-chart-track">
                      <div
                        className="loan-chart-bar"
                        style={{
                          width: `${(item.loan / maximumLoan) * 100}%`,
                        }}
                      />
                    </div>

                    <strong className="loan-chart-value">
                      {formatCurrency(item.loan)}
                    </strong>

                  </div>
                ))}

              </div>
            )}

          </section>

          {/* LOAN RECORDS */}
          <section className="loans-section">

            <div className="loans-section-heading">
              <span className="page-eyebrow">RECORDS</span>
              <h2>Member Loan Details</h2>

              <p>
                Search and filter SHG member financial records.
              </p>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="loans-filters">

              <div className="loans-search-box">
                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search by member name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                {bankOptions.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>

            </div>

            {/* TABLE */}
            <div className="loans-table-wrapper">

              <table className="loans-table">

                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Member ID</th>
                    <th>Savings</th>
                    <th>Loan Amount</th>
                    <th>Repayment</th>
                    <th>Bank</th>
                    <th>Credit Rating</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLoans.length > 0 ? (
                    filteredLoans.map((item) => (
                      <tr key={item.id}>

                        <td>
                          <strong>{item.memberName}</strong>
                        </td>

                        <td>{item.memberId}</td>

                        <td>{formatCurrency(item.savings)}</td>

                        <td className="loan-amount-cell">
                          {formatCurrency(item.loan)}
                        </td>

                        <td>{formatCurrency(item.repayment)}</td>

                        <td>{item.bank}</td>

                        <td>
                          <span
                            className={`credit-rating rating-${item.creditRating.toLowerCase()}`}
                          >
                            {item.creditRating}
                          </span>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="loans-no-results">
                        No matching loan records found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>

            </div>

            <div className="loans-record-count">
              Showing {filteredLoans.length} of {loans.length} records
            </div>

          </section>
        </>
      )}

    </div>
  );
}

export default Loans;
