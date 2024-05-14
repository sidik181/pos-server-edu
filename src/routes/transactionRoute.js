import express from 'express';
import transactionController from '../controllers/transactionController.js';
import { verifyToken } from '../middlewares/tokenManager.js';
import authorizeUser from '../middlewares/authorizeUser.js';
const router = express.Router();

router.post(
	'/order',
	verifyToken,
	transactionController.createTransaction
);

router.put(
	'/order-status/:transactionId',
	verifyToken,
	authorizeUser('owner'),
	transactionController.updateStatusTransaction
);

router.get(
	'/order',
	verifyToken,
	transactionController.getAllTransactions
);

export default router;