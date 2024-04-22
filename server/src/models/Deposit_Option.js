import mongoose from "mongoose";

const DepositOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 100,
    required: true,
  },
  description: {
    type: String,
    maxlength: 250,
    required: true,
  },
  interestRate: {
    type: mongoose.Types.Decimal128,
    required: true,
    min: 0,
  },
  term: {
    type: Number,
    required: true,
    min: 1,
  },
});

export const DepositOptionModel = mongoose.model(
  "Deposit_Option",
  DepositOptionSchema
);
