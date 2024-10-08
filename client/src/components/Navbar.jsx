import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ handleLogout, userRole }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Bank Account System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => {
            document
              .getElementById("navbarToggleExternalContent")
              .classList.toggle("show");
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse"
          id="navbarToggleExternalContent"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/account-list">
                Account List
              </Link>
            </li>
            {userRole === "Admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/users">
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
