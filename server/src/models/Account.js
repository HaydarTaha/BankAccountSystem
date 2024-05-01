import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Define the Account model
const Account = sequelize.define(
  "accounts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: "Unique identifier for the account",
    },
    account_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: true,
      comment: "Unique account identifier",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID of the associated user",
      references: {
        model: "users",
        key: "id",
      },
    },
    deposit_option_id: {
      type: DataTypes.INTEGER,
      comment: "ID of the associated deposit option",
      references: {
        model: "deposit_options",
        key: "id",
      },
    },
    account_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Name of the account",
    },
    account_type: {
      type: DataTypes.ENUM("Checking", "Deposit"),
      allowNull: false,
      comment: "Type of the account (Checking or Deposit)",
    },
    iban: {
      type: DataTypes.STRING(26),
      comment: "International Bank Account Number (IBAN) of the account",
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: false,
      comment: "Current balance of the account",
    },
    available_balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: false,
      comment: "Available balance for transactions",
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      comment: "Currency of the account",
    },
    open_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      comment: "Date when the account was opened",
    },
  },
  {
    // Disable Sequelize's default timestamp fields
    timestamps: false,
    // Define the table name
    tableName: "accounts",
    // Define the model name
    modelName: "Account",
    // Table comment
    comment: "Table containing account information",
    // Define the table's indexes
    indexes: [
      {
        unique: false,
        fields: ["user_id"],
      },
      {
        unique: false,
        fields: ["deposit_option_id"],
      },
    ],
  }
);

// Before saving the account, generate unique account_id and IBAN
Account.beforeCreate(async (account, options) => {
  try {
    // Generate a unique account_id
    const newAccountId = await generateUniqueAccountId();
    account.account_id = newAccountId;
    // Generate IBAN based on the generated account_id
    account.iban = generateIBAN(newAccountId);
  } catch (error) {
    throw new Error("Failed to generate unique account ID or IBAN");
  }
});

// Function to generate a unique account_id
async function generateUniqueAccountId() {
  const min = 1;
  const max = 2147483647;
  let newAccountId;
  do {
    newAccountId = Math.floor(min + Math.random() * (max - min + 1));
  } while (!(await isAccountIdUnique(newAccountId)));
  return newAccountId;
}

// Function to check if an account_id is unique
async function isAccountIdUnique(accountId) {
  const existingAccount = await Account.findOne({
    where: { account_id: accountId },
  });
  return !existingAccount;
}

// Function to generate IBAN based on account_id
function generateIBAN(accountId) {
  const countryCode = "TR";
  const controlDigits = "96";
  const bankCode = "12345";
  const reserveArea = "0";
  const accountIdString = String(accountId).padStart(16, "0");
  return `${countryCode}${controlDigits}${bankCode}${reserveArea}${accountIdString}`;
}

export default Account;
