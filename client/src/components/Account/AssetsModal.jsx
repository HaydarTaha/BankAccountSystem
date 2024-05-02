import React, { useState, useEffect } from "react";
import { getUserAccounts } from "../../service/User.jsx";
import currencySymbols from "../../constants/currencySymbols.js";

const AssetsModal = ({ handleClose }) => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userID = document.cookie.split("=")[1];
    getUserAccounts(userID)
      .then(({ data }) => {
        setAccounts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  const handleCloseOutside = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const calculateTotalAssets = (currency, type = null) => {
    let filteredAccounts = accounts.filter(
      (account) => account.currency === currency
    );

    if (type) {
      filteredAccounts = filteredAccounts.filter(
        (account) => account.accountType === type
      );
    }

    return filteredAccounts.reduce(
      (total, account) => total + account.balance,
      0
    );
  };

  const Spinner = () => (
    <div className="spinner-border spinner-border-sm" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  const renderTotalAssetsByCurrency = () => {
    return (
      <div className="mb-4">
        <h5 className="mb-3">Total Assets by Currency</h5>
        <div className="list-group">
          {Object.keys(currencySymbols).map((currency) => (
            <div
              key={currency}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <p className="m-0">{currency} Total Assets</p>
              <p className="m-0 font-weight-bold">
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    {currencySymbols[currency]}
                    {calculateTotalAssets(currency).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTotalAccountAssets = (title, filterType) => {
    return (
      <div className="mb-4">
        <h5 className="mb-3">{title}</h5>
        <div className="list-group">
          {Object.keys(currencySymbols).map((currency) => (
            <div
              key={currency}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <p className="m-0">{currency} Total Assets</p>
              <p className="m-0 font-weight-bold">
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    {currencySymbols[currency]}
                    {calculateTotalAssets(currency, filterType).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
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
            <h5 className="modal-title">My Assets</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            {renderTotalAssetsByCurrency()}
            {renderTotalAccountAssets(
              "Total Checking Account Assets",
              "Checking"
            )}
            {renderTotalAccountAssets(
              "Total Deposit Account Assets",
              "Deposit"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsModal;
