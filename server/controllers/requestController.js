import BloodRequest from "../models/BloodRequest.js";

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
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};