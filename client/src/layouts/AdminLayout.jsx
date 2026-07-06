import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    LayoutDashboard,
    Droplet,
    Siren,
    Users,
    LogOut,
    Menu,
    X,
} from "lucide-react";

const AdminLayout = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const admin = JSON.parse(localStorage.getItem("user"));

    const links = [
        {
            path: "/raktosetu-secure-admin-2026",
            label: "Dashboard",
            icon: LayoutDashboard,
            end: true,
        },
        {
            path: "/raktosetu-secure-admin-2026/donors",
            label: "Donors",
            icon: Droplet,
        },
        {
            path: "/raktosetu-secure-admin-2026/requests",
            label: "Blood Requests",
            icon: Siren,
        },
        {
            path: "/raktosetu-secure-admin-2026/users",
            label: "Users",
            icon: Users,
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:static top-0 left-0 z-50 w-72 min-h-screen bg-gray-950 text-white p-5 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-red-500">🩸 RaktoSetu</h2>
                        <p className="text-sm text-gray-400">Admin Panel</p>
                    </div>

                    <button onClick={() => setOpen(false)} className="md:hidden">
                        <X />
                    </button>
                </div>

                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-400">Logged in as</p>
                    <h3 className="font-bold truncate">{admin?.name || "Admin"}</h3>
                    <p className="text-xs text-green-400 capitalize">
                        {admin?.role || "admin"}
                    </p>
                </div>

                <nav className="space-y-2">
                    {links.map(({ path, label, icon: Icon, end }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={end}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive
                                    ? "bg-red-600 text-white shadow-lg"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-red-700 hover:bg-red-800 transition"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>

            {/* Main */}
            <main className="flex-1 min-w-0">
                {/* Topbar */}
                <div className="bg-white shadow-sm px-5 py-4 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setOpen(true)}
                        className="md:hidden bg-gray-900 text-white p-2 rounded-lg"
                    >
                        <Menu />
                    </button>

                    <h1 className="font-bold text-gray-800 hidden md:block">
                        RaktoSetu Admin Dashboard
                    </h1>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 hidden sm:block">
                            Hi, {admin?.name || "Admin"}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;