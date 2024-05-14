import express from 'express';
import productController from '../controllers/productController.js';
import { verifyToken } from '../middlewares/tokenManager.js';
import authorizeUser from '../middlewares/authorizeUser.js';
const router = express.Router();

router.post(
	'/products',
	verifyToken,
	authorizeUser('owner'),
	productController.addProduct
);

router.get(
	'/products',
	verifyToken,
	productController.getProducts
);

router.delete(
	'/products/:id',
	verifyToken,
	authorizeUser('owner'),
	productController.deleteProductById
);

export default router;