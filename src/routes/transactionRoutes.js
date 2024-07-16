import express from 'express';
import transactionController from '../controllers/transactionController.js';
import { authorizeUser, protectedRoute } from '../middlewares/authorizeUser.js';
const router = express.Router();

router.post(
	'/order',
	protectedRoute,
	transactionController.createTransaction
);

router.put(
	'/order-status/:transactionId',
	protectedRoute,
	authorizeUser('owner'),
	transactionController.updateStatusTransaction
);

router.get(
	'/order',
	protectedRoute,
	transactionController.getAllTransactions
);

export default router;