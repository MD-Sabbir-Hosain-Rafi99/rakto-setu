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

// Search API Function Updated Again
export const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, district, area, emergency } = req.query;

    const today = new Date();

    const query = {
      verificationStatus: "verified",
      isVerified: true,
      availability: { $in: ["available", "busy"] },
    };

    if (bloodGroup) query.bloodGroup = bloodGroup;

    if (district) {
      query.district = {
        $regex: `^${district}$`,
        $options: "i",
      };
    }

    if (area) {
      query.area = {
        $regex: area,
        $options: "i",
      };
    }

    let donors = await DonorProfile.find(query)
      .populate("user", "name phone email role accountStatus")
      .sort({ createdAt: -1 });

    donors = donors
      .filter((donor) => donor.user?.accountStatus === "active")
      .filter((donor) => {
        if (!donor.eligibleAfter) return true;
        return new Date(donor.eligibleAfter) <= today;
      })
      .map((donor) => {
        let aiScore = 0;
        const matchReasons = [];

        if (donor.bloodGroup === bloodGroup) {
          aiScore += 50;
          matchReasons.push("Blood group matched");
        }

        if (
          district &&
          donor.district?.toLowerCase() === district.toLowerCase()
        ) {
          aiScore += 10;
          matchReasons.push("Same district");
        }

        if (
          area &&
          donor.area?.toLowerCase().includes(area.toLowerCase())
        ) {
          aiScore += 20;
          matchReasons.push("Same area");
        }

        if (donor.verificationStatus === "verified") {
          aiScore += 10;
          matchReasons.push("Verified donor");
        }

        if (donor.availability === "available") {
          aiScore += 10;
          matchReasons.push("Available now");
        }

        if (!donor.eligibleAfter || new Date(donor.eligibleAfter) <= today) {
          aiScore += 20;
          matchReasons.push("Eligible for donation");
        }

        if ((donor.totalDonations || 0) > 0) {
          aiScore += 5;
          matchReasons.push(`${donor.totalDonations} previous donation(s)`);
        }

        if (emergency === "true") {
          aiScore += 5;
          matchReasons.push("Emergency priority match");
        }

        return {
          ...donor.toObject(),
          aiScore: Math.min(aiScore, 100),
          matchReasons,
        };
      })
      .sort((a, b) => b.aiScore - a.aiScore);

    res.json(donors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};