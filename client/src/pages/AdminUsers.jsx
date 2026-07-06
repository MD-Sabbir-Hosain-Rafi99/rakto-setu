import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    Eye,
    Search,
    X,
    RefreshCcw,
    UserCheck,
    UserX,
    Trash2,
    ShieldCheck,
    Download,
} from "lucide-react";
import {
    getAllUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser,
} from "../services/adminService";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const usersPerPage = 5;

    const [filters, setFilters] = useState({
        role: "",
        status: "",
        search: "",
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers(filters);
            setUsers(data);
            setCurrentPage(1);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const summary = {
        total: users.length,
        admins: users.filter((u) => u.role === "admin").length,
        donors: users.filter((u) => u.role === "donor").length,
        normalUsers: users.filter((u) => u.role === "user").length,
        active: users.filter((u) => u.accountStatus === "active").length,
        suspended: users.filter((u) => u.accountStatus === "suspended").length,
    };

    const totalPages = Math.ceil(users.length / usersPerPage) || 1;

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * usersPerPage;
        return users.slice(startIndex, startIndex + usersPerPage);
    }, [users, currentPage]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const runAction = async () => {
        if (!confirmAction) return;

        try {
            if (confirmAction.action === "status") {
                await updateUserStatus(confirmAction.id, confirmAction.status);
                toast.success(`User ${confirmAction.status} successfully`);
            }

            if (confirmAction.action === "role") {
                await updateUserRole(confirmAction.id, confirmAction.role);
                toast.success(`User role updated to ${confirmAction.role}`);
            }

            if (confirmAction.action === "delete") {
                await deleteUser(confirmAction.id);
                toast.success("User deleted successfully");
            }

            setConfirmAction(null);
            await fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
            setConfirmAction(null);
        }
    };

    const roleBadge = (role) => {
        const styles = {
            admin: "bg-purple-100 text-purple-700 border-purple-200",
            donor: "bg-red-100 text-red-700 border-red-200",
            user: "bg-blue-100 text-blue-700 border-blue-200",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[role] || "bg-gray-100 text-gray-700"}`}>
                {role || "user"}
            </span>
        );
    };

    const statusBadge = (status) => {
        const styles = {
            active: "bg-green-100 text-green-700 border-green-200",
            suspended: "bg-gray-200 text-gray-700 border-gray-300",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[status] || "bg-gray-100 text-gray-700"}`}>
                {status || "active"}
            </span>
        );
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const exportCSV = () => {
        const rows = [
            ["Name", "Email", "Phone", "Role", "Status", "Joined"],
            ...users.map((u) => [
                u.name || "",
                u.email || "",
                u.phone || "",
                u.role || "",
                u.accountStatus || "",
                formatDate(u.createdAt),
            ]),
        ];

        const csv = rows.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "raktosetu-users.csv";
        a.click();
        URL.revokeObjectURL(url);

        toast.success("Users CSV exported successfully");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-red-600">User Management</h1>
                    <p className="text-gray-600 mt-1">
                        Monitor users, roles, and account access status.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchUsers}
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
                    >
                        <RefreshCcw size={16} /> Refresh
                    </button>

                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                {[
                    ["Total", summary.total],
                    ["Admins", summary.admins],
                    ["Donors", summary.donors],
                    ["Users", summary.normalUsers],
                    ["Active", summary.active],
                    ["Suspended", summary.suspended],
                ].map(([title, value]) => (
                    <div key={title} className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">{title}</p>
                        <h2 className="text-2xl font-bold">{value}</h2>
                    </div>
                ))}
            </div>

            <form
                onSubmit={handleSearch}
                className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
            >
                <div className="relative">
                    <Search size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search name, email or phone..."
                        className="border p-3 pl-10 rounded-lg w-full"
                    />
                </div>

                <select name="role" value={filters.role} onChange={handleFilterChange} className="border p-3 rounded-lg">
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="donor">Donor</option>
                    <option value="user">User</option>
                </select>

                <select name="status" value={filters.status} onChange={handleFilterChange} className="border p-3 rounded-lg">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                </select>

                <button className="bg-red-600 text-white rounded-lg font-semibold">
                    Search
                </button>
            </form>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                {loading ? (
                    <div className="p-6 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">No user found.</p>
                ) : (
                    <>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-4 text-left">User</th>
                                    <th className="p-4 text-left">Phone</th>
                                    <th className="p-4 text-left">Role</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Joined</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedUsers.map((user) => (
                                    <tr key={user._id} className="border-b hover:bg-red-50 transition">
                                        <td className="p-4">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="font-bold text-left hover:text-red-600"
                                            >
                                                {user.name}
                                            </button>
                                            <p className="text-gray-500">{user.email || "No email"}</p>
                                        </td>

                                        <td className="p-4">{user.phone}</td>
                                        <td className="p-4">{roleBadge(user.role)}</td>
                                        <td className="p-4">{statusBadge(user.accountStatus)}</td>
                                        <td className="p-4">{formatDate(user.createdAt)}</td>

                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                >
                                                    <Eye size={14} /> View
                                                </button>

                                                {user._id !== currentUser?.id && (
                                                    <>
                                                        {user.accountStatus === "active" ? (
                                                            <button
                                                                onClick={() =>
                                                                    setConfirmAction({
                                                                        action: "status",
                                                                        id: user._id,
                                                                        status: "suspended",
                                                                    })
                                                                }
                                                                className="bg-gray-700 text-white px-3 py-1 rounded flex items-center gap-1"
                                                            >
                                                                <UserX size={14} /> Suspend
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    setConfirmAction({
                                                                        action: "status",
                                                                        id: user._id,
                                                                        status: "active",
                                                                    })
                                                                }
                                                                className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                            >
                                                                <UserCheck size={14} /> Activate
                                                            </button>
                                                        )}

                                                        <select
                                                            value={user.role}
                                                            onChange={(e) =>
                                                                setConfirmAction({
                                                                    action: "role",
                                                                    id: user._id,
                                                                    role: e.target.value,
                                                                })
                                                            }
                                                            className="border px-2 py-1 rounded"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="donor">Donor</option>
                                                            <option value="admin">Admin</option>
                                                        </select>

                                                        <button
                                                            onClick={() =>
                                                                setConfirmAction({
                                                                    action: "delete",
                                                                    id: user._id,
                                                                })
                                                            }
                                                            className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                        >
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex items-center justify-between p-4">
                            <p className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * usersPerPage + 1} -{" "}
                                {Math.min(currentPage * usersPerPage, users.length)} of{" "}
                                {users.length} users
                            </p>

                            <div className="flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                    className="px-4 py-2 border rounded disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                <span className="px-4 py-2 bg-gray-900 text-white rounded">
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                    className="px-4 py-2 border rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {selectedUser && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
                        >
                            <X />
                        </button>

                        <h2 className="text-2xl font-bold text-red-600 mb-5">
                            👤 User Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>Name:</strong> {selectedUser.name}</p>
                            <p><strong>Email:</strong> {selectedUser.email || "No email"}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone}</p>
                            <p><strong>Role:</strong> {roleBadge(selectedUser.role)}</p>
                            <p><strong>Status:</strong> {statusBadge(selectedUser.accountStatus)}</p>
                            <p><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="bg-gray-900 text-white px-5 py-2 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmAction && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-2">Confirm Action</h2>

                        <p className="text-gray-600 mb-5">
                            {confirmAction.action === "status" &&
                                <>Are you sure you want to mark this user as <strong>{confirmAction.status}</strong>?</>}

                            {confirmAction.action === "role" &&
                                <>Are you sure you want to change this user role to <strong>{confirmAction.role}</strong>?</>}

                            {confirmAction.action === "delete" &&
                                <>Are you sure you want to permanently delete this user?</>}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={runAction}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;