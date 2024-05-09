import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import { getTransactionsByAccountID } from "../../service/User";

const TransactionTableModal = ({ accountID, currency }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [isFiltering, setIsFiltering] = useState(false);
  const [startDateFilter, setStartDateFilter] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDateFilter, setEndDateFilter] = useState(new Date());

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactionsByAccountID(
        document.cookie.split("=")[1],
        accountID
      );
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {transactions.length === 0 && (
            <div className="text-center mt-3">
              <h5>No transactions found</h5>
            </div>
          )}
          {/* Show Filter With Start Date and End Date and Filter Button */}
          {!loading && transactions.length > 0 && (
            <div>
              <button
                className="btn btn-primary mt-3"
                onClick={() => setIsFiltering(!isFiltering)}
              >
                {isFiltering ? "Hide Filters" : "Show Filters"}
              </button>
              {isFiltering && (
                <div className="input-group w-50 mt-3 mx-auto">
                  <input
                    type="date"
                    className="form-control"
                    value={startDateFilter.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setStartDateFilter(new Date(e.target.value))
                    }
                  />
                  <input
                    type="date"
                    className="form-control"
                    value={endDateFilter.toISOString().split("T")[0]}
                    onChange={(e) => setEndDateFilter(new Date(e.target.value))}
                  />
                  <button
                    className="btn btn-primary"
                    //Add filter function here
                  >
                    Filter
                  </button>
                </div>
              )}
            </div>
          )}
          {!loading && transactions.length > 0 && (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Sender Account ID</th>
                  <th>Receiver Account ID</th>
                  <th>Amount</th>
                  <th>Transaction Type</th>
                  <th>Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((transaction) => (
                    <tr key={transaction.transactionID}>
                      <td>{transaction.senderAccountID}</td>
                      <td>{transaction.receiverAccountID}</td>
                      <td
                        style={{
                          color:
                            transaction.senderAccountID === accountID
                              ? "red"
                              : "green",
                        }}
                      >
                        {transaction.senderAccountID === accountID ? "-" : "+"}
                        {currency}
                        {transaction.amount}
                      </td>
                      <td>{transaction.transactionType}</td>
                      <td>
                        {
                          new Date(transaction.date)
                            .toLocaleString("en-US")
                            .split(",")[0]
                        }
                      </td>
                      <td>{transaction.description}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {!loading &&
        transactions.length > 0 &&
        transactions.length > itemsPerPage && (
          <div className="d-flex justify-content-center">
            <Pagination
              variant="outlined"
              size="large"
              color="primary"
              count={Math.ceil(transactions.length / itemsPerPage)}
              page={page}
              onChange={(event, value) => setPage(value)}
            />
          </div>
        )}
    </div>
  );
};

export default TransactionTableModal;
