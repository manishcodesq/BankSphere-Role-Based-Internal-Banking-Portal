import express from "express";
import passport from "../config/passport.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const frontendOrigin = () =>
  process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "http://localhost:5173";

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${frontendOrigin()}/login?error=google_auth_failed`,
  }),
  asyncHandler(async (req, res) => {
    const accessToken = req.user.generateAccessToken();
    const user = await User.findById(req.user._id).select("-password");

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .redirect(
        `${frontendOrigin()}/auth/callback?token=${encodeURIComponent(accessToken)}`
      );
  })
);

export default router;
