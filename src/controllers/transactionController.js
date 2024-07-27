import Transaction from "../models/transaction.js";
import Product from "../models/product.js";

const createTransaction = async (req, res, next) => {
  const { items } = req.body;

  try {
    let total_price = 0;
    let total_quantity = 0;
    const shipping_cost = 10000;
    const transactionProducts = [];

    for (const item of items) {
      const { productId, qty } = item;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < qty) {
        return res.status(400).json({ message: "Not enough stock available" });
      }

      total_price += product.price * qty;
      total_quantity += qty;
      transactionProducts.push({
        product_id: productId,
        product_name: product.product_name,
        price: product.price,
        quantity: qty,
        sub_total: product.price * qty,
      });
    }

    total_price += shipping_cost;
    const newTransaction = new Transaction({
      products: transactionProducts,
      cashier: req.user.name,
      total_quantity,
      total_price,
    });

    await newTransaction.save();
    res.status(201).json({
      message: "Transaction created successfully",
      data: newTransaction,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusTransaction = async (req, res, next) => {
  const { transactionId } = req.params;
  const { statusTransaction } = req.body;

  try {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (statusTransaction === "approve" && transaction.status !== "approve") {
      for (const item of transaction.products) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          return res.status(404).json({
            message: `Product not found for ID: ${item.product_id}`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Not enough stock available for product: ${product.product_name}`,
          });
        }

        product.stock -= item.quantity;
        await product.save();
      }
    }

    transaction.status = statusTransaction;
    await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    let transactions;
    if (req.user.role === "owner") {
      transactions = await Transaction.find();
    } else {
      transactions = await Transaction.find({
        cashier: req.user.name,
      });
    }
    res.status(200).json({ data: transactions });
  } catch (error) {
    next(error);
  }
};

export default {
  createTransaction,
  updateStatusTransaction,
  getAllTransactions,
};
