import mongoose from "mongoose";
import { UserModel } from "../models/User.js";
import { AccountModel } from "../models/Account.js";
import { DepositOptionModel } from "../models/Deposit_Option.js";
import { TransactionModel } from "../models/Transaction.js";

export const createUser = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, surname, email, and password are required." });
    }

    // Check if user with the provided email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // Create a new user instance
    const newUser = new UserModel({
      name,
      surname,
      email,
      password,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // At this point, user is authenticated

    res.cookie("user", user._id.toString(), {
      httpOnly: false,
    });

    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user." });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("user");
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Error logging out user." });
  }
};
//simdilik kullanmayacagiz routes >> usera bagli.
// Artık kullanıyoruz la.
export const getAllAccounts = async (req, res) => {
  try {
    // Retrieve all accounts from the database
    const allAccounts = await AccountModel.find();

    // Prepare response payload
    const responseData = await Promise.all(
      allAccounts.map(async (account) => {
        const {
          accountID,
          accountName,
          accountType,
          iban,
          balance,
          availableBalance,
          currency,
          userID,
          depositOption,
          openDate,
        } = account;

        if (accountType === "Checking") {
          return {
            accountID,
            accountName,
            accountType,
            iban,
            balance: parseFloat(balance),
            availableBalance: parseFloat(availableBalance),
            currency,
            userID,
            openDate,
          };
        } else {
          const depositOptionDetails = await DepositOptionModel.findById(
            depositOption
          );

          return {
            accountID,
            accountName,
            accountType,
            iban,
            balance: parseFloat(balance),
            availableBalance: parseFloat(availableBalance),
            currency,
            userID,
            depositOption: {
              depositOptionName: depositOptionDetails.name,
              depositOptionDescription: depositOptionDetails.description,
              interestRate: parseFloat(depositOptionDetails.interestRate),
              term: depositOptionDetails.term,
            },
            openDate,
          };
        }
      })
    );

    // Respond with success message and all accounts
    res.status(200).json({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error retrieving accounts:", error);
    res.status(500).json({
      message: "fail",
      data: {
        error: "An error occurred while retrieving account information.",
      },
    });
  }
};

export const getAccounts = async (req, res) => {
  try {
    const userId = req.params.userid;

    // Retrieve user accounts from the database
    const userAccounts = await AccountModel.find({ userID: userId });

    // Prepare response payload
    const responseData = await Promise.all(
      userAccounts.map(async (account) => {
        const {
          accountID,
          accountName,
          accountType,
          iban,
          balance,
          availableBalance,
          currency,
          userID,
          depositOption,
          openDate,
        } = account;

        if (accountType === "Checking") {
          return {
            accountID,
            accountName,
            accountType,
            iban,
            balance: parseFloat(balance),
            availableBalance: parseFloat(availableBalance),
            currency,
            userID,
            openDate,
          };
        } else {
          const depositOptionDetails = await DepositOptionModel.findById(
            depositOption
          );

          return {
            accountID,
            accountName,
            accountType,
            iban,
            balance: parseFloat(balance),
            availableBalance: parseFloat(availableBalance),
            currency,
            userID,
            depositOption: {
              depositOptionName: depositOptionDetails.name,
              depositOptionDescription: depositOptionDetails.description,
              interestRate: parseFloat(depositOptionDetails.interestRate),
              term: depositOptionDetails.term,
            },
            openDate,
          };
        }
      })
    );

    // Respond with success message and user accounts
    res.status(200).json({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error retrieving user accounts:", error);
    res.status(500).json({
      message: "fail",
      data: {
        error: "An error occurred while retrieving account information.",
      },
    });
  }
};

export const getAccountById = async (req, res) => {
  try {
    const accountId = req.params.id;
    const userId = req.params.userid;

    // Retrieve the account from the database based on its ID
    const account = await AccountModel.findOne({
      accountID: accountId,
      userID: userId,
    });

    // Check if the account exists
    if (!account) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Prepare response payload
    const responseData = {
      accountName: account.accountName,
      accountType: account.accountType,
      iban: account.iban,
      balance: parseFloat(account.balance),
      availableBalance: parseFloat(account.availableBalance),
      currency: account.currency,
      userID: account.userID,
      openDate: account.openDate,
    };

    if (account.accountType === "Deposit") {
      const depositOptionDetails = await DepositOptionModel.findById(
        account.depositOption
      );
      responseData.depositOption = {
        depositOptionName: depositOptionDetails.name,
        depositOptionDescription: depositOptionDetails.description,
        interestRate: parseFloat(depositOptionDetails.interestRate),
        term: depositOptionDetails.term,
      };
    }

    // Respond with success message and account details
    res.status(200).json({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error retrieving account by ID:", error);
    res.status(500).json({
      message: "fail",
      data: {
        error: "An error occurred while retrieving account information.",
      },
    });
  }
};

export const getCheckingAccountById = async (req, res) => {
  try {
    const { userid, accountID } = req.params;

    // Find the checking account by accountID and userID
    const account = await AccountModel.findOne({
      accountID: accountID,
      userID: userid,
      accountType: "Checking",
    });

    // If account doesn't exist, return error
    if (!account) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Respond with success message and account details
    res.status(200).json({
      message: "success",
      data: {
        accountID: account.accountID,
        accountType: account.accountType,
        balance: parseFloat(account.balance),
        userID: account.userID,
      },
    });
  } catch (error) {
    console.error("Error retrieving checking account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getCheckingAccountsByUserId = async (req, res) => {
  try {
    const { userid } = req.params;

    // Find all checking accounts associated with the user
    const accounts = await AccountModel.find({
      userID: userid,
      accountType: "Checking",
    });

    // Respond with success message and account details
    res.status(200).json({
      message: "success",
      data: accounts.map((account) => ({
        accountID: account.accountID,
        accountType: account.accountType,
        balance: parseFloat(account.balance),
        userID: account.userID,
      })),
    });
  } catch (error) {
    console.error("Error retrieving checking accounts:", error);
    res.status(500).json({ message: "Unable to retrieve checking accounts." });
  }
};

export const getDepositAccountById = async (req, res) => {
  try {
    const { userid, accountID } = req.params;

    // Find the deposit account by accountID and userID
    const account = await AccountModel.findOne({
      accountID: accountID,
      userID: userid,
      accountType: "Deposit",
    });

    // If account doesn't exist, return error
    if (!account) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Find the deposit option details
    const depositOption = await DepositOptionModel.findById(
      account.depositOption
    );

    // Respond with success message and account details
    res.status(200).json({
      message: "success",
      data: {
        accountID: account.accountID,
        accountType: account.accountType,
        balance: parseFloat(account.balance),
        userID: account.userID,
        depositOption: {
          depositOptionName: depositOption.name,
          depositOptionDescription: depositOption.description,
          interestRate: parseFloat(depositOption.interestRate),
          term: depositOption.term,
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving deposit account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getDepositAccountsByUserId = async (req, res) => {
  try {
    const { userid } = req.params;

    // Find all deposit accounts associated with the user
    const accounts = await AccountModel.find({
      userID: userid,
      accountType: "Deposit",
    });

    // Prepare response payload
    const responseData = await Promise.all(
      accounts.map(async (account) => {
        const depositOption = await DepositOptionModel.findById(
          account.depositOption
        );

        return {
          accountID: account.accountID,
          accountType: account.accountType,
          balance: parseFloat(account.balance),
          userID: account.userID,
          depositOption: {
            depositOptionName: depositOption.name,
            depositOptionDescription: depositOption.description,
            interestRate: parseFloat(depositOption.interestRate),
            term: depositOption.term,
          },
        };
      })
    );

    // Respond with success message and account details
    res.status(200).json({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error retrieving deposit accounts:", error);
    res.status(500).json({ message: "Unable to retrieve deposit accounts." });
  }
};

export const getAccountTransactions = async (req, res) => {
  try {
    const { userid, accountID } = req.params;

    // Get the account by accountID and userID
    const account = await AccountModel.findOne({
      userID: userid,
      accountID: accountID,
    });

    if (!account) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Retrieve transaction history for the account
    const transactions = await TransactionModel.find({
      $or: [{ senderAccountID: accountID }, { receiverAccountID: accountID }],
    });

    // Respond with success message and transaction history
    res.status(200).json({
      message: "success",
      data: transactions.map((transaction) => ({
        transactionID: transaction.transactionID,
        senderAccountID: transaction.senderAccountID,
        receiverAccountID: transaction.receiverAccountID,
        amount: parseFloat(transaction.amount),
        transactionType: transaction.transactionType,
        date: transaction.date,
        description: transaction.description,
      })),
    });
  } catch (error) {
    console.error("Error retrieving account transactions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { userid, accountID, transactionID } = req.params;

    // Retrieve the transaction from the database based on its ID and the associated account ID
    const transaction = await TransactionModel.findOne({
      _id: transactionID,
      $or: [{ senderAccountID: accountID }, { receiverAccountID: accountID }],
    });

    // Check if the transaction exists
    if (!transaction) {
      return res.status(422).json({
        message: "fail",
        data: {
          error: "The specified account ID or transaction ID does not exist.",
        },
      });
    }

    // Prepare response payload
    const responseData = {
      transactionID: transaction._id,
      senderAccountID: transaction.senderAccountID,
      receiverAccountID: transaction.receiverAccountID,
      amount: parseFloat(transaction.amount),
      transactionType: transaction.transactionType,
      date: transaction.date,
      description: transaction.description,
    };

    // Respond with success message and transaction details
    res.status(200).json({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error retrieving transaction by ID:", error);
    res.status(500).json({
      message: "fail",
      data: {
        error: "An error occurred while retrieving transaction information.",
      },
    });
  }
};
