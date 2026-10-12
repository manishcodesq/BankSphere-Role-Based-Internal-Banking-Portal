import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Account } from "../models/account.model.js";
import { User } from "../models/user.model.js";

const VALID_ROLES = ["customer", "employee", "manager", "admin"];

const listPendingAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find({ status: "PENDING" })
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Pending accounts fetched successfully", accounts)
    );
});

const approveAccount = asyncHandler(async (req, res) => {
  const { accountId } = req.params;

  const account = await Account.findById(accountId).populate(
    "userId",
    "name email role"
  );

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  if (account.status === "REJECTED") {
    throw new ApiError(400, "Rejected accounts cannot be approved");
  }

  account.status = "ACTIVE";
  await account.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Account approved successfully", account));
});

const rejectAccount = asyncHandler(async (req, res) => {
  const { accountId } = req.params;

  const account = await Account.findById(accountId).populate(
    "userId",
    "name email role"
  );

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  account.status = "REJECTED";
  await account.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Account rejected successfully", account));
});

const listAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  let { role } = req.body;

  if (typeof role === "string") {
    role = role.trim();
  }

  if (!role || !VALID_ROLES.includes(role)) {
    throw new ApiError(400, "A valid role is required");
  }

  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot change your own role");
  }

  if (req.user.role === "manager") {
    if (!["customer", "employee"].includes(role)) {
      throw new ApiError(
        403,
        "Managers can only assign customer or employee roles"
      );
    }
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.role = role;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "User role updated successfully", user));
});

export {
  listPendingAccounts,
  approveAccount,
  rejectAccount,
  listAllUsers,
  updateUserRole,
};
