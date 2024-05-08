import React, { useState } from "react";
import { updateAccountName } from "../../service/Account";
import currencySymbols from "../../constants/currencySymbols";
import TransactionTableModal from "../Transaction/TransactionModal";

const AccountCard = ({ account, removeAccount }) => {
  // State for hover effect and modal visibility
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // State for editable account name and edit mode
  const [editableAccountName, setEditableAccountName] = useState(
    account.accountName
  );
  const [isEditing, setIsEditing] = useState(false);

  // Handle card click to show modal
  const handleCardClick = () => {
    setIsHovered(!isHovered);
    setShowModal(true);
  };

  // Close modal when clicked outside
  const handleCloseOutside = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setIsHovered(false);
      setIsEditing(false);
      setEditableAccountName(account.accountName);
    }
  };

  // Close modal when clicked outside
  const handleCloseTransactionModal = (e) => {
    if (e.target === e.currentTarget) {
      setShowTransactionModal(false);
    }
  };

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Save edited account name
  const handleSaveClick = () => {
    setIsEditing(false);
    // Save the edited account name
    updateAccountName(account.accountID, editableAccountName)
      .then((data) => {
        account.accountName = data.data.accountName;
        setShowModal(false);
      })
      .catch((error) => {
        console.error(error);
        setShowModal(false);
      });
  };

  return (
    <>
      <div className="col">
        <div
          className={`card ${isHovered ? "bg-light" : ""}`}
          style={{ cursor: "pointer" }}
          onClick={handleCardClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="card-body">
            <h5 className="card-title">{account.accountName}</h5>
            <p className="card-text">IBAN: {formatIBAN(account.iban)}</p>
            <p className="card-text">
              Balance: {formatBalance(account.balance)}{" "}
              {currencySymbols[account.currency]}
            </p>
            <p className="card-text">
              Available Balance: {formatBalance(account.availableBalance)}{" "}
              {currencySymbols[account.currency]}
            </p>
          </div>
        </div>
      </div>
      {showModal && (
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
                <h5 className="modal-title">Account Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <strong>Account Name:</strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableAccountName}
                      onChange={(e) => setEditableAccountName(e.target.value)}
                      className="form-control form-control-sm d-inline w-50"
                      style={{
                        marginRight: "0.5rem",
                      }}
                    />
                  ) : (
                    <div style={{ display: "inline", marginRight: "0.5rem" }}>
                      {account.accountName}
                    </div>
                  )}
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      isEditing ? "btn-success" : "btn-primary"
                    }`}
                    onClick={isEditing ? handleSaveClick : handleEditClick}
                  >
                    {!isEditing ? (
                      <i className="bi bi-pencil"></i>
                    ) : (
                      <i className="bi bi-check"></i>
                    )}
                  </button>
                </div>
                <div className="mb-3">
                  <strong>Account Type:</strong> {account.accountType}
                </div>
                <div className="mb-3">
                  <strong>IBAN:</strong> {formatIBAN(account.iban)}
                </div>
                <div className="mb-3">
                  <strong>Balance:</strong> {formatBalance(account.balance)}{" "}
                  {currencySymbols[account.currency]}
                </div>
                <div className="mb-3">
                  <strong>Available Balance:</strong>{" "}
                  {formatBalance(account.availableBalance)}{" "}
                  {currencySymbols[account.currency]}
                </div>
                <div className="mb-3">
                  <strong>Currency:</strong> {account.currency}
                </div>
                <div className="mb-3">
                  <strong>Account Open Date:</strong>{" "}
                  {new Date(account.openDate).toLocaleDateString()}
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-success">
                    <i className="bi bi-file-earmark-text me-1"></i>
                    Monthly Account Statement
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowTransactionModal(true)}
                  >
                    <i className="bi bi-journal-text me-1"></i>
                    Transaction History
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeAccount(account.accountID)}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Close Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showTransactionModal && (
        <div
          className="modal show d-flex align-items-center justify-content-center"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            height: "100%",
          }}
          onClick={handleCloseTransactionModal}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transaction History</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTransactionModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <TransactionTableModal accountID={account.accountID} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Format IBAN for display
const formatIBAN = (iban) => {
  const formattedIBAN = iban.replace(/(.{4})/g, "$1 ").trim();
  return formattedIBAN;
};

// Format for balance and available balance. Add space for every 3 digits
const formatBalance = (balance) => {
  const formattedBalance = balance
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return formattedBalance;
};

export default AccountCard;
