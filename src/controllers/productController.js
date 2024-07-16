import Product from '../models/product.js';
import Transaction from '../models/transaction.js'

const addProduct = async (req, res, next) => {
	try {
		let payload = req.body;

		if(payload.price < 500) {
			return res.status(400).json({ error: true, message: 'Harga produk minimal 500' });
		}

		if(payload.stock < 1) {
			return res.status(400).json({error: true, message: 'Stock produk minimal 1' });
		}
		
		let product = new Product(payload);
		await product.save();
		return res.status(200).json({ message:'Produk berhasil ditambahkan', data: product });
	} catch (error) {
		if(error.name === 'ValidationError') {
			return res.status(400).json({message: 'Validation error', errors: error.errors});
		}
		next(error);
	}
}

const getProducts = async (req, res, next) => {
	try {
		let message = 'Produk tidak ada';
		
		let products = await Product.find();
		let count = await Product.find().countDocuments();
		if (products.length === 0) {
			return res.status(200).json({ message });
		} else {
			return res.status(200).json({ data: products, count });
		}
	} catch (error) {
		next(error)
	}
}

const deleteProductById = async (req, res, next) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);

		if (!product) {
			return res.status(404).json({
				message: 'Produk tidak ditemukan'
			});
		}

		const productWithTransaction = await Transaction.findOne({product: product._id});
		
		if (productWithTransaction) {
			return res.status(401).json({
				message: 'Produk memiliki transaksi tidak dapat dihapus'
			});
		};

		return res.status(201).json({
			message: 'Produk berhasil dihapus'
		})
	} catch (error) {
		next(error)
	}
}

export default {
	addProduct,
	getProducts,
	deleteProductById
}