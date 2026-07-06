import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Login successful!");

            if (res.data.user.role === "admin") {
                navigate("/raktosetu-secure-admin-2026");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-red-600">
                        🩸 RaktoSetu
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Welcome back! Login to continue.
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >
                    <input
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        type="text"
                        placeholder="Phone Number or Email"
                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />

                    <div className="relative">
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full border rounded-lg p-3 pr-16 outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3 text-sm text-red-600"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button
                        className="w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-lg font-semibold"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-red-600 font-semibold ml-2"
                    >
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;