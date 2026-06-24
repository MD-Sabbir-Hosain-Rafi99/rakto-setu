import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [donors, setDonors] = useState([]);

    const fetchData = async () => {
        const statsRes = await api.get("/admin/stats");
        const donorsRes = await api.get("/admin/pending-donors");

        setStats(statsRes.data);
        setDonors(donorsRes.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerify = async (id) => {
        try {
            const res = await api.patch(`/admin/verify-donor/${id}`);
            alert(res.data.message);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to verify donor");
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-5">
            <h1 className="text-4xl font-bold text-red-600 mb-8">
                Admin Dashboard
            </h1>

            {stats && (
                <div className="grid md:grid-cols-5 gap-4 mb-10">
                    <div className="bg-white p-5 rounded-xl shadow">Users: {stats.totalUsers}</div>
                    <div className="bg-white p-5 rounded-xl shadow">Donors: {stats.totalDonors}</div>
                    <div className="bg-white p-5 rounded-xl shadow">Verified: {stats.verifiedDonors}</div>
                    <div className="bg-white p-5 rounded-xl shadow">Pending: {stats.pendingDonors}</div>
                    <div className="bg-white p-5 rounded-xl shadow">Requests: {stats.totalRequests}</div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-5">Pending Donor Verification</h2>

            <div className="grid md:grid-cols-2 gap-5">
                {donors.map((donor) => (
                    <div key={donor._id} className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-xl font-bold">{donor.user?.name}</h3>
                        <p>Phone: {donor.user?.phone}</p>
                        <p>Email: {donor.user?.email}</p>
                        <p>Blood Group: {donor.bloodGroup}</p>
                        <p>District: {donor.district}</p>
                        <p>Area: {donor.area}</p>
                        <p>Status: {donor.availability}</p>

                        <button
                            onClick={() => handleVerify(donor._id)}
                            className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg"
                        >
                            Verify Donor
                        </button>
                    </div>
                ))}
            </div>

            {donors.length === 0 && (
                <p className="text-gray-600">No pending donors found.</p>
            )}
        </div>
    );
};

export default AdminDashboard;