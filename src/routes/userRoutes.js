import express from "express";
import userController from "../controllers/userController.js";
import { authorizeUser, protectedRoute } from "../middlewares/authorizeUser.js";
const router = express.Router();

router.get(
  "/cashier",
  protectedRoute,
  authorizeUser("owner"),
  userController.getCashier
);

router.get(
	"/profile",
	protectedRoute,
	userController.getProfile);

export default router;
