
import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  Users,
  TrendingUp,
  ArrowRight,
  Home,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../context/useApp";

function Dashboard() {
  const { user, logout } = useApp();
  const isMember = user?.role === "SHG Member";
  const isAdmin = user?.role === "Admin";
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSavings: 0,
    totalLoans: 0,
  });
  const [dataStatus, setDataStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("http://127.0.0.1:5000/api/products"),
      fetch("http://127.0.0.1:5000/api/sales"),
      fetch("http://127.0.0.1:5000/api/financial-data"),
    ])
      .then(async (responses) => {
        if (responses.some((response) => !response.ok)) throw new Error("Unable to load dashboard data.");
        return Promise.all(responses.map((response) => response.json()));
      })
      .then(([products, sales, finance]) => {
        if (!active) return;
        const records = finance.financial_data || [];
        setDashboardData({
          totalProducts: products.products?.length || 0,
          totalOrders: sales.sales?.length || 0,
          totalSavings: records.reduce((sum, item) => sum + Number(item.Savings || 0), 0),
          totalLoans: records.reduce((sum, item) => sum + Number(item.Loans || 0), 0),
        });
        setDataStatus("connected");
      })
      .catch(() => {
        if (active) setDataStatus("error");
      });
    return () => { active = false; };
  }, []);

  const hasFinancialData = dataStatus === "connected" && (isMember || isAdmin);

  const quickAccess = [
    {
      title: "Marketplace",
      description: isMember ? "Add products and manage customer orders." : "Browse products and manage customer orders.",
      icon: ShoppingBag,
      link: "/marketplace",
    },
    {
      title: "Financial Management",
      description: "Track savings, loans, income and expenses.",
      icon: Wallet,
      link: "/financial-management",
    },
    {
      title: isMember ? "My SHG Members" : "SHG Members",
      description: "Manage members and participation records.",
      icon: Users,
      link: "/members",
    },
    {
      title: isMember ? "Business Insights" : "Analytics",
      description: "View business and financial performance.",
      icon: TrendingUp,
      link: "/analytics",
    },
  ];

  const stats = [
    {
      title: "Total Products",
      value: isMember || isAdmin ? dashboardData.totalProducts : "—",
      icon: ShoppingBag,
    },
    {
      title: "Total Orders",
      value: isMember || isAdmin ? dashboardData.totalOrders : "—",
      icon: ShoppingBag,
    },
    {
      title: "Total Savings",
      value: isMember || isAdmin ? `₹${dashboardData.totalSavings.toLocaleString("en-IN")}` : "—",
      icon: Wallet,
    },
    {
      title: "Total Loans",
      value: isMember || isAdmin ? `₹${dashboardData.totalLoans.toLocaleString("en-IN")}` : "—",
      icon: Wallet,
    },
  ];

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">

        <div>
          <span className="page-eyebrow">SHG CONNECT</span>

          <h1>{isMember ? "Good morning, Meena" : "Welcome back"}</h1>

          <p>
            {isMember
              ? "Your Sakhi Women SHG workspace is ready for today."
              : "Explore handmade products and manage your SHG Connect activity."}
          </p>
        </div>

        {/* HOME BUTTON */}
        <div className="dashboard-header-actions">
          <span className="dashboard-user-chip">{user?.initials || "GU"} {user?.name || "Guest"}</span>
          <Link to="/" className="back-button"><Home size={17} /> Home</Link>
          {user && <button className="back-button" onClick={() => { logout(); }}><LogOut size={17} /> Sign out</button>}
        </div>

      </div>

      {/* QUICK ACCESS */}
      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <span className="page-eyebrow">QUICK ACCESS</span>
            <h2>{isMember ? "Your SHG workspace" : "Start exploring"}</h2>
          </div>
        </div>

        <div className="dashboard-card-grid">

          {quickAccess.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                to={item.link}
                className="dashboard-card"
                key={item.title}
              >
                <div className="dashboard-card-icon">
                  <Icon size={24} />
                </div>

                <div className="dashboard-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <ArrowRight
                  size={20}
                  className="dashboard-card-arrow"
                />
              </Link>
            );
          })}

        </div>
      </section>

      {/* OVERVIEW */}
      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <span className="page-eyebrow">OVERVIEW</span>
            <h2>{isMember ? "Sakhi Women SHG at a glance" : "Your activity"}</h2>
          </div>
        </div>

        <div className="dashboard-stats">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div className="dashboard-stat" key={item.title}>

                <div className="dashboard-stat-icon">
                  <Icon size={21} />
                </div>

                <div className="dashboard-stat-info">
                  <span>{item.title}</span>

                  <strong className="dashboard-stat-value">
                    {item.value ?? "—"}
                  </strong>
                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* DATA STATUS */}
      <section className="dashboard-data-status">

        <LayoutDashboard size={25} />

        <div>
          <h3>          {dataStatus === "connected" ? "Your workspace is ready" : "Connecting to SHG Connect"}</h3>

          <p>
            {dataStatus === "connected"
              ? "Manage products, finances and members from one place."
              : dataStatus === "error"
                ? "The backend is unavailable. Start Flask on port 5000 and refresh this page."
                : "Loading your marketplace and financial records..."}
          </p>
        </div>

      </section>

    </div>
  );
}

export default Dashboard;
