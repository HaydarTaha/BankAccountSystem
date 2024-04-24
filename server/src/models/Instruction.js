// Instruction Schema
const InstructionSchema = new mongoose.Schema({
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    recipient: {
      type: String,
      required: true,
    },
    senderAccountID: {
      type: Number,
      required: true,
    },
    receiverAccountID: {
      type: Number,
      required: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  });

  export const InstructionModel = mongoose.model("Instruction", InstructionSchema);