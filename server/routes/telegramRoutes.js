import express from "express";
import {
    generateTelegramConnectCode,
    connectTelegramByCode,
} from "../controllers/telegramController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User generates a unique Telegram connection code
router.get("/connect-code", protect, generateTelegramConnectCode);

// Telegram Bot / n8n will call this after user sends /start CODE
router.post("/connect", connectTelegramByCode);

export default router;