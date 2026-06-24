import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

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

            alert("Login successful!");
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="max-w-md mx-auto my-20 bg-white p-8 rounded-xl shadow">
            <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

            <form onSubmit={handleLogin} className="space-y-4">
                <input name="email" onChange={handleChange} type="email" placeholder="Email" className="w-full border p-3 rounded-lg" required />

                <input name="password" onChange={handleChange} type="password" placeholder="Password" className="w-full border p-3 rounded-lg" required />

                <button className="w-full bg-red-600 text-white py-3 rounded-lg">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;