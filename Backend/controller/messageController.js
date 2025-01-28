import Message from "../models/messageSchema.js";

export const sendMessage = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount, convertedAmount, conversionRate } = req.body;

    const newConversion = new Message({
      fromCurrency,
      toCurrency,
      amount,
      convertedAmount,
      conversionRate,
    });

    const savedConversion = await newConversion.save();
    res.status(201).json({
      success: true,
      data: savedConversion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add a function to get conversion history
export const getConversionHistory = async (req, res) => {
  try {
    const history = await Message.find().sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};