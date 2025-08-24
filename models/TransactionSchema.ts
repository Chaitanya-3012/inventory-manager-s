import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  transactionType: { type: String, enum: ["IN", "OUT"], required: true },
  date: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
