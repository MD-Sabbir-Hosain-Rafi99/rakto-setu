import DonorProfile from "../models/DonorProfile.js";

export const createOrUpdateDonorProfile = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const {
      bloodGroup,
      district,
      area,
      lastDonationDate,
      availability,
      showContact,
      latitude,
      longitude,
    } = req.body;

    const donor = await DonorProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        bloodGroup,
        district,
        area,
        lastDonationDate,
        availability,
        showContact,
        latitude,
        longitude,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      message: "Donor profile saved successfully",
      donor,
    });
  } catch (error) {
    console.log("DONOR PROFILE ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyDonorProfile = async (req, res) => {
  try {
    const donor = await DonorProfile.findOne({ user: req.user._id }).populate(
      "user",
      "name email phone role"
    );

    res.json(donor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Search API Function
export const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, district, area } = req.query;

    let query = {};

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    if (district) {
      query.district = district;
    }

    if (area) {
      query.area = {
        $regex: area,
        $options: "i",
      };
    }

    const donors = await DonorProfile.find(query)
      .populate("user", "name phone email");

    res.json(donors);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};