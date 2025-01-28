import express from "express";
import { sendMessage, getConversionHistory } from "../controller/messageController.js";

const router = express.Router();

router.post("/conversion", sendMessage);
router.get("/history", getConversionHistory);

export default router;