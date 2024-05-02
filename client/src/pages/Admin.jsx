import React from "react";
import { Link, useParams } from "react-router-dom";
import AdminPanelSidebar from "../components/Admin/AdminPanelSidebar";

const Admin = () => {
  const { page } = useParams();
  const pages = [
    { name: "Users", path: "users" },
    { name: "Accounts", path: "accounts" },
    { name: "Transactions", path: "transactions" },
    { name: "Deposit Options", path: "deposit-options" },
  ];

  return (
    <div className="mb-3">
      <h1>Admin Panel - {pages.find((p) => p.path === page).name}</h1>
      <div className="row">
        <AdminPanelSidebar pages={pages} />
        <div className="col-md-9 text-center p-5">
          {pages.map((p) => {
            if (p.path === page) {
              return (
                <div key={p.path}>
                  <h2>{p.name}</h2>
                  <p>Content for {p.name}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Admin;
