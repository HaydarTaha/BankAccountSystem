import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 100,
    required: true,
    validate: {
      validator: (value) => /^[a-zA-ZğüşöçİĞÜŞÖÇ\s]+$/.test(value),
      message: "Name can only contain letters and spaces.",
    },
  },
  surname: {
    type: String,
    maxlength: 100,
    required: true,
    validate: {
      validator: (value) => /^[a-zA-ZğüşöçİĞÜŞÖÇ\s]+$/.test(value),
      message: "Surname can only contain letters and spaces.",
    },
  },
  email: {
    type: String,
    maxlength: 100,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) =>
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value),
      message: "Please enter a valid email address.",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100,
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to hash password before saving
UserSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) return next(); // Skip if password is not modified

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const UserModel = mongoose.model("User", UserSchema);
