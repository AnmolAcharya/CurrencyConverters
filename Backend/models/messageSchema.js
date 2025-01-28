import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  fromCurrency: {
    type: String,
    required: true,
  },
  toCurrency: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  convertedAmount: {
    type: Number,
    required: true,
  },
  conversionRate: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ConversionHistory", messageSchema);