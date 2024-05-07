//AccountList.jsx
import React, { useState } from "react";
import { getUserAccounts } from "../service/User";
import { deleteAccount } from "../service/Account";
import AccountCard from "../components/Account/AccountCard";
import AddAccountModal from "../components/Account/AddAccountModal";
import AssetsModal from "../components/Account/AssetsModal";
import Swal from "sweetalert2";

// Account list component
const AccountList = () => {
  // Accounts data
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading animation
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAssetsModal, setShowAssetsModal] = useState(false);

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
  const removeAccount = async (accountID) => {
    const account = accounts.find((acc) => acc.accountID === accountID);
    const checkingAccountsCount = accounts.filter(
      (acc) => acc.accountType === "Checking"
    ).length;
    const sameCurrencyAccounts = accounts.filter(
      (acc) => acc.currency === account.currency && acc.accountID !== accountID
    );

    // If there is no other account with the same currency, return
    if (sameCurrencyAccounts.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Cannot delete account",
        text: "At least one account with the same currency is required",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    if (checkingAccountsCount === 1 && account.accountType === "Checking") {
      Swal.fire({
        icon: "error",
        title: "Cannot delete account",
        text: "At least one Checking account is required",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    const { value: accountToTransfer } = await Swal.fire({
      title: "Select account to transfer balance",
      input: "select",
      // Show all Checking accounts except the current accountName if it is a Checking account, otherwise show all Checking accountsName
      inputOptions: {
        ...accounts
          .filter(
            (acc) =>
              acc.accountType === "Checking" &&
              acc.accountID !== accountID &&
              acc.currency === account.currency
          )
          .reduce((acc, curr) => {
            acc[curr.accountID] = curr.accountName;
            return acc;
          }, {}),
      },
      inputPlaceholder: "Select account",
      showCancelButton: true,
      // if cancel button is clicked, return the accountToTransfer as null
      cancelButtonText: "Cancel",
    });

    if (accountToTransfer === undefined || accountToTransfer === "") {
      return;
    }

    if (accountToTransfer) {
      deleteAccount(accountID, accountToTransfer)
        .then(() => {
          // Get updated accounts
          getUserAccounts(document.cookie.split("=")[1])
            .then((data) => {
              setAccounts(data.data);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  if (isLoading) {
    // Bootstrap Spinner
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <h1>Account List</h1>
      <div className="mb-3">
        <button
          onClick={() => {
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
            setAccounts={setAccounts}
          />
        )}
        <button
          className="btn btn-secondary"
          onClick={() => setShowAssetsModal(true)}
        >
          My Assets
        </button>
        {showAssetsModal && (
          <AssetsModal
            handleClose={() => setShowAssetsModal(false)}
            accounts={accounts}
          />
        )}
      </div>

      <div className="row">
        {accounts.map((account) => (
          <div key={account.accountID} className="col-md-6 mb-3">
            <AccountCard account={account} removeAccount={removeAccount} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;
