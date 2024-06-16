import express from 'express';
import productController from '../controllers/productController.js';
import { authorizeUser, protectedRoute } from '../middlewares/authorizeUser.js';
const router = express.Router();

router.post(
	'/products',
	protectedRoute,
	authorizeUser('owner'),
	productController.addProduct
);

router.get(
	'/products',
	protectedRoute,
	productController.getProducts
);

router.delete(
	'/products/:id',
	protectedRoute,
	authorizeUser('owner'),
	productController.deleteProductById
);

export default router;