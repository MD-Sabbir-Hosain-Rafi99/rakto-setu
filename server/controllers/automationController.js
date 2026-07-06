import DonorProfile from "../models/DonorProfile.js";

const calculateAiScore = (donor, district, area) => {
    let score = 0;

    // Verified donor
    if (donor.verificationStatus === "verified") score += 40;

    // Available
    if (donor.availability === "available") score += 30;

    // Same district
    if (
        district &&
        donor.district?.toLowerCase() === district.toLowerCase()
    ) {
        score += 20;
    }

    // Same area
    if (
        area &&
        donor.area?.toLowerCase().includes(area.toLowerCase())
    ) {
        score += 10;
    }

    return score;
};

export const aiFindDonor = async (req, res) => {
    try {
        const {
            bloodGroup,
            district,
            area
        } = req.body;

        if (!bloodGroup) {
            return res.status(400).json({
                success: false,
                message: "Blood group is required."
            });
        }

        const query = {
            bloodGroup,
            availability: "available",
            verificationStatus: "verified",
        };

        if (district) query.district = district;

        if (area) {
            query.area = {
                $regex: area,
                $options: "i",
            };
        }

        let donors = await DonorProfile.find(query)
            .populate(
                "user",
                "name phone email"
            );

        donors = donors
            .map((donor) => ({
                ...donor.toObject(),
                aiScore: calculateAiScore(
                    donor,
                    district,
                    area
                ),
            }))
            .sort(
                (a, b) => b.aiScore - a.aiScore
            );

        res.json({
            success: true,
            total: donors.length,
            donors,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};