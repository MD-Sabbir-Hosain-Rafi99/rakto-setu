import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    Users,
    Droplet,
    CheckCircle,
    Clock,
    XCircle,
    Ban,
    Activity,
    Siren,
} from "lucide-react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";
import { getAdminStats } from "../services/adminService";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const admin = JSON.parse(localStorage.getItem("user"));

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getAdminStats();
            setStats(data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const cards = [
        { title: "Total Users", value: stats?.totalUsers || 0, icon: Users },
        { title: "Total Donors", value: stats?.totalDonors || 0, icon: Droplet },
        { title: "Verified Donors", value: stats?.verifiedDonors || 0, icon: CheckCircle },
        { title: "Pending Donors", value: stats?.pendingDonors || 0, icon: Clock },
        { title: "Rejected Donors", value: stats?.rejectedDonors || 0, icon: XCircle },
        { title: "Suspended Donors", value: stats?.suspendedDonors || 0, icon: Ban },
        { title: "Available Donors", value: stats?.availableDonors || 0, icon: Activity },
        { title: "Total Requests", value: stats?.totalRequests || 0, icon: Siren },
    ];

    const donorChartData = useMemo(
        () => [
            { name: "Verified", value: stats?.verifiedDonors || 0 },
            { name: "Pending", value: stats?.pendingDonors || 0 },
            { name: "Rejected", value: stats?.rejectedDonors || 0 },
            { name: "Suspended", value: stats?.suspendedDonors || 0 },
        ],
        [stats]
    );

    const requestChartData = useMemo(
        () => [
            { name: "Pending", value: stats?.pendingRequests || 0 },
            { name: "Accepted", value: stats?.acceptedRequests || 0 },
            { name: "Completed", value: stats?.completedRequests || 0 },
            { name: "Expired", value: stats?.expiredRequests || 0 },
        ],
        [stats]
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-red-600">Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Welcome, {admin?.name || "Admin"} — monitor RaktoSetu performance.
                    </p>
                </div>

                <button
                    onClick={fetchStats}
                    className="bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {cards.map(({ title, value, icon: Icon }) => (
                    <div key={title} className="bg-white rounded-xl shadow p-5 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 text-sm">{title}</p>
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                                <Icon size={20} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-3 text-gray-900">{value}</h2>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Donor Verification Overview</h2>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={donorChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#dc2626" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Blood Request Status</h2>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={requestChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={110}
                                    label
                                >
                                    {requestChartData.map((entry, index) => (
                                        <Cell
                                            key={entry.name}
                                            fill={["#f59e0b", "#2563eb", "#16a34a", "#6b7280"][index]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;