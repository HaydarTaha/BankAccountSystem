import express from "express";
import {
  createCheckingAccount,
  deleteAccountById,
  updateAccountName,
  createDepositAccount,
} from "../controllers/Account.js";

const router = express.Router();

// Endpoint to create a new checking account
router.post("/checking-accounts", async (req, res) => {
  try {
    await createCheckingAccount(req, res);
  } catch (error) {
    console.error("Error creating checking account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to delete an account by accountID
router.put("/:accountID", async (req, res) => {
  try {
    await deleteAccountById(req, res);
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to update an account name by accountID
router.patch("/:accountID", async (req, res) => {
  try {
    await updateAccountName(req, res);
  } catch (error) {
    console.error("Error updating account name:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to create a new deposit account
router.post("/deposit-accounts", async (req, res) => {
  try {
    await createDepositAccount(req, res);
  } catch (error) {
    console.error("Error creating deposit account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export { router as accountRoutes };
