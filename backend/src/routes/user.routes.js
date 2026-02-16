import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);

Router.route("/login").post(loginUser);


export default userRouter;
