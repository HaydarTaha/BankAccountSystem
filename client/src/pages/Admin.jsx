import React from "react";
import { useParams } from "react-router-dom";
import AdminPanelSidebar from "../components/Admin/AdminPanelSidebar";
import {
  createData,
  getAllData,
  updateData,
  deleteData,
} from "../service/Crud";
import Table from "../components/Admin/Table";

const Admin = () => {
  const { page } = useParams();
  const pages = [
    { name: "Users", path: "users" },
    { name: "Accounts", path: "accounts" },
    { name: "Transactions", path: "transactions" },
    { name: "Deposit Options", path: "deposit-options" },
  ];

  const [data, setData] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(true);

  React.useEffect(() => {
    setIsFetching(true);
    getAllData(page)
      .then((response) => {
        setData(response.data);
        setIsFetching(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [page]);

  return (
    <div className="mb-3">
      <h1>Admin Panel - {pages.find((p) => p.path === page).name}</h1>
      <div className="row">
        <AdminPanelSidebar pages={pages} />
        <div className="col-md-9 text-center">
          {pages.map((p) => {
            if (p.path === page) {
              return (
                <div key={p.path}>
                  <h1>{p.name}</h1>
                  <Table
                    data={data}
                    tableName={p.name.slice(0, -1)}
                    isFetching={isFetching}
                    setData={setData}
                    setIsFetching={setIsFetching}
                  />
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
