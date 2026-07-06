import BloodRequest from "../models/BloodRequest.js";
import DonorProfile from "../models/DonorProfile.js";
import DonationHistory from "../models/DonationHistory.js";

export const getDonationHistory = async (req, res) => {
  try {
    const histories = await DonationHistory.find({
      requester: req.user._id,
    })
      .populate({
        path: "donor",
        populate: {
          path: "user",
          select: "name phone email",
        },
      })
      .populate("bloodRequest")
      .sort({ createdAt: -1 });

    res.json(histories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




export const createBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.create({
      requester: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      message: "Emergency blood request created successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate("requester", "name phone email")
      .populate({
        path: "acceptedDonor",
        populate: {
          path: "user",
          select: "name phone email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      requester: req.user._id,
    })
      .populate({
        path: "acceptedDonor",
        populate: {
          path: "user",
          select: "name phone email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const acceptBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Only pending requests can be accepted",
      });
    }

    const donor = await DonorProfile.findOne({
      user: req.user._id,
      verificationStatus: "verified",
      isVerified: true,
    });

    if (!donor) {
      return res.status(403).json({
        message: "Only verified donors can accept blood requests",
      });
    }

    request.status = "accepted";
    request.acceptedDonor = donor._id;
    request.acceptedAt = new Date();

    await request.save();

    donor.availability = "busy";
    await donor.save();

    res.json({
      message: "Blood request accepted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const completeBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({
        message: "Only accepted requests can be completed",
      });
    }

    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only requester can confirm donation completion",
      });
    }

    const donor = await DonorProfile.findById(request.acceptedDonor);

    if (!donor) {
      return res.status(404).json({
        message: "Accepted donor not found",
      });
    }

    const today = new Date();
    const eligibleAfter = new Date(today);
    eligibleAfter.setDate(eligibleAfter.getDate() + 90);

    await DonationHistory.create({
      donor: donor._id,
      bloodRequest: request._id,
      requester: request.requester,
      bloodGroup: request.bloodGroup,
      district: request.district,
      area: request.area,
      hospitalName: request.hospitalName,
      donationDate: today,
      unitsDonated: request.unitsNeeded || 1,
      status: "completed",
    });

    donor.lastDonationDate = today;
    donor.eligibleAfter = eligibleAfter;
    donor.totalDonations = (donor.totalDonations || 0) + 1;
    donor.livesSaved = (donor.livesSaved || 0) + 1;
    donor.availability = "recently_donated";

    await donor.save();

    request.status = "completed";
    request.completedAt = today;
    request.donationConfirmedBy = req.user._id;

    await request.save();

    res.json({
      message: "Donation completed successfully",
      request,
      donor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};