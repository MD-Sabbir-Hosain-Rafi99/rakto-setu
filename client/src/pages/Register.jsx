import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        bloodGroup: "",
        district: "",
        area: "",
        password: "",
        confirmPassword: "",
        latitude: null,
        longitude: null,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));

                toast.success("Location detected successfully");
            },
            () => {
                toast.error("Location permission denied");
            }
        );
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Password and confirm password do not match");
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            toast.error("Please detect your current location before registration");
            return;
        }

        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || null,
                bloodGroup: formData.bloodGroup,
                district: formData.district,
                area: formData.area,
                password: formData.password,
                latitude: formData.latitude,
                longitude: formData.longitude,
            };

            const res = await api.post("/auth/register", payload);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Registration successful! Pending admin verification.");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-red-600">🩸 RaktoSetu</h1>
                    <p className="text-gray-600 mt-2">
                        Create your donor account and help save lives.
                    </p>
                </div>

                <form
                    onSubmit={handleRegister}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <input
                        name="name"
                        onChange={handleChange}
                        type="text"
                        placeholder="Full Name *"
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        name="phone"
                        onChange={handleChange}
                        type="text"
                        placeholder="Phone Number *"
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        name="email"
                        onChange={handleChange}
                        type="email"
                        placeholder="Email (Optional)"
                        className="border p-3 rounded-lg md:col-span-2"
                    />

                    <select
                        name="bloodGroup"
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    >
                        <option value="">Select Blood Group *</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>

                    <select
                        name="district"
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    >
                        <option value="">Present District *</option>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chattogram">Chattogram</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Khulna">Khulna</option>
                        <option value="Barishal">Barishal</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Rangpur">Rangpur</option>
                        <option value="Mymensingh">Mymensingh</option>
                    </select>

                    <input
                        name="area"
                        onChange={handleChange}
                        type="text"
                        placeholder="Present Area / Upazila *"
                        className="border p-3 rounded-lg md:col-span-2"
                        required
                    />

                    <button
                        type="button"
                        onClick={handleDetectLocation}
                        className="md:col-span-2 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                    >
                        📍 Detect My Current Location
                    </button>

                    {formData.latitude && formData.longitude && (
                        <p className="md:col-span-2 text-green-700 text-sm font-semibold">
                            Location detected and will be saved with your donor profile.
                        </p>
                    )}

                    <input
                        name="password"
                        onChange={handleChange}
                        type="password"
                        placeholder="Password *"
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        name="confirmPassword"
                        onChange={handleChange}
                        type="password"
                        placeholder="Confirm Password *"
                        className="border p-3 rounded-lg"
                        required
                    />

                    <button className="md:col-span-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                        Create Donor Account
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-red-600 font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;