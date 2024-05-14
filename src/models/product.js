import { model, Schema } from "mongoose";

const productSchema = Schema({
	product_name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	stock: {
		type: Number,
		required: true
	}
});

const Product = model('Product', productSchema)

export default Product;