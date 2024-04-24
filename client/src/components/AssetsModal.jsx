import React from "react";
import { getUserAccounts } from "../service/User";

const AssetsModal = ({ handleClose }) => {
  const [accounts, setAccounts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    TRY: "₺",
  };

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
                {currencySymbols[currency]}
                {isLoading
                  ? "Loading..."
                  : calculateTotalAssets(currency).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTotalCheckingAccountAssets = () => {
    return (
      <div className="mb-4">
        <h5 className="mb-3">Total Checking Account Assets</h5>
        <div className="list-group">
          {Object.keys(currencySymbols).map((currency) => (
            <div
              key={currency}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <p className="m-0">{currency} Total Assets</p>
              <p className="m-0 font-weight-bold">
                {currencySymbols[currency]}
                {isLoading
                  ? "Loading..."
                  : calculateTotalAssets(currency, "Checking").toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTotalDepositAccountAssets = () => {
    return (
      <div className="mb-4">
        <h5 className="mb-3">Total Deposit Account Assets</h5>
        <div className="list-group">
          {Object.keys(currencySymbols).map((currency) => (
            <div
              key={currency}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <p className="m-0">{currency} Total Assets</p>
              <p className="m-0 font-weight-bold">
                {currencySymbols[currency]}
                {isLoading
                  ? "Loading..."
                  : calculateTotalAssets(currency, "Deposit").toLocaleString()}
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
            {renderTotalCheckingAccountAssets()}
            {renderTotalDepositAccountAssets()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsModal;
