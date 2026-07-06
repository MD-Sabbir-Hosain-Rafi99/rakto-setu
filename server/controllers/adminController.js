import User from "../models/User.js";
import DonorProfile from "../models/DonorProfile.js";
import BloodRequest from "../models/BloodRequest.js";
import ActivityLog from "../models/ActivityLog.js";

const createLog = async (adminId, action, targetType, targetId, details = "") => {
  await ActivityLog.create({
    admin: adminId,
    action,
    targetType,
    targetId,
    details,
  });
};

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      verifiedDonors,
      pendingDonors,
      rejectedDonors,
      suspendedDonors,
      availableDonors,
      busyDonors,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      completedRequests,
      expiredRequests,
    ] = await Promise.all([
      User.countDocuments(),
      DonorProfile.countDocuments(),
      DonorProfile.countDocuments({ verificationStatus: "verified" }),
      DonorProfile.countDocuments({ verificationStatus: "pending" }),
      DonorProfile.countDocuments({ verificationStatus: "rejected" }),
      DonorProfile.countDocuments({ verificationStatus: "suspended" }),
      DonorProfile.countDocuments({ availability: "available" }),
      DonorProfile.countDocuments({ availability: "busy" }),
      BloodRequest.countDocuments(),
      BloodRequest.countDocuments({ status: "pending" }),
      BloodRequest.countDocuments({ status: "accepted" }),
      BloodRequest.countDocuments({ status: "completed" }),
      BloodRequest.countDocuments({ status: "expired" }),
    ]);

    res.json({
      totalUsers,
      totalDonors,
      verifiedDonors,
      pendingDonors,
      rejectedDonors,
      suspendedDonors,
      availableDonors,
      busyDonors,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      completedRequests,
      expiredRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDonors = async (req, res) => {
  try {
    const { status, bloodGroup, district, search } = req.query;

    const query = {};

    if (status) query.verificationStatus = status;
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (district) query.district = district;

    let donors = await DonorProfile.find(query)
      .populate("user", "name email phone role accountStatus")
      .sort({ createdAt: -1 });

    if (search) {
      const keyword = search.toLowerCase();

      donors = donors.filter((donor) => {
        return (
          donor.user?.name?.toLowerCase().includes(keyword) ||
          donor.user?.email?.toLowerCase().includes(keyword) ||
          donor.user?.phone?.includes(keyword) ||
          donor.bloodGroup?.toLowerCase().includes(keyword) ||
          donor.district?.toLowerCase().includes(keyword) ||
          donor.area?.toLowerCase().includes(keyword)
        );
      });
    }

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingDonors = async (req, res) => {
  try {
    const donors = await DonorProfile.find({ verificationStatus: "pending" })
      .populate("user", "name email phone role accountStatus")
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
      {
        isVerified: true,
        verificationStatus: "verified",
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        rejectionReason: "",
      },
      { new: true }
    ).populate("user", "name email phone role accountStatus");

    if (!donor) {
      return res.status(404).json({ message: "Donor profile not found" });
    }

    await createLog(
      req.user._id,
      "Verified donor profile",
      "donor",
      donor._id,
      `${donor.user?.name || "Donor"} verified by admin`
    );

    res.json({
      message: "Donor verified successfully",
      donor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectDonor = async (req, res) => {
  try {
    const { reason } = req.body;

    const donor = await DonorProfile.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: false,
        verificationStatus: "rejected",
        rejectionReason: reason || "Donor information is incomplete or invalid",
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
      },
      { new: true }
    ).populate("user", "name email phone role accountStatus");

    if (!donor) {
      return res.status(404).json({ message: "Donor profile not found" });
    }

    await createLog(
      req.user._id,
      "Rejected donor profile",
      "donor",
      donor._id,
      reason || "No reason provided"
    );

    res.json({
      message: "Donor rejected successfully",
      donor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const suspendDonor = async (req, res) => {
  try {
    const donor = await DonorProfile.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: false,
        verificationStatus: "suspended",
        availability: "offline",
      },
      { new: true }
    ).populate("user", "name email phone role accountStatus");

    if (!donor) {
      return res.status(404).json({ message: "Donor profile not found" });
    }

    await createLog(
      req.user._id,
      "Suspended donor profile",
      "donor",
      donor._id,
      `${donor.user?.name || "Donor"} suspended by admin`
    );

    res.json({
      message: "Donor suspended successfully",
      donor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDonor = async (req, res) => {
  try {
    const donor = await DonorProfile.findById(req.params.id).populate(
      "user",
      "name email phone role"
    );

    if (!donor) {
      return res.status(404).json({ message: "Donor profile not found" });
    }

    await DonorProfile.findByIdAndDelete(req.params.id);

    await createLog(
      req.user._id,
      "Deleted donor profile",
      "donor",
      donor._id,
      `${donor.user?.name || "Donor"} donor profile deleted`
    );

    res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const { status, bloodGroup, district, search } = req.query;

    const query = {};

    if (status) query.status = status;
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (district) query.district = district;

    let requests = await BloodRequest.find(query)
      .populate("requester", "name email phone role accountStatus")
      .sort({ createdAt: -1 });

    if (search) {
      const keyword = search.toLowerCase();

      requests = requests.filter((request) => {
        return (
          request.patientName?.toLowerCase().includes(keyword) ||
          request.hospitalName?.toLowerCase().includes(keyword) ||
          request.contactNumber?.includes(keyword) ||
          request.bloodGroup?.toLowerCase().includes(keyword) ||
          request.district?.toLowerCase().includes(keyword) ||
          request.area?.toLowerCase().includes(keyword)
        );
      });
    }

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "accepted", "completed", "expired"].includes(status)) {
      return res.status(400).json({ message: "Invalid request status" });
    }

    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("requester", "name email phone role accountStatus");

    if (!request) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    await createLog(
      req.user._id,
      "Updated blood request status",
      "request",
      request._id,
      `Request status changed to ${status}`
    );

    res.json({
      message: "Blood request status updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    await BloodRequest.findByIdAndDelete(req.params.id);

    await createLog(
      req.user._id,
      "Deleted blood request",
      "request",
      request._id,
      `Blood request for ${request.patientName} deleted`
    );

    res.json({ message: "Blood request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;

    const query = {};

    if (role) query.role = role;
    if (status) query.accountStatus = status;

    let users = await User.find(query).select("-password").sort({ createdAt: -1 });

    if (search) {
      const keyword = search.toLowerCase();

      users = users.filter((user) => {
        return (
          user.name?.toLowerCase().includes(keyword) ||
          user.email?.toLowerCase().includes(keyword) ||
          user.phone?.includes(keyword)
        );
      });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { accountStatus } = req.body;

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot change your own account status",
      });
    }

    if (!["active", "suspended"].includes(accountStatus)) {
      return res.status(400).json({ message: "Invalid account status" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountStatus },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await createLog(
      req.user._id,
      "Updated user status",
      "user",
      user._id,
      `${user.name} status changed to ${accountStatus}`
    );

    res.json({
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "donor", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await createLog(
      req.user._id,
      "Updated user role",
      "user",
      user._id,
      `${user.name} role changed to ${role}`
    );

    res.json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    await createLog(
      req.user._id,
      "Deleted user",
      "user",
      user._id,
      `${user.name} deleted`
    );

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("admin", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};