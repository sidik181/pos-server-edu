import { model, Schema } from "mongoose";

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

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
