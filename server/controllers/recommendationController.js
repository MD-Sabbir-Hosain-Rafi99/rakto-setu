import BloodRequest from "../models/BloodRequest.js";
import DonorProfile from "../models/DonorProfile.js";

const isEligibleByDonationDate = (lastDonationDate) => {
    if (!lastDonationDate) return true;

    const lastDate = new Date(lastDonationDate);
    const today = new Date();

    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 90;
};

const calculateScore = (donor, request) => {
    let score = 0;
    const reasons = [];

    if (donor.bloodGroup === request.bloodGroup) {
        score += 50;
        reasons.push("Blood group matched");
    }

    if (donor.district?.toLowerCase() === request.district?.toLowerCase()) {
        score += 15;
        reasons.push("Same district");
    }

    if (donor.area?.toLowerCase() === request.area?.toLowerCase()) {
        score += 25;
        reasons.push("Same area");
    }

    if (donor.isVerified || donor.verificationStatus === "verified") {
        score += 10;
        reasons.push("Verified donor");
    }

    if (donor.availability === "available") {
        score += 10;
        reasons.push("Currently available");
    }

    if (isEligibleByDonationDate(donor.lastDonationDate)) {
        score += 10;
        reasons.push("Eligible by last donation date");
    }

    if (donor.showContact) {
        score += 5;
        reasons.push("Contact visible");
    }

    return { score, reasons };
};

export const getRecommendedDonors = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.requestId);

        if (!request) {
            return res.status(404).json({
                message: "Blood request not found",
            });
        }

        const donors = await DonorProfile.find({
            bloodGroup: request.bloodGroup,
            verificationStatus: "verified",
            isVerified: true,
            availability: { $in: ["available", "busy"] },
        })
            .populate("user", "name email phone role accountStatus")
            .sort({ createdAt: -1 });

        const recommendations = donors
            .filter((donor) => donor.user?.accountStatus !== "suspended")
            .map((donor) => {
                const { score, reasons } = calculateScore(donor, request);

                return {
                    donorId: donor._id,
                    user: donor.user,
                    bloodGroup: donor.bloodGroup,
                    district: donor.district,
                    area: donor.area,
                    availability: donor.availability,
                    lastDonationDate: donor.lastDonationDate,
                    showContact: donor.showContact,
                    latitude: donor.latitude,
                    longitude: donor.longitude,
                    score,
                    reasons,
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        res.json({
            request: {
                id: request._id,
                patientName: request.patientName,
                bloodGroup: request.bloodGroup,
                district: request.district,
                area: request.area,
                urgencyLevel: request.urgencyLevel,
                status: request.status,
            },
            totalRecommended: recommendations.length,
            recommendations,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};