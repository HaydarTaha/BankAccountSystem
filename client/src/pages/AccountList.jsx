//AccountList.jsx
import React, { useState } from "react";
import { getUserAccounts } from "../service/User";
import { deleteAccount } from "../service/Account";
import AccountCard from "../components/AccountCard";
import AddAccountModal from "../components/AddAccountModal";

// Account list component
const AccountList = () => {
  // Accounts data
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading animation
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  React.useEffect(() => {
    const userID = document.cookie.split("=")[1];
    getUserAccounts(userID)
      .then((data) => {
        setAccounts(data.data);
        setIsLoading(false); // Turn off loading animation when data is fetched
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false); // Turn off loading animation in case of error
      });
  }, []);

  // Remove Account from the list
  const removeAccount = (accountID) => {
    deleteAccount(accountID)
      .then(() => {
        setAccounts(
          accounts.filter((account) => account.accountID !== accountID)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="mb-3">
      <h1>Account List</h1>
      <div className="mb-3">
        <button
          onClick={() => {
            console.log("Add Account button clicked");
            setShowAddAccountModal(true);
          }}
          className="btn btn-primary me-2"
        >
          Add Account
        </button>
        {showAddAccountModal && (
          <AddAccountModal
            handleClose={() => setShowAddAccountModal(false)}
            accounts={accounts}
          />
        )}
        <button className="btn btn-secondary">My Assets</button>
      </div>
      {isLoading ? ( // Conditional rendering for loading animation
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {accounts.map((account) => (
            <div key={account.accountID} className="col-md-6 mb-3">
              <AccountCard account={account} removeAccount={removeAccount} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountList;
