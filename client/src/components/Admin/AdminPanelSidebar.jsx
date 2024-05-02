import React from "react";
import { Link } from "react-router-dom";

const SidebarLink = ({ to, children, isActive }) => {
  return (
    <Link to={to} className={`nav-link ${isActive ? "active" : ""}`}>
      {children}
    </Link>
  );
};

const AdminPanelSidebar = ({ pages }) => {
  return (
    <div className="col-md-3">
      <div
        className="nav flex-column nav-pills"
        id="v-pills-tab"
        role="tablist"
      >
        {pages.map((p) => (
          <SidebarLink
            key={p.path}
            to={`/admin/${p.path}`}
            isActive={window.location.pathname === `/admin/${p.path}`}
          >
            {p.name}
          </SidebarLink>
        ))}
      </div>
    </div>
  );
};

export default AdminPanelSidebar;
