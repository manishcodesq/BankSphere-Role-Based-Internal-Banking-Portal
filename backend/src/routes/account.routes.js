import express from "express";
import {
  createAccount,
  getMyAccount,
  getAccountByNumber,
} from "../controllers/account.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const accountRouter = express.Router();

accountRouter
  .route("/")
  .post(verifyJWT, authorizeRole("customer"), createAccount);
accountRouter
  .route("/my")
  .get(verifyJWT, authorizeRole("customer"), getMyAccount);
accountRouter
  .route("/search/:accountNumber")
  .get(verifyJWT, authorizeRole("customer"), getAccountByNumber);

export default accountRouter;
