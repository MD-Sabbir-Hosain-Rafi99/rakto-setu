import bcrypt from "bcryptjs";
import User from "../models/User.js";
import DonorProfile from "../models/DonorProfile.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      bloodGroup,
      district,
      area,
      lastDonationDate,
      showContact = true,
      latitude,
      longitude,
    } = req.body;

    if (!name || !phone || !password || !bloodGroup || !district || !area) {
      return res.status(400).json({
        message:
          "Name, phone, password, blood group, district, and area are required",
      });
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

    if (email && email.trim() !== "") {
      const existingEmail = await User.findOne({
        email: email.toLowerCase().trim(),
      });

      if (existingEmail) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      phone,
      password: hashedPassword,
      role: "donor",
    };

    if (email && email.trim() !== "") {
      userData.email = email.toLowerCase().trim();
    }

    const user = await User.create(userData);

    const donorProfile = await DonorProfile.create({
      user: user._id,
      bloodGroup,
      district,
      area,
      lastDonationDate: lastDonationDate || null,
      availability: "available",
      isVerified: false,
      verificationStatus: "pending",
      showContact,
      latitude: latitude || null,
      longitude: longitude || null,
    });

    res.status(201).json({
      message: "Registration successful. Your donor profile is pending admin verification.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      donorProfile,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.log("Register error:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { identifier, email, phone, password } = req.body;

    const loginId = identifier || email || phone;

    if (!loginId || !password) {
      return res.status(400).json({
        message: "Phone/email and password are required",
      });
    }

    const user = await User.findOne({
      $or: [{ email: loginId.toLowerCase() }, { phone: loginId }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid phone/email or password",
      });
    }

    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        message: "Your account is suspended",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid phone/email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.log("Login error:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};