import { model, Schema } from "mongoose";
import Product from "./product.js";

const transactionProductSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  sub_total: { type: Number, required: true },
});

const transactionSchema = Schema({
  products: [transactionProductSchema],
  cashier: {
    type: String,
    required: true,
  },
  total_quantity: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approve", "rejected"],
    default: "pending",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

transactionSchema.pre("save", async function (next) {
  if (this.isModified("status") && this.status === "approve") {
    try {
      for (const item of this.products) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          throw new Error(`Product not found for ID: ${item.product_id}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Not enough stock available for product: ${product.product_name}`
          );
        }

        product.stock -= item.quantity;
        await product.save();
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
