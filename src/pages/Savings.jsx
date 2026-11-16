
import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Search,
  RefreshCw,
  Landmark,
} from "lucide-react";
import "./Savings.css";

const API_URL = "http://127.0.0.1:5000";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function Savings() {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [financialResponse, membersResponse] = await Promise.all([
        fetch(`${API_URL}/api/financial-data`),
        fetch(`${API_URL}/api/members`),
      ]);

      if (!financialResponse.ok || !membersResponse.ok) {
        throw new Error("Unable to fetch savings data.");
      }

      const financialData = await financialResponse.json();
      const membersData = await membersResponse.json();

      if (
        financialData.status !== "success" ||
        membersData.status !== "success"
      ) {
        throw new Error("API returned an unsuccessful response.");
      }

      const validRecords = (financialData.financial_data || [])
        .filter((item) => item.Member_ID && item.Record_ID)
        .map((item) => ({
          id: item.Record_ID,
          memberId: item.Member_ID,
          savings: Number(item.Savings) || 0,
          loans: Number(item.Loans) || 0,
          income: Number(item.Business_Income) || 0,
          expenses: Number(item.Expenses) || 0,
          profit: Number(item.Monthly_Profit) || 0,
          repayment: Number(item.Loan_Repayment) || 0,
          bank: item.Bank_Linkage || "Not provided",
          creditRating: item.Credit_Rating || "N/A",
          recordDate: item.Record_Date,
        }));

      setRecords(validRecords);
      setMembers(membersData.members || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const memberMap = useMemo(() => {
    return Object.fromEntries(
      members.map((member) => [
        member.Member_ID,
        member.Name || "Unknown Member",
      ])
    );
  }, [members]);

  const totalSavings = records.reduce(
    (sum, record) => sum + record.savings,
    0
  );

  const totalLoans = records.reduce(
    (sum, record) => sum + record.loans,
    0
  );

  const totalMembers = new Set(records.map((record) => record.memberId)).size;

  const banks = [
    "All",
    ...new Set(records.map((record) => record.bank)),
  ];

  const filteredRecords = records.filter((record) => {
    const memberName = memberMap[record.memberId] || "";

    const matchesSearch =
      record.memberId.toLowerCase().includes(search.toLowerCase()) ||
      memberName.toLowerCase().includes(search.toLowerCase());

    const matchesBank =
      selectedBank === "All" || record.bank === selectedBank;

    return matchesSearch && matchesBank;
  });

  const maxSavings = Math.max(
    ...filteredRecords.map((record) => record.savings),
    1
  );

  const bankTotals = records.reduce((result, record) => {
    result[record.bank] = (result[record.bank] || 0) + record.savings;
    return result;
  }, {});

  const bankEntries = Object.entries(bankTotals).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="savings-page">
      <div className="savings-header">
        <div>
          <p className="savings-eyebrow">FINANCIAL MANAGEMENT</p>
          <h1>Savings Management</h1>
          <p className="savings-subtitle">
            Monitor member savings, loans and financial records.
          </p>
        </div>

        <button className="savings-refresh" onClick={fetchData}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="savings-error">
          {error}
          <button onClick={fetchData}>Try again</button>
        </div>
      )}

      {loading ? (
        <div className="savings-loading">Loading financial records...</div>
      ) : (
        <>
          <div className="savings-stats">
            <div className="savings-stat-card">
              <div className="savings-stat-icon purple">
                <PiggyBank size={23} />
              </div>
              <div>
                <p>Total Savings</p>
                <h2>{formatCurrency(totalSavings)}</h2>
              </div>
            </div>

            <div className="savings-stat-card">
              <div className="savings-stat-icon blue">
                <CreditCard size={23} />
              </div>
              <div>
                <p>Total Loans</p>
                <h2>{formatCurrency(totalLoans)}</h2>
              </div>
            </div>

            <div className="savings-stat-card">
              <div className="savings-stat-icon green">
                <Wallet size={23} />
              </div>
              <div>
                <p>Members with Records</p>
                <h2>{totalMembers}</h2>
              </div>
            </div>

            <div className="savings-stat-card">
              <div className="savings-stat-icon orange">
                <TrendingUp size={23} />
              </div>
              <div>
                <p>Average Savings</p>
                <h2>
                  {formatCurrency(
                    totalMembers ? totalSavings / totalMembers : 0
                  )}
                </h2>
              </div>
            </div>
          </div>

          <div className="savings-content-grid">
            <section className="savings-panel">
              <div className="savings-panel-heading">
                <div>
                  <h2>Member-wise Savings</h2>
                  <p>Compare savings across SHG members</p>
                </div>
              </div>

              {filteredRecords.length === 0 ? (
                <p className="savings-empty">No matching records found.</p>
              ) : (
                <div className="savings-chart">
                  {filteredRecords.map((record) => (
                    <div className="savings-bar-row" key={record.id}>
                      <div className="savings-bar-label">
                        <span>{record.memberId}</span>
                        <strong>
                          {formatCurrency(record.savings)}
                        </strong>
                      </div>
                      <div className="savings-bar-track">
                        <div
                          className="savings-bar-fill"
                          style={{
                            width: `${(record.savings / maxSavings) * 100}%`,
                          }}
                        />
                      </div>
                      <small>
                        {memberMap[record.memberId] || "Unknown Member"}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="savings-panel bank-panel">
              <div className="savings-panel-heading">
                <div>
                  <h2>Bank-wise Savings</h2>
                  <p>Savings grouped by bank linkage</p>
                </div>
                <Landmark size={22} />
              </div>

              <div className="bank-list">
                {bankEntries.map(([bank, amount]) => (
                  <div className="bank-item" key={bank}>
                    <div className="bank-item-info">
                      <span>{bank}</span>
                      <strong>{formatCurrency(amount)}</strong>
                    </div>
                    <div className="bank-progress">
                      <div
                        style={{
                          width: `${totalSavings ? (amount / totalSavings) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="savings-panel savings-table-panel">
            <div className="savings-panel-heading table-heading">
              <div>
                <h2>Member Financial Records</h2>
                <p>{filteredRecords.length} records found</p>
              </div>
            </div>

            <div className="savings-toolbar">
              <div className="savings-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search member ID or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank === "All" ? "All Banks" : bank}
                  </option>
                ))}
              </select>
            </div>

            <div className="savings-table-wrapper">
              <table className="savings-table">
                <thead>
                  <tr>
                    <th>Record ID</th>
                    <th>Member</th>
                    <th>Bank</th>
                    <th>Savings</th>
                    <th>Loans</th>
                    <th>Income</th>
                    <th>Expenses</th>
                    <th>Profit</th>
                    <th>Credit Rating</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>
                        <strong>
                          {memberMap[record.memberId] || record.memberId}
                        </strong>
                        <small className="member-id">
                          {record.memberId}
                        </small>
                      </td>
                      <td>{record.bank}</td>
                      <td className="amount-cell">
                        {formatCurrency(record.savings)}
                      </td>
                      <td>{formatCurrency(record.loans)}</td>
                      <td>{formatCurrency(record.income)}</td>
                      <td>{formatCurrency(record.expenses)}</td>
                      <td
                        className={
                          record.profit < 0 ? "negative-profit" : "positive-profit"
                        }
                      >
                        {formatCurrency(record.profit)}
                      </td>
                      <td>
                        <span className="credit-badge">
                          {record.creditRating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRecords.length === 0 && (
                <p className="savings-empty">No financial records available.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Savings;
