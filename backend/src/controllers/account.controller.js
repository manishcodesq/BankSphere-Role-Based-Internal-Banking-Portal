import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Account } from "../models/account.model.js";
import { Transaction } from "../models/transaction.model.js";

const generateAccountNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BS${timestamp}${random}`;
};

const createAccount = asyncHandler(async (req, res) => {
  const { accountType } = req.body;

  if (!accountType || accountType.trim() === "") {
    throw new ApiError(400, "Account type is required");
  }

  const normalizedAccountType = accountType.toUpperCase();

  if (!["SAVINGS", "CURRENT"].includes(normalizedAccountType)) {
    throw new ApiError(400, "Account type must be SAVINGS or CURRENT");
  }

  const existingAccount = await Account.findOne({
    userId: req.user._id,
    accountType: normalizedAccountType,
  });

  if (existingAccount) {
    throw new ApiError(
      409,
      `You already have a ${normalizedAccountType} account`
    );
  }

  let accountNumber;
  let isUnique = false;

  while (!isUnique) {
    accountNumber = generateAccountNumber();
    const duplicate = await Account.findOne({ accountNumber });
    if (!duplicate) {
      isUnique = true;
    }
  }

  const account = await Account.create({
    userId: req.user._id,
    accountNumber,
    accountType: normalizedAccountType,
  });

  const createdAccount = await Account.findById(account._id).populate(
    "userId",
    "-password"
  );

  if (!createdAccount) {
    throw new ApiError(500, "Account creation failed, please try again");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Account created successfully", createdAccount));
});

const getMyAccount = asyncHandler(async (req, res) => {
  const account = await Account.findOne({ userId: req.user._id });

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  const transactions = await Transaction.find({ accountId: account._id }).sort({
    createdAt: -1,
  });

  return res.status(200).json(
    new ApiResponse(200, "Account fetched successfully", {
      account,
      transactions,
    })
  );
});

const getAccountByNumber = asyncHandler(async (req, res) => {
  const { accountNumber } = req.params;

  if (!accountNumber || accountNumber.trim() === "") {
    throw new ApiError(400, "Account number is required");
  }

  const account = await Account.findOne({ accountNumber }).populate("userId", "name email");

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Account fetched successfully", account));
});

export { createAccount, getMyAccount, getAccountByNumber };
