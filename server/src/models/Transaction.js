import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Define the Transaction model
const Transaction = sequelize.define(
  "transactions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: "Unique identifier for the transaction",
    },
    sender_account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID of the sender account",
      references: {
        model: "accounts",
        key: "id",
      },
    },
    receiver_account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID of the receiver account",
      references: {
        model: "accounts",
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      comment: "Date and time of the transaction",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Amount of the transaction",
    },
    transaction_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Type of the transaction",
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
      comment: "Description of the transaction",
    },
  },
  {
    // Prevent Sequelize from auto-generating timestamps
    timestamps: false,
    // Specify the table name
    tableName: "transactions",
    // Specify the model name
    modelName: "Transaction",
    // Add detailed comments for the table
    comment: "Table containing transaction information",
    // Define the table's indexes
    indexes: [
      {
        unique: false,
        fields: ["sender_account_id"],
      },
      {
        unique: false,
        fields: ["receiver_account_id"],
      },
    ],
  }
);

export default Transaction;
