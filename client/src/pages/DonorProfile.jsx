import { useEffect, useState } from "react";
import api from "../api/axios";

const DonorProfile = () => {
    const [formData, setFormData] = useState({
        bloodGroup: "",
        district: "",
        area: "",
        lastDonationDate: "",
        availability: "available",
        showContact: true,
        latitude: "",
        longitude: "",
    });

    const [loading, setLoading] = useState(false);

    const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/donors/me");

                if (res.data) {
                    setFormData({
                        bloodGroup: res.data.bloodGroup || "",
                        district: res.data.district || "",
                        area: res.data.area || "",
                        lastDonationDate: res.data.lastDonationDate
                            ? res.data.lastDonationDate.slice(0, 10)
                            : "",
                        availability: res.data.availability || "available",
                        showContact: res.data.showContact ?? true,
                        latitude: res.data.latitude || "",
                        longitude: res.data.longitude || "",
                    });
                }
            } catch (error) {
                console.log(error.response?.data || error.message);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));

                alert("Location added successfully!");
            },
            () => {
                alert("Location permission denied");
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/donors/profile", formData);
            alert(res.data.message);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save donor profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                    Donor Profile
                </h1>

                <p className="text-gray-600 mb-8">
                    Complete your donor information to help people find you during emergency.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map((group) => (
                            <option key={group} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Example: Dhaka"
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="Example: Mirpur"
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="date"
                        name="lastDonationDate"
                        value={formData.lastDonationDate}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />

                    <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="recently_donated">Recently Donated</option>
                        <option value="offline">Offline</option>
                    </select>

                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold"
                    >
                        📍 Use My Current Location
                    </button>

                    {formData.latitude && formData.longitude && (
                        <p className="text-sm text-green-700">
                            Location saved: {formData.latitude}, {formData.longitude}
                        </p>
                    )}

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="showContact"
                            checked={formData.showContact}
                            onChange={handleChange}
                            className="w-5 h-5"
                        />
                        <span>Allow seekers to contact me via WhatsApp</span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        {loading ? "Saving..." : "Save Donor Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DonorProfile;