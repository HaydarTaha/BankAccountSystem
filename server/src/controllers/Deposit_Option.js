import { DepositOptionModel } from "../models/Deposit_Option.js";
import mongoose from "mongoose";

export const createDepositOption = async (req, res) => {
  try {
    const { depositOptionName, depositOptionDescription, interestRate, term } =
      req.body;

    // Check if all required fields are provided
    if (
      !depositOptionName ||
      !depositOptionDescription ||
      !interestRate ||
      !term
    ) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Missing or invalid fields in request body." },
      });
    }

    // Create a new deposit option
    const newDepositOption = new DepositOptionModel({
      name: depositOptionName,
      description: depositOptionDescription,
      interestRate,
      term,
    });

    // Save the new deposit option to the database
    const savedDepositOption = await newDepositOption.save();

    // Respond with success message and depositOptionID
    res.status(201).json({
      message: "success",
      data: { depositOptionID: savedDepositOption._id },
    });
  } catch (error) {
    console.error("Error creating deposit option:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateDepositOption = async (req, res) => {
  try {
    const depositOptionID = req.params.depositOptionID;
    const { depositOptionName, interestRate, term } = req.body;

    // Check if the provided depositOptionID is valid
    if (!depositOptionID || !mongoose.isValidObjectId(depositOptionID)) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Invalid deposit option ID." },
      });
    }

    // Check if all required fields are provided
    if (!depositOptionName || !interestRate || !term) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Missing or invalid fields in request body." },
      });
    }

    // Find the deposit option by ID
    const depositOption = await DepositOptionModel.findById(depositOptionID);
    if (!depositOption) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Deposit option not found." },
      });
    }

    // Update the deposit option with new values
    if (depositOptionName) depositOption.name = depositOptionName;
    if (interestRate) depositOption.interestRate = interestRate;
    if (term) depositOption.term = term;

    // Save the updated deposit option to the database
    const updatedDepositOption = await depositOption.save();

    // Respond with success message and updated deposit option
    res.status(200).json({
      message: "success",
      data: {
        depositOptionID: updatedDepositOption._id,
        depositOptionName: updatedDepositOption.name,
        depositOptionDescription: updatedDepositOption.description,
        interestRate: parseFloat(updatedDepositOption.interestRate),
        term: updatedDepositOption.term,
      },
    });
  } catch (error) {
    console.error("Error updating deposit option:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteDepositOption = async (req, res) => {
  try {
    const depositOptionID = req.params.depositOptionID;

    // Check if the provided depositOptionID is valid
    if (!depositOptionID || !mongoose.isValidObjectId(depositOptionID)) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Invalid deposit option ID." },
      });
    }

    // Find the deposit option by ID
    const depositOption = await DepositOptionModel.findById(depositOptionID);
    if (!depositOption) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Deposit option not found." },
      });
    }

    // Delete the deposit option from the database
    await DepositOptionModel.deleteOne({ _id: depositOptionID });

    // Respond with success message and deleted deposit option ID
    res.status(200).json({
      message: "success",
      data: { depositOptionID },
    });
  } catch (error) {
    console.error("Error deleting deposit option:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getDepositOptionById = async (req, res) => {
  try {
    const depositOptionID = req.params.depositOptionID;

    // Check if the provided depositOptionID is valid
    if (!depositOptionID || !mongoose.isValidObjectId(depositOptionID)) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Invalid deposit option ID." },
      });
    }

    // Find the deposit option by ID
    const depositOption = await DepositOptionModel.findById(depositOptionID);
    if (!depositOption) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Deposit option not found." },
      });
    }

    // Respond with success message and deposit option details
    res.status(200).json({
      message: "success",
      data: {
        depositOptionID: depositOption._id,
        depositOptionName: depositOption.name,
        depositOptionDescription: depositOption.description,
        interestRate: parseFloat(depositOption.interestRate),
        term: depositOption.term,
      },
    });
  } catch (error) {
    console.error("Error retrieving deposit option by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getDepositOptions = async (req, res) => {
  try {
    // Find all deposit options
    const depositOptions = await DepositOptionModel.find();

    // Respond with success message and deposit options
    res.status(200).json({
      message: "success",
      data: depositOptions.map((depositOption) => ({
        depositOptionID: depositOption._id,
        depositOptionName: depositOption.name,
        depositOptionDescription: depositOption.description,
        interestRate: parseFloat(depositOption.interestRate),
        term: depositOption.term,
      })),
    });
  } catch (error) {
    console.error("Error retrieving deposit options:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
