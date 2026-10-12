import express from "express";
import {
  listPendingAccounts,
  approveAccount,
  rejectAccount,
  listAllUsers,
  updateUserRole,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.use(verifyJWT, authorizeRole("admin"));

router.get("/accounts/pending", listPendingAccounts);
router.patch("/accounts/:accountId/approve", approveAccount);
router.patch("/accounts/:accountId/reject", rejectAccount);
router.get("/users", listAllUsers);
router.patch("/users/:userId/role", updateUserRole);

export default router;
