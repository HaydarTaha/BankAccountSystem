// InvoiceController.js

import { InvoiceModel } from "../models/Invoices.js";

// Yeni bir fatura oluşturma
export const createInvoice = async (req, res) => {
    try {
      const { invoiceNumber, userID, accountID, amount, frequency, recipient } = req.body;
      const date = new Date();
      const newInvoice = new InvoiceModel({ invoiceNumber, userID, accountID, amount, frequency, recipient, date });
      await newInvoice.save();
      res.status(201).json(newInvoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

// Tüm faturaları getirme
export const getInvoices = async (req, res) => {
  try {
    const invoices = await InvoiceModel.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Faturayı ödenmiş olarak işaretleme
export const markInvoiceAsPaid = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { invoiceNumber },
      { paid: true },
      { new: true }
    );
    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found." });
    }
    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
