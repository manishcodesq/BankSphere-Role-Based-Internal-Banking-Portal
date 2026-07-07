import express from "express";
import {
  createAccount,
  getMyAccount,
  getAccountByNumber,
} from "../controllers/account.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const accountRouter = express.Router();

accountRouter.route("/").post(verifyJWT, createAccount);
accountRouter.route("/my").get(verifyJWT, getMyAccount);
accountRouter.route("/search/:accountNumber").get(verifyJWT, getAccountByNumber);

export default accountRouter;
