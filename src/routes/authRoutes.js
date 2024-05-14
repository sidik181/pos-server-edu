import express from 'express';
import authController from '../controllers/authController.js';
const router = express.Router();

router.get(
	'/login',
	authController.login
);

router.post(
	'/logout',
	authController.logout
);

router.post(
	'/session-token',
	authController.refreshToken
);

export default router;