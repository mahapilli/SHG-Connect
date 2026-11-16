import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  ShoppingBag,
  Users,
  BarChart3,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import FinancialManagement from "./pages/FinancialManagement";
import FinancialRisk from "./pages/FinancialRisk";
import Members from "./pages/Members";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Dashboard from "./dashboard/Dashboard";
import Savings from "./pages/Savings";
import Loans from "./pages/Loans";
import { useApp } from "./context/useApp";

import "./App.css";

function ProtectedRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== "SHG Member" && user.role !== "Admin") {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
}



/* =========================================================
   HOME PAGE
========================================================= */

function Home() {

  return (

    <div className="app">


      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="navbar">

        <div className="nav-container">


          {/* LOGO */}

          <Link
            to="/"
            className="logo"
          >

            <div className="logo-mark">
              S
            </div>

            <div className="logo-text">

              <strong>
                SHG Connect
              </strong>

              <span>
                Empowering Women
              </span>

            </div>

          </Link>



          {/* NAVIGATION */}

          <nav className="nav-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/marketplace">
              Marketplace
            </Link>

            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/financial-management">
              Finance
            </Link>

            <Link to="/members">
              Members
            </Link>

            <a href="#categories">
              Categories
            </a>

            <a href="#about">
              About
            </a>

            <a href="#features">
              Features
            </a>

          </nav>



          {/* ACTIONS */}

          <div className="nav-actions">

           <Link to="/login" className="login-button">
             Login
           </Link>


            <Link
              to="/cart"
              className="cart-button"
            >

              <ShoppingBag size={19} />

              Cart

            </Link>

          </div>

        </div>

      </header>



      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <main>


        <section className="hero">

          <div className="hero-container">


            <div className="hero-content">

              <span className="hero-eyebrow">
                DIGITAL PLATFORM FOR WOMEN SHGs
              </span>


              <h1>

                Empowering Women.
                <br />

                <span>
                  Connecting Communities.
                </span>

              </h1>


              <p>

                SHG Connect brings women Self-Help Groups
                together with customers through a digital
                marketplace and financial management platform.

              </p>


              <div className="hero-actions">

                <Link
                  to="/marketplace"
                  className="primary-button"
                >

                  Explore Marketplace

                  <ArrowRight size={18} />

                </Link>


                <Link
                  to="/dashboard"
                  className="secondary-button"
                >

                  Open Dashboard

                </Link>

              </div>

            </div>



            <div className="hero-visual">

              <div className="hero-card">

                <div className="hero-card-icon">
                  <Users size={34} />
                </div>

                <h3>
                  Women-led Communities
                </h3>

                <p>
                  Connecting SHGs with digital opportunities.
                </p>

              </div>


              <div className="hero-card hero-card-small">

                <div className="hero-card-icon">
                  <BarChart3 size={28} />
                </div>

                <h3>
                  Smart Management
                </h3>

                <p>
                  Manage business and financial records digitally.
                </p>

              </div>

            </div>

          </div>

        </section>



        {/* ===================================================
            CATEGORIES
        ==================================================== */}

        <section
          id="categories"
          className="categories-section"
        >

          <div className="section-container">

            <span className="section-eyebrow">
              EXPLORE
            </span>

            <h2>
              Product Categories
            </h2>

            <p className="section-description">

              Discover products created and managed by
              women Self-Help Groups.

            </p>


            <div className="category-grid">


              <Link
                to="/marketplace"
                className="category-card"
              >

                <ShoppingBag size={28} />

                <h3>
                  Handicrafts
                </h3>

                <span>
                  Explore products
                </span>

              </Link>



              <Link
                to="/marketplace"
                className="category-card"
              >

                <ShoppingBag size={28} />

                <h3>
                  Food Products
                </h3>

                <span>
                  Explore products
                </span>

              </Link>



              <Link
                to="/marketplace"
                className="category-card"
              >

                <ShoppingBag size={28} />

                <h3>
                  Clothing
                </h3>

                <span>
                  Explore products
                </span>

              </Link>



              <Link
                to="/marketplace"
                className="category-card"
              >

                <ShoppingBag size={28} />

                <h3>
                  Home Products
                </h3>

                <span>
                  Explore products
                </span>

              </Link>

            </div>

          </div>

        </section>



        {/* ===================================================
            FEATURED PRODUCTS
        ==================================================== */}

        <section className="featured-section">

          <div className="section-container">


            <div className="section-heading">

              <div>

                <span className="section-eyebrow">
                  MARKETPLACE
                </span>

                <h2>
                  Featured Products
                </h2>

              </div>


              <Link
                to="/marketplace"
                className="text-link"
              >

                View Marketplace

                <ArrowRight size={16} />

              </Link>

            </div>



            <div className="featured-empty">

              <ShoppingBag size={40} />

              <h3>
                No products available yet
              </h3>

              <p>

                Products will appear here when real
                SHG product records are connected.

              </p>

            </div>

          </div>

        </section>



        {/* ===================================================
            FEATURES
        ==================================================== */}

        <section
          id="features"
          className="features-section"
        >

          <div className="section-container">

            <span className="section-eyebrow">
              PLATFORM FEATURES
            </span>

            <h2>
              Everything SHGs Need
            </h2>


            <div className="features-grid">


              <div className="feature-card">

                <div className="feature-icon">
                  <ShoppingBag size={25} />
                </div>

                <h3>
                  Digital Marketplace
                </h3>

                <p>

                  Showcase SHG products and connect
                  directly with customers.

                </p>

              </div>



              <div className="feature-card">

                <div className="feature-icon">
                  <BarChart3 size={25} />
                </div>

                <h3>
                  Financial Management
                </h3>

                <p>

                  Track savings, loans, income,
                  expenses and transactions.

                </p>

              </div>



              <div className="feature-card">

                <div className="feature-icon">
                  <Users size={25} />
                </div>

                <h3>
                  Member Management
                </h3>

                <p>

                  Manage SHG members and monitor
                  participation.

                </p>

              </div>



              <div className="feature-card">

                <div className="feature-icon">
                  <ShieldCheck size={25} />
                </div>

                <h3>
                  Transparent Records
                </h3>

                <p>

                  Keep organized digital records
                  for better transparency.

                </p>

              </div>

            </div>

          </div>

        </section>



        {/* ===================================================
            ABOUT
        ==================================================== */}

        <section
          id="about"
          className="about-section"
        >

          <div className="section-container">

            <div className="about-content">

              <span className="section-eyebrow">
                ABOUT SHG CONNECT
              </span>

              <h2>
                Building Digital Opportunities
                for Women SHGs
              </h2>

              <p>

                SHG Connect is designed to bring
                marketplace functionality and financial
                management into one digital platform for
                Women Self-Help Groups.

              </p>

              <p>

                The platform is designed to support
                product management, customer orders,
                financial records, member management,
                and data-driven insights.

              </p>

            </div>

          </div>

        </section>

      </main>



      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">

        <div className="footer-container">


          <div className="footer-brand">

            <div className="logo">

              <div className="logo-mark">
                S
              </div>

              <div className="logo-text">

                <strong>
                  SHG Connect
                </strong>

                <span>
                  Empowering Women
                </span>

              </div>

            </div>


            <p>

              A digital platform connecting Women
              Self-Help Groups with customers and
              financial management tools.

            </p>

          </div>



          <div className="footer-links">

            <h4>
              Platform
            </h4>

            <Link to="/marketplace">
              Marketplace
            </Link>

            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/financial-management">
              Financial Management
            </Link>

            <Link to="/members">
              Members
            </Link>

            <Link to="/analytics">
              Analytics
            </Link>

          </div>



          <div className="footer-links">

            <h4>
              Explore
            </h4>

            <a href="#features">
              Features
            </a>

            <a href="#categories">
              Categories
            </a>

            <a href="#about">
              About
            </a>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 SHG Connect. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}



/* =========================================================
   APPLICATION ROUTES
========================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />
        <Route path="/login" element={<Login />} />

        {/* MARKETPLACE */}

        <Route
          path="/marketplace"
          element={<Marketplace />}
        />


        {/* CART */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* PRODUCT DETAILS */}

        <Route
          path="/product/:productId"
          element={<ProductDetails />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />


        {/* FINANCIAL MANAGEMENT */}

        <Route
          path="/financial-management"
          element={<ProtectedRoute><FinancialManagement /></ProtectedRoute>}
        />
         
         <Route
           path="/financial-risk"
          element={<ProtectedRoute><FinancialRisk /></ProtectedRoute>}
        />

        {/* MEMBERS */}

        <Route
          path="/members"
          element={<ProtectedRoute><Members /></ProtectedRoute>}
        />
         <Route path="/savings" element={<ProtectedRoute><Savings /></ProtectedRoute>} />
         <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />

        {/* ANALYTICS */}

        <Route
          path="/analytics"
          element={<ProtectedRoute><Analytics /></ProtectedRoute>}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;