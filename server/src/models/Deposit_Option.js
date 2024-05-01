import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Define the DepositOption model
const DepositOption = sequelize.define(
  "deposit_options",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: "Deposit Option ID",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Deposit Option Name",
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
      comment: "Deposit Option Description",
    },
    interest_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Interest Rate for the Deposit Option",
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
      comment: "Term for the Deposit Option in months",
    },
  },
  {
    // Prevent Sequelize from auto-generating timestamps
    timestamps: false,
    // Specify the table name
    tableName: "deposit_options",
    // Specify the model name
    modelName: "DepositOption",
    // Add detailed comments for the table
    comment: "Table to store deposit options",
  }
);

export default DepositOption;
