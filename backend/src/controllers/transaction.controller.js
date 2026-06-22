import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Account } from "../models/account.model.js";
import { Transaction } from "../models/transaction.model.js";

const getOwnedAccount = async (accountId, userId) => {
  const account = await Account.findOne({ _id: accountId, userId });

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  return account;
};

const validateAmount = (amount) => {
  const parsedAmount = Number(amount);

  if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new ApiError(400, "Amount must be greater than zero");
  }

  return parsedAmount;
};

const applyCredit = async (accountId, userId, amount, description) => {
  const parsedAmount = validateAmount(amount);
  const account = await getOwnedAccount(accountId, userId);

  account.balance += parsedAmount;
  await account.save();

  const transaction = await Transaction.create({
    accountId: account._id,
    type: "CREDIT",
    amount: parsedAmount,
    description: description || "Credit transaction",
  });

  return { account, transaction };
};

const applyDebit = async (accountId, userId, amount, description) => {
  const parsedAmount = validateAmount(amount);
  const account = await getOwnedAccount(accountId, userId);

  if (account.balance < parsedAmount) {
    throw new ApiError(400, "Insufficient balance");
  }

  account.balance -= parsedAmount;
  await account.save();

  const transaction = await Transaction.create({
    accountId: account._id,
    type: "DEBIT",
    amount: parsedAmount,
    description: description || "Debit transaction",
  });

  return { account, transaction };
};

const creditAccount = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;
  const result = await applyCredit(
    req.params.accountId,
    req.user._id,
    amount,
    description
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "Amount credited successfully", result));
});

const debitAccount = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;
  const result = await applyDebit(
    req.params.accountId,
    req.user._id,
    amount,
    description
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "Amount debited successfully", result));
});

const transferBetweenAccounts = asyncHandler(async (req, res) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;
  const parsedAmount = validateAmount(amount);

  if (!fromAccountId || !toAccountId) {
    throw new ApiError(400, "From and to account IDs are required");
  }

  if (fromAccountId === toAccountId) {
    throw new ApiError(400, "Cannot transfer to the same account");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fromAccount = await Account.findOne({
      _id: fromAccountId,
      userId: req.user._id,
    }).session(session);

    if (!fromAccount) {
      throw new ApiError(404, "Source account not found");
    }

    const toAccount = await Account.findById(toAccountId).session(session);

    if (!toAccount) {
      throw new ApiError(404, "Destination account not found");
    }

    if (fromAccount.balance < parsedAmount) {
      throw new ApiError(400, "Insufficient balance");
    }

    fromAccount.balance -= parsedAmount;
    toAccount.balance += parsedAmount;

    await fromAccount.save({ session });
    await toAccount.save({ session });

    const [debitTransaction] = await Transaction.create(
      [
        {
          accountId: fromAccount._id,
          type: "DEBIT",
          amount: parsedAmount,
          description:
            description || `Transfer to ${toAccount.accountNumber}`,
        },
      ],
      { session }
    );

    const [creditTransaction] = await Transaction.create(
      [
        {
          accountId: toAccount._id,
          type: "CREDIT",
          amount: parsedAmount,
          description:
            description || `Transfer from ${fromAccount.accountNumber}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json(
      new ApiResponse(201, "Transfer completed successfully", {
        fromAccount,
        toAccount,
        debitTransaction,
        creditTransaction,
      })
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const getAccountTransactions = asyncHandler(async (req, res) => {
  const { accountId } = req.params;

  const account = await getOwnedAccount(accountId, req.user._id);

  const transactions = await Transaction.find({ accountId: account._id }).sort({
    createdAt: -1,
  });

  return res.status(200).json(
    new ApiResponse(200, "Transactions fetched successfully", {
      account,
      transactions,
    })
  );
});

const createTransaction = asyncHandler(async (req, res) => {
  const { accountId, type, amount, description } = req.body;

  if (!accountId || !type) {
    throw new ApiError(400, "Account ID and transaction type are required");
  }

  const normalizedType = type.toUpperCase();

  if (!["CREDIT", "DEBIT"].includes(normalizedType)) {
    throw new ApiError(400, "Transaction type must be CREDIT or DEBIT");
  }

  if (normalizedType === "CREDIT") {
    const result = await applyCredit(
      accountId,
      req.user._id,
      amount,
      description
    );

    return res
      .status(201)
      .json(new ApiResponse(201, "Amount credited successfully", result));
  }

  const result = await applyDebit(
    accountId,
    req.user._id,
    amount,
    description
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "Amount debited successfully", result));
});

export {
  creditAccount,
  debitAccount,
  transferBetweenAccounts,
  getAccountTransactions,
  createTransaction,
};
