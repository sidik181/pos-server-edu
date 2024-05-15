import { model, Schema } from "mongoose";
import Product from "./product.js";

const transactionSchema = Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	cashier: {
    type: String,
    required: true
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
		required: true
	}
});

transactionSchema.pre('save', async function (next) {
  if (this.isModified('status') && this.status === 'approve') {
    try {
      const product = await Product.findById(this.product._id);
      if (product) {
        if (product.stock < this.quantity) {
          throw new Error('Not enough stock available');
        }
        product.stock -= this.quantity;
        await product.save();
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Transaction = model('Transaction', transactionSchema)

export default Transaction;