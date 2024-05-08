import User from "../models/User.js";
import Account from "../models/Account.js";
import DepositOption from "../models/Deposit_Option.js";
import Transaction from "../models/Transaction.js";
import { Op } from "sequelize";

export const createUser = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, surname, email, and password are required." });
    }

    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // Create a new user instance
    const newUser = User.build({
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
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // At this point, user is authenticated

    res.cookie("user", user.id, {
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

export const getNameSurnameById = async (req, res) => {
  try {
    const userId = req.params.userid;

    // Get user by ID
    const user = await User.findByPk(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with user's name and surname
    const { name, surname } = user;
    res.status(200).json({ name, surname });
  } catch (error) {
    console.error("Error getting user's name and surname by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getUserRoleById = async (req, res) => {
  try {
    const userId = req.params.userid;

    // Get user by ID
    const user = await User.findByPk(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with user's role
    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error("Error getting user's role by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAccounts = async (req, res) => {
  try {
    const userId = req.params.userid;

    // Retrieve user accounts from the database
    const userAccounts = await Account.findAll({ where: { user_id: userId } });

    // Prepare response payload
    const responseData = await Promise.all(
      userAccounts.map(async (account) => {
        const accountID = account.account_id;
        const accountName = account.account_name;
        const accountType = account.account_type;
        const iban = account.iban;
        const balance = account.balance;
        const availableBalance = account.available_balance;
        const currency = account.currency;
        const userID = account.user_id;
        const depositOption = account.deposit_option_id;
        const openDate = account.open_date;

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
          const depositOptionDetails = await DepositOption.findByPk(
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
              interestRate: parseFloat(depositOptionDetails.interest_rate),
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
    const account = await Account.findOne({
      where: { account_id: accountId, user_id: userId },
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
      accountName: account.account_name,
      accountType: account.account_type,
      iban: account.iban,
      balance: parseFloat(account.balance),
      availableBalance: parseFloat(account.available_balance),
      currency: account.currency,
      userID: account.user_id,
      openDate: account.open_date,
    };

    if (account.account_type === "Deposit") {
      const depositOptionDetails = await DepositOption.findByPk(
        account.deposit_option_id
      );
      responseData.depositOption = {
        depositOptionName: depositOptionDetails.name,
        depositOptionDescription: depositOptionDetails.description,
        interestRate: parseFloat(depositOptionDetails.interest_rate),
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
    const account = await Account.findOne({
      where: {
        account_id: accountID,
        user_id: userid,
        account_type: "Checking",
      },
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
        accountID: account.account_id,
        accountType: account.account_type,
        balance: parseFloat(account.balance),
        userID: account.user_id,
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
    const accounts = await Account.findAll({
      where: { user_id: userid, account_type: "Checking" },
    });

    // Respond with success message and account details
    res.status(200).json({
      message: "success",
      data: accounts.map((account) => ({
        accountID: account.account_id,
        accountType: account.account_type,
        balance: parseFloat(account.balance),
        userID: account.user_id,
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
    const account = await Account.findOne({
      where: {
        account_id: accountID,
        user_id: userid,
        account_type: "Deposit",
      },
    });

    // If account doesn't exist, return error
    if (!account) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Find the deposit option details
    const depositOption = await DepositOption.findByPk(
      account.deposit_option_id
    );

    // Respond with success message and account details
    res.status(200).json({
      message: "success",
      data: {
        accountID: account.account_id,
        accountType: account.account_type,
        balance: parseFloat(account.balance),
        userID: account.user_id,
        depositOption: {
          depositOptionName: depositOption.name,
          depositOptionDescription: depositOption.description,
          interestRate: parseFloat(depositOption.interest_rate),
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
    const accounts = await Account.findAll({
      where: { user_id: userid, account_type: "Deposit" },
    });

    // Prepare response payload
    const responseData = await Promise.all(
      accounts.map(async (account) => {
        const depositOption = await DepositOption.findByPk(
          account.deposit_option_id
        );

        return {
          accountID: account.account_id,
          accountType: account.account_type,
          balance: parseFloat(account.balance),
          userID: account.user_id,
          depositOption: {
            depositOptionName: depositOption.name,
            depositOptionDescription: depositOption.description,
            interestRate: parseFloat(depositOption.interest_rate),
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
    console.log("userid", userid);
    console.log("accountID", accountID);

    // Check the parameters are given correctly
    if (!userid || !accountID) {
      return res.status(400).json({
        message: "fail",
        data: { error: "User ID and account ID are required." },
      });
    }

    // Check if the user exists
    const user = await User.findByPk(userid);
    if (!user) {
      return res.status(404).json({
        message: "fail",
        data: { error: "The specified user ID does not exist." },
      });
    }

    // Check if the account exists
    const account = await Account.findOne({
      where: { account_id: accountID, user_id: userid },
    });

    if (!account) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Retrieve transaction history for the account
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { sender_account_id: accountID },
          { receiver_account_id: accountID },
        ],
      },
    });

    // Respond with success message and transaction history
    res.status(200).json({
      message: "success",
      data: transactions.map((transaction) => ({
        transactionID: transaction.id,
        senderAccountID: transaction.sender_account_id,
        receiverAccountID: transaction.receiver_account_id,
        amount: parseFloat(transaction.amount),
        transactionType: transaction.transaction_type,
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

    // Check the parameters are given correctly
    if (!userid || !accountID || !transactionID) {
      return res.status(400).json({
        message: "fail",
        data: {
          error: "User ID, account ID, and transaction ID are required.",
        },
      });
    }

    // Check if the user exists
    const user = await User.findByPk(userid);
    if (!user) {
      return res.status(404).json({
        message: "fail",
        data: { error: "The specified user ID does not exist." },
      });
    }

    // Check if the account exists
    const account = await Account.findOne({
      where: { account_id: accountID, user_id: userid },
    });

    if (!account) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Retrieve the transaction from the database based on its ID and the associated account ID
    const transaction = await Transaction.findOne({
      where: {
        id: transactionID,
        [Op.or]: [
          { sender_account_id: accountID },
          { receiver_account_id: accountID },
        ],
      },
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
      transactionID: transaction.id,
      senderAccountID: transaction.sender_account_id,
      receiverAccountID: transaction.receiver_account_id,
      amount: parseFloat(transaction.amount),
      transactionType: transaction.transaction_type,
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
