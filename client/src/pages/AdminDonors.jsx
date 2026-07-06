import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle,
    Ban,
    PauseCircle,
    Trash2,
    Eye,
    RefreshCcw,
    Download,
    Search,
    X,
} from "lucide-react";
import {
    getAllDonors,
    verifyDonor,
    rejectDonor,
    suspendDonor,
    deleteDonor,
} from "../services/adminService";

const AdminDonors = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const donorsPerPage = 5;

    const [filters, setFilters] = useState({
        status: "",
        bloodGroup: "",
        district: "",
        search: "",
    });

    const fetchDonors = async () => {
        try {
            setLoading(true);
            const data = await getAllDonors(filters);
            setDonors(data);
            setCurrentPage(1);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to load donors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    const summary = {
        total: donors.length,
        verified: donors.filter((d) => d.verificationStatus === "verified").length,
        pending: donors.filter((d) => d.verificationStatus === "pending").length,
        rejected: donors.filter((d) => d.verificationStatus === "rejected").length,
        suspended: donors.filter((d) => d.verificationStatus === "suspended").length,
    };

    const totalPages = Math.ceil(donors.length / donorsPerPage) || 1;

    const paginatedDonors = useMemo(() => {
        const startIndex = (currentPage - 1) * donorsPerPage;
        return donors.slice(startIndex, startIndex + donorsPerPage);
    }, [donors, currentPage]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDonors();
    };

    const runAction = async () => {
        if (!confirmAction) return;

        try {
            if (confirmAction.type === "verify") {
                await verifyDonor(confirmAction.id);
                alert("Donor verified successfully");
            }

            if (confirmAction.type === "reject") {
                const reason = prompt("Enter rejection reason:");
                if (!reason) return;
                await rejectDonor(confirmAction.id, reason);
                alert("Donor rejected successfully");
            }

            if (confirmAction.type === "suspend") {
                await suspendDonor(confirmAction.id);
                alert("Donor suspended successfully");
            }

            if (confirmAction.type === "delete") {
                await deleteDonor(confirmAction.id);
                alert("Donor deleted successfully");
            }

            setConfirmAction(null);
            fetchDonors();
        } catch (error) {
            alert(error.response?.data?.message || "Action failed");
        }
    };

    const verificationBadge = (status) => {
        const styles = {
            verified: "bg-green-100 text-green-700 border-green-200",
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
            suspended: "bg-gray-200 text-gray-700 border-gray-300",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[status] || "bg-gray-100 text-gray-700"}`}>
                {status || "pending"}
            </span>
        );
    };

    const availabilityBadge = (status) => {
        const styles = {
            available: "bg-green-100 text-green-700 border-green-200",
            busy: "bg-orange-100 text-orange-700 border-orange-200",
            recently_donated: "bg-purple-100 text-purple-700 border-purple-200",
            offline: "bg-gray-200 text-gray-700 border-gray-300",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[status] || "bg-gray-100 text-gray-700"}`}>
                {status?.replace("_", " ") || "N/A"}
            </span>
        );
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-GB");
    };

    const exportCSV = () => {
        const rows = [
            ["Name", "Email", "Phone", "Blood Group", "District", "Area", "Availability", "Verification"],
            ...donors.map((d) => [
                d.user?.name || "",
                d.user?.email || "",
                d.user?.phone || "",
                d.bloodGroup || "",
                d.district || "",
                d.area || "",
                d.availability || "",
                d.verificationStatus || "",
            ]),
        ];

        const csv = rows.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "raktosetu-donors.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-red-600">Donor Management</h1>
                    <p className="text-gray-600 mt-1">View, verify, reject, suspend, and manage blood donors.</p>
                </div>

                <div className="flex gap-2">
                    <button onClick={fetchDonors} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg">
                        <RefreshCcw size={16} /> Refresh
                    </button>
                    <button onClick={exportCSV} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {[
                    ["Total", summary.total],
                    ["Verified", summary.verified],
                    ["Pending", summary.pending],
                    ["Rejected", summary.rejected],
                    ["Suspended", summary.suspended],
                ].map(([title, value]) => (
                    <div key={title} className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">{title}</p>
                        <h2 className="text-2xl font-bold">{value}</h2>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSearch} className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="relative">
                    <Search size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search donor..."
                        className="border p-3 pl-10 rounded-lg w-full"
                    />
                </div>

                <select name="status" value={filters.status} onChange={handleFilterChange} className="border p-3 rounded-lg">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                </select>

                <select name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange} className="border p-3 rounded-lg">
                    <option value="">All Blood Groups</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>

                <select name="district" value={filters.district} onChange={handleFilterChange} className="border p-3 rounded-lg">
                    <option value="">All Districts</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                </select>

                <button className="bg-red-600 text-white rounded-lg font-semibold">Search</button>
            </form>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                {loading ? (
                    <div className="p-6 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : donors.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">No donor found.</p>
                ) : (
                    <>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-4 text-left">Donor</th>
                                    <th className="p-4 text-left">Blood</th>
                                    <th className="p-4 text-left">Location</th>
                                    <th className="p-4 text-left">Availability</th>
                                    <th className="p-4 text-left">Verification</th>
                                    <th className="p-4 text-left">Last Donation</th>
                                    <th className="p-4 text-left">Joined</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedDonors.map((donor) => (
                                    <tr key={donor._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            <button onClick={() => setSelectedDonor(donor)} className="font-bold text-left hover:text-red-600">
                                                {donor.user?.name}
                                            </button>
                                            <p className="text-gray-500">{donor.user?.email}</p>
                                            <p className="text-gray-500">{donor.user?.phone}</p>
                                        </td>

                                        <td className="p-4 font-bold text-red-600">{donor.bloodGroup}</td>
                                        <td className="p-4">{donor.area}, {donor.district}</td>
                                        <td className="p-4">{availabilityBadge(donor.availability)}</td>
                                        <td className="p-4">{verificationBadge(donor.verificationStatus)}</td>
                                        <td className="p-4">{formatDate(donor.lastDonationDate)}</td>
                                        <td className="p-4">{formatDate(donor.createdAt)}</td>

                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={() => setSelectedDonor(donor)} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1">
                                                    <Eye size={14} /> View
                                                </button>

                                                {donor.verificationStatus !== "verified" && (
                                                    <button onClick={() => setConfirmAction({ type: "verify", id: donor._id })} className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1">
                                                        <CheckCircle size={14} /> Verify
                                                    </button>
                                                )}

                                                {donor.verificationStatus !== "rejected" && (
                                                    <button onClick={() => setConfirmAction({ type: "reject", id: donor._id })} className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1">
                                                        <Ban size={14} /> Reject
                                                    </button>
                                                )}

                                                {donor.verificationStatus !== "suspended" && (
                                                    <button onClick={() => setConfirmAction({ type: "suspend", id: donor._id })} className="bg-gray-700 text-white px-3 py-1 rounded flex items-center gap-1">
                                                        <PauseCircle size={14} /> Suspend
                                                    </button>
                                                )}

                                                <button onClick={() => setConfirmAction({ type: "delete", id: donor._id })} className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1">
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex items-center justify-between p-4">
                            <p className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * donorsPerPage + 1} - {Math.min(currentPage * donorsPerPage, donors.length)} of {donors.length} donors
                            </p>

                            <div className="flex gap-2">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="px-4 py-2 border rounded disabled:opacity-50">
                                    Prev
                                </button>

                                <span className="px-4 py-2 bg-gray-900 text-white rounded">{currentPage} / {totalPages}</span>

                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="px-4 py-2 border rounded disabled:opacity-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {selectedDonor && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
                        <button onClick={() => setSelectedDonor(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
                            <X />
                        </button>

                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold">
                                {selectedDonor.bloodGroup}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-red-600">{selectedDonor.user?.name}</h2>
                                <p className="text-gray-500">{selectedDonor.user?.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>Phone:</strong> {selectedDonor.user?.phone}</p>
                            <p><strong>Blood Group:</strong> {selectedDonor.bloodGroup}</p>
                            <p><strong>District:</strong> {selectedDonor.district}</p>
                            <p><strong>Area:</strong> {selectedDonor.area}</p>
                            <p><strong>Availability:</strong> {availabilityBadge(selectedDonor.availability)}</p>
                            <p><strong>Verification:</strong> {verificationBadge(selectedDonor.verificationStatus)}</p>
                            <p><strong>Last Donation:</strong> {formatDate(selectedDonor.lastDonationDate)}</p>
                            <p><strong>Joined:</strong> {formatDate(selectedDonor.createdAt)}</p>
                            <p><strong>Latitude:</strong> {selectedDonor.latitude || "N/A"}</p>
                            <p><strong>Longitude:</strong> {selectedDonor.longitude || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}

            {confirmAction && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-2">Confirm Action</h2>
                        <p className="text-gray-600 mb-5">
                            Are you sure you want to {confirmAction.type} this donor?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmAction(null)} className="px-4 py-2 border rounded-lg">
                                Cancel
                            </button>
                            <button onClick={runAction} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDonors;