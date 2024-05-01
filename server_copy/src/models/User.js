import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";

// Define the User model
const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: "Unique identifier for the user",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "User's first name",
    },
    surname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "User's last name",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      comment: "User's email address",
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "User's hashed password",
    },
    role: {
      type: DataTypes.ENUM("User", "Admin"),
      defaultValue: "User",
      comment: "User's role (either 'User' or 'Admin')",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: "Timestamp when the user was created",
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
      comment: "Timestamp when the user was last updated",
    },
  },
  {
    // Prevent Sequelize from auto-generating timestamps
    timestamps: false,
    // Specify the table name
    tableName: "users",
    // Specify the model name
    modelName: "User",
    // Add detailed comments for the table
    comment: "Table containing user information",
  }
);

// Middleware to hash password before saving
User.beforeCreate(async (user, options) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  } catch (error) {
    throw new Error("Password hashing failed");
  }
});

// Method to compare password
User.prototype.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

export default User;
