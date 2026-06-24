import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/register", formData);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            alert("Registration successful!");
            navigate("/");
        } catch (error) {
            console.log(error.response?.data || error.message);

            alert(
                error.response?.data?.message || "Registration failed"
            );
        }
    };

    return (
        <div className="max-w-md mx-auto my-20 bg-white p-8 rounded-xl shadow">
            <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

            <form onSubmit={handleRegister} className="space-y-4">
                <input name="name" onChange={handleChange} type="text" placeholder="Full Name" className="w-full border p-3 rounded-lg" required />

                <input name="email" onChange={handleChange} type="email" placeholder="Email" className="w-full border p-3 rounded-lg" required />

                <input name="phone" onChange={handleChange} type="text" placeholder="Phone Number" className="w-full border p-3 rounded-lg" required />

                <input name="password" onChange={handleChange} type="password" placeholder="Password" className="w-full border p-3 rounded-lg" required />

                <select name="role" onChange={handleChange} className="w-full border p-3 rounded-lg">
                    <option value="user">Normal User</option>
                    <option value="donor">Blood Donor</option>
                </select>

                <button className="w-full bg-red-600 text-white py-3 rounded-lg">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;