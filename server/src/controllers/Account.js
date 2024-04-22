import { AccountModel } from "../models/Account.js";

export const createCheckingAccount = async (req, res) => {
  try {
    const { accountName, balance, availableBalance, currency } = req.body;

    // Get the userID from the cookie
    const userID = req.headers.cookie.split("=")[1];

    // Check if all required fields are provided
    if (
      !accountName ||
      !balance.toString() ||
      !availableBalance.toString() ||
      !currency
    ) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Missing or invalid fields in request body." },
      });
    }

    // Create a new checking account
    const newCheckingAccount = new AccountModel({
      userID,
      accountName,
      accountType: "Checking",
      balance,
      availableBalance,
      currency,
    });

    // Save the new checking account to the database
    const savedAccount = await newCheckingAccount.save();

    // Respond with success message and accountID
    res.status(201).json({
      message: "success",
      data: { accountID: savedAccount.accountID },
    });
  } catch (error) {
    console.error("Error creating checking account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteAccountById = async (req, res) => {
  try {
    const { accountID } = req.params;

    // Check if the account exists
    const existingAccount = await AccountModel.findOne({ accountID });
    if (!existingAccount) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Account not found." },
      });
    }

    // Delete the account from the database
    await AccountModel.deleteOne({ accountID });

    // Respond with success message and deleted accountID
    res.status(200).json({
      message: "success",
      data: { accountID },
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateAccountName = async (req, res) => {
  try {
    const { accountID } = req.params;
    const { accountName } = req.body;

    // Check if accountName is provided and valid
    if (!accountName || typeof accountName !== "string") {
      return res.status(422).json({
        message: "fail",
        data: { error: "Missing or invalid account name." },
      });
    }

    // Find the account by ID
    const account = await AccountModel.findOneAndUpdate(
      { accountID },
      { accountName },
      { new: true }
    );

    // If account doesn't exist, return error
    if (!account) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Account not found." },
      });
    }

    // Respond with success message and updated account details
    res.status(200).json({
      message: "success",
      data: { accountID: account.accountID, accountName: account.accountName },
    });
  } catch (error) {
    console.error("Error updating account name:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const createDepositAccount = async (req, res) => {
  try {
    const {
      accountName,
      withdrawalAccountId,
      balance,
      availableBalance,
      currency,
      depositOptionID,
    } = req.body;

    // Get the userID from the cookie
    const userID = req.headers.cookie.split("=")[1];

    // Check if all required fields are provided
    if (
      !accountName ||
      !withdrawalAccountId ||
      !balance.toString() ||
      !availableBalance.toString() ||
      !currency ||
      !depositOptionID
    ) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Missing or invalid fields in request body." },
      });
    }

    // Create a new deposit account
    const newDepositAccount = new AccountModel({
      userID,
      accountName,
      accountType: "Deposit",
      withdrawalAccountId,
      balance,
      availableBalance,
      currency,
      depositOption: depositOptionID,
    });

    // Withdraw the balance from the withdrawal account
    const withdrawalAccount = await AccountModel.findOne({
      accountID: withdrawalAccountId,
    });

    // Check if the withdrawal account exists
    if (!withdrawalAccount) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Withdrawal account not found." },
      });
    }

    // Check if the withdrawal account has enough balance
    if (withdrawalAccount.availableBalance < balance) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Insufficient funds in the withdrawal account." },
      });
    }

    // Update the withdrawal account balance
    withdrawalAccount.availableBalance -= balance;
    withdrawalAccount.balance -= balance;

    // Save the updated withdrawal account
    await withdrawalAccount.save();

    // Save the new deposit account to the database
    const savedAccount = await newDepositAccount.save();

    // Respond with success message and accountID
    res.status(201).json({
      message: "success",
      data: { accountID: savedAccount.accountID },
    });
  } catch (error) {
    console.error("Error creating deposit account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
