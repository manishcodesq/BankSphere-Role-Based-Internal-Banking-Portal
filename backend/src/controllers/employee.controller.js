import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Account } from "../models/account.model.js";
import { User } from "../models/user.model.js";

const listAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find()
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Accounts fetched successfully", accounts));
});

const getAccountByNumber = asyncHandler(async (req, res) => {
  const { accountNumber } = req.params;

  if (!accountNumber?.trim()) {
    throw new ApiError(400, "Account number is required");
  }

  const account = await Account.findOne({
    accountNumber: accountNumber.trim(),
  }).populate("userId", "name email role");

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Account fetched successfully", account));
});

const listCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: "customer" })
    .select("-password")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Customers fetched successfully", customers));
});

export { listAccounts, getAccountByNumber, listCustomers };
