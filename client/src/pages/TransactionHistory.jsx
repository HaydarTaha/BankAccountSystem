import React, { useState, useEffect } from "react";
import { getAllTransactions, getFilteredTransactions } from "../service/Transaction";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const allTransactions = await getAllTransactions();
      setTransactions(allTransactions);
      setFilteredTransactions(allTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleFilterSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!filterType) {
        // Filtre türü seçilmemişse, tüm işlemleri yeniden yükle
        loadTransactions();
      } else {
        const filtered = await getFilteredTransactions(filterType, filterValue);
        setFilteredTransactions(filtered);
      }
    } catch (error) {
      console.error("Error filtering transactions:", error);
    }
  };
  

  return (
    <div className="container mt-5">
      <h1>Transaction History</h1>
      <form onSubmit={handleFilterSubmit} className="mb-3">
        <div className="row">
          <div className="col-md-4">
          <select value={filterType} onChange={handleFilterChange} className="form-select">
            <option value="">Filtreleme Türü Seçin</option>
            <option value="senderAccountID">Gönderen Hesap ID'si</option>
            <option value="receiverAccountID">Alıcı Hesap ID'si</option>
            <option value="amount">Miktar</option>
            <option value="transactionType">İşlem Türü</option>
            <option value="description">Açıklama</option>
            <option value="date">Tarih</option>
          </select>
          </div>
          <div className="col-md-4">
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="form-control"
              placeholder="Filtre Değeri"
            />
          </div>
          <div className="col-md-4">
            <button type="submit" className="btn btn-primary">Filtrele</button>
          </div>
        </div>
      </form>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Gönderen Hesap</th>
                    <th scope="col">Alıcı Hesap</th>
                    <th scope="col">Tarih</th>
                    <th scope="col">Miktar</th>
                    <th scope="col">İşlem Türü</th>
                    <th scope="col">Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.senderAccountID}</td>
                    <td>{transaction.receiverAccountID}</td>
                    <td>{new Date(transaction.date).toLocaleString()}</td>
                    <td>{transaction.amount["$numberDecimal"]}</td>
                    <td>{transaction.transactionType}</td>
                    <td>{transaction.description}</td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
