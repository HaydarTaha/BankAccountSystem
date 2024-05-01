import React, { useState, useEffect } from "react";
import { getDepositOptions } from "../service/DepositOption";
import { getUserAccounts } from "../service/User";
import { createAccount } from "../service/Account";

const AddAccountModal = ({ handleClose, accounts, setAccounts }) => {
  const [depositOptions, setDepositOptions] = useState([]);
  const [accountType, setAccountType] = useState("");
  const [selectedDepositOption, setSelectedDepositOption] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [withdrawalAccountId, setWithdrawalAccountId] = useState("");
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchDepositOptions = async () => {
      try {
        const response = await getDepositOptions();
        setDepositOptions(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDepositOptions();
  }, []);

  const handleSelectDepositOption = (optionId) => {
    const option = depositOptions.find(
      (option) => option.depositOptionID === optionId
    );
    setSelectedDepositOption(option);
  };

  const handleCloseOutside = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleAccountNameChange = (e) => {
    setAccountName(e.target.value);
  };

  const handleCreateAccount = async () => {
    try {
      let accountData = {
        accountName,
        balance,
        availableBalance: balance,
        currency,
      };

      if (accountType === "Deposit") {
        accountData = {
          ...accountData,
          withdrawalAccountId,
          depositOptionID: selectedDepositOption.depositOptionID,
        };
      }

      const response = await createAccount(accountData, accountType);

      if (response.data.message === "success") {
        setAccountCreated(true);
        setAlertMessage("Account created successfully!");
        setTimeout(() => {
          handleClose();
          const userID = document.cookie.split("=")[1];
          getUserAccounts(userID)
            .then((data) => {
              setAccounts(data.data);
            })
            .catch((error) => {
              console.error(error);
            });
        }, 2000);
      } else {
        setAlertMessage(response.data.data.error);
      }
    } catch (error) {
      console.error(error);
      setAlertMessage("An error occurred while creating the account.");
    }
  };

  const renderDepositOptionSelect = () => (
    <div className="mb-3">
      <label htmlFor="depositOption" className="form-label">
        Deposit Option
      </label>
      <select
        className="form-select"
        id="depositOption"
        onChange={(e) => handleSelectDepositOption(e.target.value)}
      >
        <option value="">Select Deposit Option</option>
        {depositOptions.map((option) => (
          <option key={option.depositOptionID} value={option.depositOptionID}>
            {option.depositOptionName}
          </option>
        ))}
      </select>
    </div>
  );

  const renderDepositOptionInfo = () => {
    if (!selectedDepositOption) return null;
    const { depositOptionName, depositOptionDescription, interestRate, term } =
      selectedDepositOption;
    return (
      <div className="card border-primary mb-3">
        <div className="card-header bg-primary text-white">
          <h5 className="card-title mb-0">{depositOptionName}</h5>
        </div>
        <div className="card-body">
          <p className="card-text">{depositOptionDescription}</p>
          <div className="row">
            <div className="col">
              <p className="card-text">
                <strong>Interest Rate:</strong> {interestRate}
              </p>
            </div>
            <div className="col">
              <p className="card-text">
                <strong>Term:</strong> {term}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWithdrawalAccountSelect = () => (
    <div className="mb-3">
      <label htmlFor="withdrawalAccountId" className="form-label">
        Withdrawal Account
      </label>
      <select
        className="form-select"
        id="withdrawalAccountId"
        onChange={(e) => {
          const selectedAccount = accounts.find(
            (account) => account.accountID.toString() === e.target.value
          );
          setWithdrawalAccountId(e.target.value);
          setCurrency(selectedAccount.currency);
        }}
      >
        <option value="">Select Withdrawal Account</option>
        {accounts.map((account) => (
          <option key={account.accountID} value={account.accountID}>
            {account.accountName}
          </option>
        ))}
      </select>
    </div>
  );

  const renderAccountTypeSpecificFields = () => {
    if (accountType === "Deposit") {
      return (
        <>
          {renderDepositOptionSelect()}
          {renderDepositOptionInfo()}
          <div className="mb-3">
            <label htmlFor="accountName" className="form-label">
              Account Name
            </label>
            <input
              autoComplete="off"
              type="text"
              className="form-control"
              id="accountName"
              value={accountName}
              onChange={handleAccountNameChange}
            />
          </div>
          {renderWithdrawalAccountSelect()}
          <div className="mb-3">
            <label htmlFor="balance" className="form-label">
              Balance
            </label>
            <input
              type="number"
              className="form-control"
              id="balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>
        </>
      );
    } else if (accountType === "Checking") {
      return (
        <>
          <div className="mb-3">
            <label htmlFor="accountName" className="form-label">
              Account Name
            </label>
            <input
              autoComplete="off"
              type="text"
              className="form-control"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
          {accountName && (
            <div className="mb-3">
              <label htmlFor="currency" className="form-label">
                Currency
              </label>
              <select
                className="form-select"
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="TRY">TRY</option>
              </select>
            </div>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div
      className="modal show"
      tabIndex="-1"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
        width: "100%",
        height: "100%",
      }}
      onClick={handleCloseOutside}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Account</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            {alertMessage && (
              <div
                className={`alert ${
                  alertMessage.includes("success")
                    ? "alert-success"
                    : "alert-danger"
                }`}
                role="alert"
              >
                {alertMessage}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="accountType" className="form-label">
                Account Type
              </label>
              <select
                className="form-select"
                id="accountType"
                value={accountType}
                onChange={(e) => {
                  setAccountType(e.target.value);
                  setAccountName("");
                  setCurrency("");
                  setBalance(0);
                  setWithdrawalAccountId("");
                  setSelectedDepositOption(null);
                  setAlertMessage("");
                }}
              >
                <option value="">Select Account Type</option>
                {["Checking", "Deposit"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {renderAccountTypeSpecificFields()}
            {currency && (
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  onClick={handleCreateAccount}
                >
                  <i className="bi bi-bank"></i> Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
