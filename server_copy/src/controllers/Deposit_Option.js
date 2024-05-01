import DepositOption from "../models/Deposit_Option.js";

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
    const newDepositOption = new DepositOption({
      name: depositOptionName,
      description: depositOptionDescription,
      interest_rate: interestRate,
      term,
    });

    // Save the new deposit option to the database
    const savedDepositOption = await newDepositOption.save();

    // Respond with success message and depositOptionID
    res.status(201).json({
      message: "success",
      data: { depositOptionID: savedDepositOption.id },
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

    // Check if all required fields are provided
    if (!depositOptionName || !interestRate || isNaN(term)) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Missing or invalid fields in request body." },
      });
    }

    // Check if the provided depositOptionID is valid
    if (!depositOptionID || isNaN(depositOptionID)) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Invalid deposit option ID." },
      });
    }

    // Find the deposit option by ID
    const depositOption = await DepositOption.findByPk(depositOptionID);
    if (!depositOption) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Deposit option not found." },
      });
    }

    // Update the deposit option with new values
    await depositOption.update({
      name: depositOptionName,
      interest_rate: interestRate,
      term,
    });

    // Fetch the updated deposit option to get all fields including description
    const updatedDepositOption = await DepositOption.findByPk(depositOptionID);

    // Respond with success message and updated deposit option
    res.status(200).json({
      message: "success",
      data: {
        depositOptionID: updatedDepositOption.id,
        depositOptionName: updatedDepositOption.name,
        depositOptionDescription: updatedDepositOption.description,
        interestRate: parseFloat(updatedDepositOption.interest_rate),
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
    if (!depositOptionID || isNaN(depositOptionID)) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Invalid deposit option ID." },
      });
    }

    // Find the deposit option by ID
    const depositOption = await DepositOption.findByPk(depositOptionID);
    if (!depositOption) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Deposit option not found." },
      });
    }

    // Delete the deposit option from the database
    await depositOption.destroy();

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
    if (!depositOptionID || isNaN(depositOptionID)) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Invalid deposit option ID." },
      });
    }

    // Find the deposit option by ID
    const depositOption = await DepositOption.findByPk(depositOptionID);
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
        depositOptionID: depositOption.id,
        depositOptionName: depositOption.name,
        depositOptionDescription: depositOption.description,
        interestRate: parseFloat(depositOption.interest_rate),
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
    const depositOptions = await DepositOption.findAll();

    // Respond with success message and deposit options
    res.status(200).json({
      message: "success",
      data: depositOptions.map((depositOption) => ({
        depositOptionID: depositOption.id,
        depositOptionName: depositOption.name,
        depositOptionDescription: depositOption.description,
        interestRate: parseFloat(depositOption.interest_rate),
        term: depositOption.term,
      })),
    });
  } catch (error) {
    console.error("Error retrieving deposit options:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
