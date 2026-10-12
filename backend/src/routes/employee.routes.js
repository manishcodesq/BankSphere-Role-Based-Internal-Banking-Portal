import express from "express";
import {
  listAccounts,
  getAccountByNumber,
  listCustomers,
} from "../controllers/employee.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.use(verifyJWT, authorizeRole("employee", "manager", "admin"));

router.get("/accounts", listAccounts);
router.get("/accounts/search/:accountNumber", getAccountByNumber);
router.get("/customers", listCustomers);

export default router;
