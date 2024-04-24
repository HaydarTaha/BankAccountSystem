import { TransactionModel } from "../models/Transaction.js";

// Tüm işlemleri getir
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await TransactionModel.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir filtre ile işlemleri getir
export const getFilteredTransactions = async (req, res) => {
  const { filterType, filterValue } = req.query;
  
  try {
    let filter = {};
    filter[filterType] = filterValue;
    const transactions = await TransactionModel.find(filter);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};