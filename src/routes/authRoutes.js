import express from 'express';
import authController from '../controllers/authController.js';
import { protectedRoute } from '../middlewares/authorizeUser.js';
const router = express.Router();

router.post(
	'/login',
	authController.login
);

router.post(
	'/logout',
	protectedRoute,
	authController.logout
);

router.post(
	'/refresh-token',
	authController.refreshAccessToken
);

export default router;