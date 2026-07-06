import express from "express";
import { aiFindDonor } from "../controllers/automationController.js";

const router = express.Router();

/*
    POST
    /api/automation/n8n/find-donor

    Future Use:
    Website AI Assistant
    Telegram Bot
    WhatsApp Bot
    n8n Workflow
*/

router.post("/n8n/find-donor", aiFindDonor);

export default router;