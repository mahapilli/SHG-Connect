import {
  BarChart3,
  ArrowLeft,
  TrendingUp,
  ShoppingBag,
  Wallet,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";


function Analytics() {

  /*
   * =========================================================
   * ANALYTICS DATA
   * =========================================================
   *
   * Real analytics data will be calculated from:
   *
   * - Products
   * - Orders
   * - Sales
   * - Savings
   * - Loans
   * - Expenses
   * - Member activity
   *
   * These values are intentionally empty until the
   * backend/database is connected.
   */

  const analyticsData = {
    salesGrowth: null,
    totalSales: null,
    totalOrders: null,
    activeMembers: null,
  };


  return (

    <div className="analytics-page">


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="analytics-header">

        <div>

          <span className="page-eyebrow">
            SHG CONNECT
          </span>

          <h1>
            Analytics
          </h1>

          <p>
            Monitor business performance and financial
            activity using real SHG data.
          </p>

        </div>


        <Link
          to="/dashboard"
          className="back-button"
        >

          <ArrowLeft size={17} />

          Dashboard

        </Link>

      </div>



      {/* =====================================================
          OVERVIEW
      ====================================================== */}

      <section className="analytics-section">

        <div className="analytics-section-heading">

          <div>

            <span className="page-eyebrow">
              OVERVIEW
            </span>

            <h2>
              Performance Overview
            </h2>

          </div>

        </div>


        <div className="analytics-stats">


          {/* SALES GROWTH */}

          <div className="analytics-stat">

            <div className="analytics-stat-icon">

              <TrendingUp size={21} />

            </div>


            <div>

              <span>
                Sales Growth
              </span>

              <strong>
                {analyticsData.salesGrowth ?? "—"}
              </strong>

            </div>

          </div>



          {/* TOTAL SALES */}

          <div className="analytics-stat">

            <div className="analytics-stat-icon">

              <Wallet size={21} />

            </div>


            <div>

              <span>
                Total Sales
              </span>

              <strong>
                {analyticsData.totalSales ?? "—"}
              </strong>

            </div>

          </div>



          {/* ORDERS */}

          <div className="analytics-stat">

            <div className="analytics-stat-icon">

              <ShoppingBag size={21} />

            </div>


            <div>

              <span>
                Total Orders
              </span>

              <strong>
                {analyticsData.totalOrders ?? "—"}
              </strong>

            </div>

          </div>



          {/* MEMBERS */}

          <div className="analytics-stat">

            <div className="analytics-stat-icon">

              <Users size={21} />

            </div>


            <div>

              <span>
                Active Members
              </span>

              <strong>
                {analyticsData.activeMembers ?? "—"}
              </strong>

            </div>

          </div>

        </div>

      </section>



      {/* =====================================================
          ANALYTICS AREA
      ====================================================== */}

      <section className="analytics-section">

        <div className="analytics-empty">

          <div className="analytics-empty-icon">

            <BarChart3 size={42} />

          </div>


          <h3>
            Analytics data not available yet
          </h3>


          <p>

            Charts, sales trends, financial analysis,
            and performance insights will appear here
            after real SHG Connect data is connected.

          </p>

        </div>

      </section>



      {/* =====================================================
          DATA STATUS
      ====================================================== */}

      <section className="analytics-data-status">

        <BarChart3 size={25} />


        <div>

          <h3>
            Analytics data connection pending
          </h3>


          <p>

            Analytics will be generated from real
            products, orders, transactions, savings,
            loans, expenses, and member records.

          </p>

        </div>

      </section>

    </div>

  );
}


export default Analytics;