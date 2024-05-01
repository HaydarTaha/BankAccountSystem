import React, { useState, useEffect } from "react";
import { createInvoice } from "../service/Invoices";
import { getUserAccounts, getAllUserIbans } from "../service/User";
import { getAllFirms, getFilteredFirms } from "../service/Firms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function Invoices() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("");
  const [userAccounts, setUserAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ibans, setIbans] = useState([]);
  const [ibansFetched, setIbansFetched] = useState(false);
  const [balanceError, setBalanceError] = useState(false);
  const [sameAccountError, setsameAccountError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [firms, setFirms] = useState([]); 
  const [subscriptionNumber, setSubscriptionNumber] = useState(""); 
  const [filteredFirm, setFilteredFirm] = useState(null);
  const [isfilteredFirm, setisFilteredFirm] = useState(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [invalidSubscrictionError, setinvalidSubscrictionError] = useState(false);
  
  const IbanList = () => {
    useEffect(() => {
      if (!ibansFetched) {
        const fetchIbanIDs = async () => {
          try {
            const ibanData = await getAllUserIbans();
            setIbans(ibanData);
            setIbansFetched(true);
          } catch (error) {
            console.error("Error fetching user IDs:", error);
          }
        };

        fetchIbanIDs();
      }
    }, [ibansFetched]);
  };

  useEffect(() => {
    const userID = document.cookie.split("=")[1];
    getUserAccounts(userID)
      .then((data) => {
        setUserAccounts(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getAllFirms() 
      .then((data) => {
        setFirms(data);
        setisFilteredFirm(false);
      })
      .catch((error) => {
        console.error("Error fetching firms:", error);
      });
  }, []);

  const handleSearch = () => {
    getFilteredFirms({ firmname: recipient, subscription_id: subscriptionNumber })
      .then((data) => {
        setFilteredFirm(data);
        console.log(filteredFirm);
        setisFilteredFirm(true);

        if(data.length === 0){
            setisFilteredFirm(false);
            setinvalidSubscrictionError(true);
        }

      })
      .catch((error) => {
        console.error("Error filtering firms:", error);
      });
  };

useEffect(() => {
    if (isfilteredFirm && filteredFirm[0].payment_status !== "paid") {
        const amount = parseFloat(filteredFirm[0].interest_rate_overdue_payment) + parseFloat(filteredFirm[0].payment_value);
        setAmountToPay(amount);
    } else {
        setAmountToPay(0); 
    }
}, [isfilteredFirm, filteredFirm]);

const handleSubmit = async (event) => {
    event.preventDefault();

    const userID = document.cookie.split("=")[1];

    try {
        const senderAccount = userAccounts.find(
            (account) => account.accountID === parseInt(selectedAccount)
        );

        let invoiceAmount = amount; 

        if (isCompany) {
            invoiceAmount = amountToPay;
            setSelectedAccount(filteredFirm.unique_company_id);  
        }

        if (senderAccount && parseFloat(invoiceAmount) > parseFloat(senderAccount.balance)) {
            setBalanceError(true);
            setTimeout(() => setBalanceError(false), 3000);
            return;
        }

        if(!isCompany){
            if (recipient === senderAccount.iban) {
                setsameAccountError(true);
                setTimeout(() => setsameAccountError(false), 3000);
                return;
                }
        }


        const data = await createInvoice({
            userID: userID,
            accountID: selectedAccount,
            recipient: recipient,
            amount: invoiceAmount,
            frequency,
            isCompany 
        });
        console.log("Invoice successfully created:", data);

        setRecipient("");
        setAmount("");
        setFrequency("");
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 3000);
    } catch (error) {
        console.error("Error creating invoice:", error);
    }
};

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Invoices Page</h1>
      <div className="row mb-3">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="account" className="form-label">
                  Select Account:
                </label>
                <select
                  id="account"
                  className="form-select"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  required
                >
                  <option value="">Select an Account</option>
                  {userAccounts.map((account) => (
                    <option key={account.accountID} value={account.accountID}>
                      {account.accountName}
                    </option>
                  ))}
                </select>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="recipient" className="form-label">
                    {isCompany ? "Recipient Company" : "Recipient IBAN"}:
                  </label>
                  <select
                    id="recipient"
                    className="form-select"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  >
                    <option value="">{isCompany ? "Select a Company" : "Select a Recipient"}</option>
                    {!isCompany &&
                      ibans.map((iban, index) => (
                        <option key={index} value={iban}>
                          {iban}
                        </option>
                      ))}
                    {isCompany &&
                      firms.map((firm) => (
                        <option key={firm._id} value={firm.company_name}>
                          {firm.company_name}
                        </option>
                      ))}
                  </select>
                  {sameAccountError && (
                    <div className="text-danger mt-1 d-flex align-items-center">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                      You cannot send money to the same account!
                    </div>
                  )}
                </div>
                {!isCompany && (
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Amount:
                    </label>
                    <input
                      type="text"
                      id="amount"
                      className="form-control"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    {balanceError && (
                      <div className="text-danger mt-1 d-flex align-items-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                        Insufficient balance!
                      </div>
                    )}
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="frequency" className="form-label">
                    Frequency:
                  </label>
                  <select
                    id="frequency"
                    className="form-select"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">Every 1 minute</option>
                    <option value="3">Every 3 minutes</option>
                    <option value="10">Every 10 minutes</option>
                  </select>
                </div>
                <div className="mb-3 form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isCompany"
                    checked={isCompany}
                    onChange={() => setIsCompany(!isCompany)}
                  />
                  <label className="form-check-label" htmlFor="isCompany">
                    Company
                  </label>
                </div>
                <button type="submit" className="btn btn-primary">
                  Save Instruction
                </button>
              </form>
              <IbanList />
            </div>
          </div>
        </div>
        {isCompany && (
            <div className="col">
                {isfilteredFirm ? (
                    <div>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Debt</h5>
                                <table className="table">
                                    <tbody>
                                        {filteredFirm.map((firm, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <th scope="row">Company Name</th>
                                                    <td>{firm.company_name}</td>
                                                </tr>
                                                <tr key={`interest_rate_${index}`}>
                                                    <th scope="row">Overdue Interest Rate</th>
                                                    <td>{firm.interest_rate_overdue_payment}</td>
                                                </tr>
                                                <tr key={`payment_status_${index}`}>
                                                    <th scope="row">Payment Status</th>
                                                    <td>{firm.payment_status}</td>
                                                </tr>
                                                <tr key={`payment_value_${index}`}>
                                                    <th scope="row">Payment Value</th>
                                                    <td>{firm.payment_value}</td>
                                                </tr>
                                                <tr key={`subscription_start_date_${index}`}>
                                                    <th scope="row">Subscription Start Date</th>
                                                    <td>{firm.subscription_start_date}</td>
                                                </tr>
                                                <tr key={`subscription_end_date_${index}`}>
                                                    <th scope="row">Subscription End Date</th>
                                                    <td>{firm.subscription_end_date}</td>
                                                </tr>
                                                <tr key={`subscription_id_${index}`}>
                                                    <th scope="row">Subscription Number</th>
                                                    <td>{firm.subscription_id}</td>
                                                </tr>
                                                <tr key={`unique_company_id_${index}`}>
                                                    <th scope="row">Unique Company ID</th>
                                                    <td>{firm.unique_company_id}</td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card mt-3">
                            <div className="card-body">
                                <h5 className="card-title">Amount to Pay</h5>
                                <p className="card-text">
                                    {filteredFirm[0].payment_status === "paid"
                                        ? "There is no amount to pay."
                                        : `Amount to pay: ${filteredFirm[0].interest_rate_overdue_payment} overdue interest + ${filteredFirm[0].payment_value} payment value`}
                                </p>
                            </div>
                        </div>
                    </div>
                ): (
                <div className="card">
                    <div className="card-body">
                    <h5 className="card-title">Debt</h5>
                    <p className="card-text">Debt information will be displayed here.</p>
                    {invalidSubscrictionError && (
                      <div className="text-danger mt-3 d-flex align-items-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                        There is no such subscription!
                      </div>
                    )}
                    </div>
                </div>
                )}
                <div className="card mt-3">
                <div className="card-body">
                    <h5 className="card-title">Subscription Number</h5>
                    <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Subscription Number"
                        aria-label="Subscription Number"
                        aria-describedby="basic-addon2"
                        value={subscriptionNumber}
                        onChange={(e) => setSubscriptionNumber(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSearch}>
                        Search
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}
      </div>
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <FontAwesomeIcon icon={faCheck} className="me-2" />
          Invoice successfully created!
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setSuccessMessage(false)}
          ></button>
        </div>
      )}
    </div>
  );
}
