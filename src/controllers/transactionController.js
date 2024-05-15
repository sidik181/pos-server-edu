import Transaction from '../models/transaction.js'
import Product from '../models/product.js'

const createTransaction = async (req, res, next) => {
	const { productId, quantity } = req.body;

	try {
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		if (product.stock < quantity) {
			return res.status(400).json({ message: 'Not enough stock available' });
		}

		const total_price = product.price * quantity;

		const newTransaction = new Transaction({
			product,
			cashier: req.user.name,
			quantity,
			total_price,
			status: 'pending'
		});

		await newTransaction.save();
		res.status(201).json({ message: 'Transaction created successfully', data: newTransaction });
	} catch (error) {
		next(error)
	}
}

const updateStatusTransaction = async (req, res, next) => {
	const { transactionId } = req.params;
	const { statusTransaction } = req.body;

	try {
		const transaction = await Transaction.findById(transactionId);

		if (!transaction) {
			return res.status(404).json({ message: 'Transaction not found' });
		}

		transaction.status = statusTransaction;

		await transaction.save();
		res.status(200).json({ message: 'Transaction updated successfully', data: transaction });
	} catch (error) {
		next(error);
	}
}

const getAllTransactions = async (req, res, next) => {
	try {
		let transactions;
		if (req.user.role === 'owner') {
			transactions = await Transaction.find().populate('product');
		} else {
			transactions = await Transaction.find({ cashier: req.user.name }).populate('product');
		}
		res.status(200).json({ data: transactions });
	} catch (error) {
		next(error);
	}
};


export default {
	createTransaction,
	updateStatusTransaction,
	getAllTransactions
}