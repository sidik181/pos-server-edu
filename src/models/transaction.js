import { model, Schema } from "mongoose";

const transactionSchema = Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product'
	},
	quantity: {
		type: Number,
		required: true,
	},
	total_price: {
		type: Number,
		required: true
	},
	status: {
		type: String,
		enum: ["pending", "approve", "rejected"],
		default: "pending",
	}
});

// transactionSchema.post('save', async function () {

// });

const Transaction = model('Transaction', transactionSchema)

export default Transaction;