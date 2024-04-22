import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  senderAccountID: {
    type: Number,
    ref: "Account",
    required: true,
  },
  receiverAccountID: {
    type: Number,
    ref: "Account",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  transactionType: {
    type: String,
    maxlength: 50,
    required: true,
  },
  description: {
    type: String,
    maxlength: 250,
    required: true,
  },
});

export const TransactionModel = mongoose.model(
  "Transaction",
  TransactionSchema
);
