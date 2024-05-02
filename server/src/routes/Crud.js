import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
  createDepositOption,
  getDepositOptions,
  updateDepositOption,
  deleteDepositOption,
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/Crud.js";

const router = express.Router();

// CRUD routes
const resources = [
  {
    path: "/users",
    create: createUser,
    get: getUsers,
    update: updateUser,
    remove: deleteUser,
  },
  {
    path: "/accounts",
    create: createAccount,
    get: getAccounts,
    update: updateAccount,
    remove: deleteAccount,
  },
  {
    path: "/deposit-options",
    create: createDepositOption,
    get: getDepositOptions,
    update: updateDepositOption,
    remove: deleteDepositOption,
  },
  {
    path: "/transactions",
    create: createTransaction,
    get: getTransactions,
    update: updateTransaction,
    remove: deleteTransaction,
  },
];

resources.forEach(({ path, create, get, update, remove }) => {
  router.post(path, async (req, res) => {
    try {
      await create(req, res);
    } catch (error) {
      console.error(`Error creating resource at ${path}:`, error);
      res.status(500).json({ message: "Internal server error." });
    }
  });

  router.get(path, async (req, res) => {
    try {
      await get(req, res);
    } catch (error) {
      console.error(`Error getting resources at ${path}:`, error);
      res.status(500).json({ message: "Internal server error." });
    }
  });

  router.patch(`${path}/:id`, async (req, res) => {
    try {
      await update(req, res);
    } catch (error) {
      console.error(`Error updating resource at ${path}:`, error);
      res.status(500).json({ message: "Internal server error." });
    }
  });

  router.delete(`${path}/:id`, async (req, res) => {
    try {
      await remove(req, res);
    } catch (error) {
      console.error(`Error deleting resource at ${path}:`, error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
});

export { router as crudRoutes };
