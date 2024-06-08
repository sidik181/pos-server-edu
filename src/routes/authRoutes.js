import express from 'express';
import { verifyToken } from '../middlewares/tokenManager.js';
import authController from '../controllers/authController.js';
const router = express.Router();

router.post(
	'/login',
	authController.login
);

router.post(
	'/logout',
	authController.logout
);

router.get(
	'/profile',
	verifyToken,
	authController.getProfile
);

router.post(
	'/session-token',
	authController.refreshToken
);

export default router;