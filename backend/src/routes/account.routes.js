import express from "express";
import {
  createAccount,
  getMyAccount,
} from "../controllers/account.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const accountRouter = express.Router();

accountRouter.route("/").post(verifyJWT, createAccount);
accountRouter.route("/my").get(verifyJWT, getMyAccount);

export default accountRouter;
