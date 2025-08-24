import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Cloths", "Electronics", "Furniture"],
    required: true,
  },
  quantity: { type: Number, required: true },
  costPrice: { type: Number, required: true },
});

export const Product = mongoose.model("Product", productSchema);
