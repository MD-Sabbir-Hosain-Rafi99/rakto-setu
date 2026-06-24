import User from "../models/User.js";
import DonorProfile from "../models/DonorProfile.js";
import BloodRequest from "../models/BloodRequest.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await DonorProfile.countDocuments();
    const verifiedDonors = await DonorProfile.countDocuments({ isVerified: true });
    const pendingDonors = await DonorProfile.countDocuments({ isVerified: false });
    const totalRequests = await BloodRequest.countDocuments();

    res.json({
      totalUsers,
      totalDonors,
      verifiedDonors,
      pendingDonors,
      totalRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingDonors = async (req, res) => {
  try {
    const donors = await DonorProfile.find({ isVerified: false })
      .populate("user", "name email phone role")
      .sort({ createdAt: -1 });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyDonor = async (req, res) => {
  try {
    const donor = await DonorProfile.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).populate("user", "name email phone role");

    res.json({
      message: "Donor verified successfully",
      donor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};