//App.jsx
import React, { useState } from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import AccountList from "./pages/AccountList";
import TransactionHistory from "./pages/TransactionHistory";
import Assets from "./pages/Assets";
import { Logout } from "./service/AuthService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Invoices from "./pages/Invoices";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  React.useEffect(() => {
    const cookie = document.cookie;
    if (cookie.includes("user")) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    const response = await Logout();
    // Delete the cookie if the response is successful
    if (response.status === 200) {
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setLoggedIn(false);
    }
  };

  const authenticatedRoutes = (
    <div>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Bank Account and Invoices System
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/account-list">
                    Account List
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/transaction-history">
                    Transaction History
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/assets">
                    Assets
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/invoices">
                    Invoices
                  </Link>
                </li>
              </ul>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
      <section className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account-list" element={<AccountList />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </section>
    </div>
  );
  const Footer = () => {
    return (
      <footer className="footer mt-auto py-3 bg-light">
        <div className="container text-center">
          <span className="text-muted">© 2024 Bank Account and Invoices System. All rights reserved to Ömercan and Haydar Taha. </span>
        </div>
      </footer>
    );
  };
  

  const unauthenticatedRoutes = (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/sign-in" />} />
    </Routes>
  );

  return (
    <div>
      {loggedIn ? authenticatedRoutes : unauthenticatedRoutes}
      <Footer />
    </div>
  );
}

export default App;
