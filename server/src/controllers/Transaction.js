import { TransactionModel } from "../models/Transaction.js";
import { AccountModel } from "../models/Account.js";

// Tüm işlemleri getir
export const getAllTransactions = async (req, res) => {
  try {
    const userID = req.headers.cookie.split("=")[1]; // Kullanıcının kimliğini al
    const userAccounts = await AccountModel.find({ userID }, 'accountID'); // Kullanıcıya ait hesapları getir
    const accountIDs = userAccounts.map(account => account.accountID); // Hesap ID'lerini al
    const transactions = await TransactionModel.find({ senderAccountID: { $in: accountIDs } }); // Kullanıcının hesaplarına ait işlemleri getir
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir filtre ile işlemleri getir
export const getFilteredTransactions = async (req, res) => {
  const userID = req.headers.cookie.split("=")[1];  // Kullanıcının kimliğini al
  const { filterType, filterValue } = req.query;
  
  try {
    const userAccounts = await AccountModel.find({ userID }, 'accountID'); // Kullanıcıya ait hesapları getir
    const accountIDs = userAccounts.map(account => account.accountID); // Hesap ID'lerini al
    let filter = { senderAccountID: { $in: accountIDs } }; // Kullanıcının hesaplarına ait işlemleri filtrele
    filter[filterType] = filterValue;
    const transactions = await TransactionModel.find(filter);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};
