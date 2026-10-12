import express from "express";
import {
  creditAccount,
  debitAccount,
  transferBetweenAccounts,
  getAccountTransactions,
  createTransaction,
} from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const transactionRouter = express.Router();

const customerOnly = [verifyJWT, authorizeRole("customer")];

transactionRouter.route("/").post(...customerOnly, createTransaction);
transactionRouter.route("/transfer").post(...customerOnly, transferBetweenAccounts);
transactionRouter.route("/credit/:accountId").post(...customerOnly, creditAccount);
transactionRouter.route("/debit/:accountId").post(...customerOnly, debitAccount);
transactionRouter
  .route("/history/:accountId")
  .get(...customerOnly, getAccountTransactions);

export default transactionRouter;
