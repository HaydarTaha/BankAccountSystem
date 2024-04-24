// invoiceRoutes.js

import express from "express";
import { createInvoice, getInvoices, markInvoiceAsPaid } from "../controllers/Invoices.js";

const router = express.Router();

// Endpoint to create a new invoice
router.post("/", async (req, res) => {
  try {
    await createInvoice(req, res);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all invoices
router.get("/", async (req, res) => {
  try {
    await getInvoices(req, res);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to mark an invoice as paid
router.patch("/:invoiceNumber", async (req, res) => {
  try {
    await markInvoiceAsPaid(req, res);
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export { router as invoiceRoutes };
