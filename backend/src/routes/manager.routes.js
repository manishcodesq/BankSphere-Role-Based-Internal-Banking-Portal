import express from "express";
import { listAllUsers, updateUserRole } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.use(verifyJWT, authorizeRole("manager", "admin"));

router.get("/users", listAllUsers);
router.patch("/users/:userId/role", updateUserRole);

export default router;
