import User from "../models/User.js";
import Account from "../models/Account.js";
import DepositOption from "../models/Deposit_Option.js";
import Transaction from "../models/Transaction.js";

const createResource = async (req, res, Model) => {
  try {
    const resource = await Model.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResources = async (req, res, Model) => {
  try {
    const resources = await Model.findAll();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateResource = async (req, res, Model) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const resource = await Model.findByPk(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    await resource.update(body);
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteResource = async (req, res, Model) => {
  const { id } = req.params;
  try {
    const resource = await Model.findByPk(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    await resource.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  createResource(req, res, User);
};

export const getUsers = async (req, res) => {
  getResources(req, res, User);
};

export const updateUser = async (req, res) => {
  updateResource(req, res, User);
};

export const deleteUser = async (req, res) => {
  deleteResource(req, res, User);
};

export const createAccount = async (req, res) => {
  createResource(req, res, Account);
};

export const getAccounts = async (req, res) => {
  getResources(req, res, Account);
};

export const updateAccount = async (req, res) => {
  updateResource(req, res, Account);
};

export const deleteAccount = async (req, res) => {
  deleteResource(req, res, Account);
};

export const createDepositOption = async (req, res) => {
  createResource(req, res, DepositOption);
};

export const getDepositOptions = async (req, res) => {
  getResources(req, res, DepositOption);
};

export const updateDepositOption = async (req, res) => {
  updateResource(req, res, DepositOption);
};

export const deleteDepositOption = async (req, res) => {
  deleteResource(req, res, DepositOption);
};

export const createTransaction = async (req, res) => {
  createResource(req, res, Transaction);
};

export const getTransactions = async (req, res) => {
  getResources(req, res, Transaction);
};

export const updateTransaction = async (req, res) => {
  updateResource(req, res, Transaction);
};

export const deleteTransaction = async (req, res) => {
  deleteResource(req, res, Transaction);
};
