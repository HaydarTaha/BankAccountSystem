import mongoose from "mongoose";

const { Schema } = mongoose;

const firmSchema = new Schema({
  company_name: {
    type: String,
    required: true
  },
  subscription_id: {
    type: Number,
    required: true
  },
  payment_value: {
    type: Number,
    required: true
  },
  unique_company_id: {
    type: String,
    required: true
  },
  interest_rate_overdue_payment: {
    type: Number,
    required: true
  },
  payment_status: {
    type: String,
    required: true
  },
  subscription_start_date: {
    type: String,
    required: true
  },
  subscription_end_date: {
    type: String,
    required: true
  }
});


export const FirmModel = mongoose.model("Firm", firmSchema);
