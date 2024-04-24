import express from "express";
import { getAllTransactions, getFilteredTransactions } from "../controllers/Transaction.js";

const router = express.Router();

// Tüm işlemleri getir
router.get("/", getAllTransactions);

// Belirli bir filtre ile işlemleri getir
router.get("/filter", getFilteredTransactions);

export { router as transactionRoutes };