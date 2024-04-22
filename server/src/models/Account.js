import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  accountID: {
    type: Number,
    unique: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  depositOption: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deposit_Option",
  },
  accountName: {
    type: String,
    maxlength: 100,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Checking", "Deposit"],
    required: true,
  },
  iban: {
    type: String,
    maxlength: 26,
  },
  balance: {
    type: mongoose.Types.Decimal128,
    default: 0.0,
    required: true,
  },
  availableBalance: {
    type: mongoose.Types.Decimal128,
    default: 0.0,
    required: true,
  },
  currency: {
    type: String,
    maxlength: 3,
    required: true,
  },
  openDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Middleware to generate unique accountID and IBAN
AccountSchema.pre("save", async function (next) {
  try {
    const account = this;
    if (!account.isNew) return next(); // Skip if account is not new
    const newAccountID = await generateUniqueAccountID();
    account.accountID = newAccountID;
    account.iban = generateIBAN(newAccountID);
    next();
  } catch (error) {
    next(error);
  }
});

// Function to generate a unique accountID with 16 digits
async function generateUniqueAccountID() {
  const min = 1000000000000000;
  const max = 9999999999999999;
  let newAccountID;
  do {
    newAccountID = Math.floor(min + Math.random() * (max - min + 1));
  } while (!(await isAccountIDUnique(newAccountID)));
  return newAccountID;
}

// Function to check if an accountID is unique
async function isAccountIDUnique(accountID) {
  const existingAccount = await mongoose.models.Account.findOne({ accountID });
  return !existingAccount;
}

// Function to generate IBAN based on accountID
function generateIBAN(accountID) {
  const countryCode = "TR";
  const controlDigits = "96";
  const bankCode = "12345";
  const reserveArea = "0";
  const accountIDString = String(accountID).padStart(16, "0");
  return `${countryCode}${controlDigits}${bankCode}${reserveArea}${accountIDString}`;
}

export const AccountModel = mongoose.model("Account", AccountSchema);
