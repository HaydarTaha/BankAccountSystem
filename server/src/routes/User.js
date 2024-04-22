import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAccounts,
  getAccountById,
  getCheckingAccountById,
  getCheckingAccountsByUserId,
  getDepositAccountById,
  getDepositAccountsByUserId,
  getAccountTransactions,
  getTransactionById,
} from "../controllers/User.js";

const router = express.Router();

// Endpoint to register a new user
router.post("/register", async (req, res) => {
  try {
    await createUser(req, res);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to login a user
router.post("/login", async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to logout a user by clearing the cookie
router.delete("/logout", async (req, res) => {
  try {
    await logoutUser(req, res);
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all accounts for a user
router.get("/:userid/accounts", async (req, res) => {
  try {
    await getAccounts(req, res);
  } catch (error) {
    console.error("Error getting user accounts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get a specific account by accountID
router.get("/:userid/accounts/:id", async (req, res) => {
  try {
    await getAccountById(req, res);
  } catch (error) {
    console.error("Error getting user account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get a specific checking account by accountID
router.get("/:userid/checking-accounts/:accountID", async (req, res) => {
  try {
    await getCheckingAccountById(req, res);
  } catch (error) {
    console.error("Error getting user checking account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all checking account by userID
router.get("/:userid/checking-accounts", async (req, res) => {
  try {
    await getCheckingAccountsByUserId(req, res);
  } catch (error) {
    console.error("Error getting user checking accounts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get a specific deposit account by accountID
router.get("/:userid/deposit-accounts/:accountID", async (req, res) => {
  try {
    await getDepositAccountById(req, res);
  } catch (error) {
    console.error("Error getting user deposit account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all deposit account by userID
router.get("/:userid/deposit-accounts", async (req, res) => {
  try {
    await getDepositAccountsByUserId(req, res);
  } catch (error) {
    console.error("Error getting user deposit accounts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all transactions for a specific account
router.get("/:userid/accounts/:accountID/transactions", async (req, res) => {
  try {
    await getAccountTransactions(req, res);
  } catch (error) {
    console.error("Error getting user account transactions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get a specific transaction by transactionID
router.get(
  "/:userid/accounts/:accountID/transactions/:transactionID",
  async (req, res) => {
    try {
      await getTransactionById(req, res);
    } catch (error) {
      console.error("Error getting user transaction:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

export { router as userRoutes };
