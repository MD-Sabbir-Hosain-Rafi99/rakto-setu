import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config({ path: "./.env" });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const adminEmail = "admin@raktosetu.com";
        const adminPassword = "Admin@123";

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            existingAdmin.role = "admin";
            existingAdmin.accountStatus = "active";
            await existingAdmin.save();

            console.log("Existing user updated to admin");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            name: "RaktoSetu Admin",
            email: adminEmail,
            phone: "01700000000",
            password: hashedPassword,
            role: "admin",
            accountStatus: "active",
        });

        console.log("Admin created successfully");
        console.log("Email:", adminEmail);
        console.log("Password:", adminPassword);

        process.exit();
    } catch (error) {
        console.log("Admin create error:", error.message);
        process.exit(1);
    }
};

createAdmin();