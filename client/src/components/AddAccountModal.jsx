import React, { useState } from "react";
import { getDepositOptions } from "../service/DepositOption";

const AddAccountModal = ({ handleClose, accounts }) => {
  // Variables
  const [depositOptions, setDepositOptions] = useState([]);
  const [accountType, setAccountType] = useState("");
  const [depositOptionID, setDepositOptionID] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawalAccountId, setWithdrawalAccountID] = useState("");
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("");
  const accountTypes = ["Checking", "Deposit"];

  // Fetch deposit options
  React.useEffect(() => {
    getDepositOptions()
      .then((data) => {
        setDepositOptions(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Set the currency for the Deposit Account when the Withdrawal Account is selected
  React.useEffect(() => {
    if (withdrawalAccountId) {
      setCurrency(() => {
        const account = accounts.find(
          (account) => account.accountID === parseInt(withdrawalAccountId)
        );
        return account.currency;
      });
    }
  }, [withdrawalAccountId]);

  // Close modal when clicked outside
  const handleCloseOutside = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Create Template Bootstrap Modal
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
            <div className="mb-3">
              <label htmlFor="accountType" className="form-label">
                Account Type
              </label>
              <select
                className="form-select"
                id="accountType"
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="">Select Account Type</option>
                {accountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {/*  When Type is Deposit */}
            {accountType === "Deposit" && (
              <div>
                <div className="mb-3">
                  <label htmlFor="depositOption" className="form-label">
                    Deposit Option
                  </label>
                  <select
                    className="form-select"
                    id="depositOption"
                    onChange={(e) => setDepositOptionID(e.target.value)} // Changed this line
                  >
                    <option value="">Select Deposit Option</option>
                    {depositOptions.map((depositOption) => (
                      <option
                        key={depositOption.depositOptionID}
                        value={depositOption.depositOptionID}
                      >
                        {depositOption.depositOptionName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  {/* Show Selected Deposit Option Name, Description, Interest Rate and Term with custom bootstrap beautiful card */}
                  {depositOptionID && (
                    <div className="card border-primary mb-3">
                      <div className="card-header bg-primary text-white">
                        <h5 className="card-title mb-0">
                          {
                            depositOptions.find(
                              (option) =>
                                option.depositOptionID === depositOptionID
                            ).depositOptionName
                          }
                        </h5>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          {
                            depositOptions.find(
                              (option) =>
                                option.depositOptionID === depositOptionID
                            ).depositOptionDescription
                          }
                        </p>
                        <div className="row">
                          <div className="col">
                            <p className="card-text">
                              <strong>Interest Rate:</strong>{" "}
                              {
                                depositOptions.find(
                                  (option) =>
                                    option.depositOptionID === depositOptionID
                                ).interestRate
                              }
                            </p>
                          </div>
                          <div className="col">
                            <p className="card-text">
                              <strong>Term:</strong>{" "}
                              {
                                depositOptions.find(
                                  (option) =>
                                    option.depositOptionID === depositOptionID
                                ).term
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  {depositOptionID && (
                    <div>
                      <label htmlFor="accountName" className="form-label">
                        Account Name
                      </label>
                      <input
                        autoComplete="off"
                        type="text"
                        className="form-control"
                        id="accountName"
                        onChange={(e) => setAccountName(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  {accountName && (
                    <div>
                      <label
                        htmlFor="withdrawalAccountId"
                        className="form-label"
                      >
                        Withdrawal Account
                      </label>
                      <select
                        className="form-select"
                        id="withdrawalAccountId"
                        onChange={(e) => setWithdrawalAccountID(e.target.value)}
                      >
                        <option value="">Select Withdrawal Account</option>
                        {accounts.map((account) => (
                          <option
                            key={account.accountID}
                            value={account.accountID}
                          >
                            {account.accountName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  {withdrawalAccountId && (
                    <div>
                      <label htmlFor="balance" className="form-label">
                        Balance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="balance"
                        onChange={(e) => setBalance(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            {/*  When Type is Checking */}
            {accountType === "Checking" && (
              <div>
                <div className="mb-3">
                  <label htmlFor="accountName" className="form-label">
                    Account Name
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    id="accountName"
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  {accountName && (
                    <div>
                      <label htmlFor="currency" className="form-label">
                        Currency
                      </label>
                      <select
                        className="form-select"
                        id="currency"
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value="">Select Currency</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="TRY">TRY</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="mb-3">{currency && <div>sadasd</div>}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
