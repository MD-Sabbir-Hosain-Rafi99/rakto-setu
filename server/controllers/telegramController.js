import User from "../models/User.js";

const generateTelegramCode = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `RST-${random}`;
};

export const generateTelegramConnectCode = async (req, res) => {
    try {
        const code = generateTelegramCode();

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { telegramConnectCode: code },
            { new: true }
        ).select("-password");

        res.json({
            message: "Telegram connect code generated successfully",
            code,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const connectTelegramByCode = async (req, res) => {
    try {
        const { code, chatId } = req.body;

        if (!code || !chatId) {
            return res.status(400).json({
                message: "Code and chatId are required",
            });
        }

        const user = await User.findOneAndUpdate(
            { telegramConnectCode: code },
            {
                telegramChatId: chatId,
                telegramConnectCode: "",
            },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Invalid or expired Telegram connect code",
            });
        }

        res.json({
            message: "Telegram connected successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};