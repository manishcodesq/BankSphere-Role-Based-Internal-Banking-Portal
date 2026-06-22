import express from "express";
import {
  creditAccount,
  debitAccount,
  transferBetweenAccounts,
  getAccountTransactions,
  createTransaction,
} from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const transactionRouter = express.Router();

transactionRouter.route("/").post(verifyJWT, createTransaction);
transactionRouter.route("/transfer").post(verifyJWT, transferBetweenAccounts);
transactionRouter.route("/credit/:accountId").post(verifyJWT, creditAccount);
transactionRouter.route("/debit/:accountId").post(verifyJWT, debitAccount);
transactionRouter
  .route("/:accountId")
  .get(verifyJWT, getAccountTransactions);

export default transactionRouter;
