import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    Eye,
    RefreshCcw,
    Download,
    Search,
    X,
    CheckCircle,
    Trash2,
    AlertTriangle,
} from "lucide-react";
import {
    getAllRequests,
    updateRequestStatus,
    deleteRequest,
} from "../services/adminService";

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const requestsPerPage = 5;

    const [filters, setFilters] = useState({
        status: "",
        bloodGroup: "",
        district: "",
        search: "",
    });

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await getAllRequests(filters);
            setRequests(data);
            setCurrentPage(1);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load blood requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const summary = {
        total: requests.length,
        pending: requests.filter((r) => r.status === "pending").length,
        accepted: requests.filter((r) => r.status === "accepted").length,
        completed: requests.filter((r) => r.status === "completed").length,
        expired: requests.filter((r) => r.status === "expired").length,
        critical: requests.filter((r) => r.urgencyLevel === "critical").length,
    };

    const totalPages = Math.ceil(requests.length / requestsPerPage) || 1;

    const paginatedRequests = useMemo(() => {
        const startIndex = (currentPage - 1) * requestsPerPage;
        return requests.slice(startIndex, startIndex + requestsPerPage);
    }, [requests, currentPage]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRequests();
    };

    const runAction = async () => {
        if (!confirmAction) return;

        try {
            if (confirmAction.type === "delete") {
                await deleteRequest(confirmAction.id);
                toast.success("Blood request deleted successfully");
            } else {
                await updateRequestStatus(confirmAction.id, confirmAction.type);
                toast.success(`Request marked as ${confirmAction.type}`);
            }

            setConfirmAction(null);
            await fetchRequests();
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        }
    };

    const statusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            accepted: "bg-blue-100 text-blue-700 border-blue-200",
            completed: "bg-green-100 text-green-700 border-green-200",
            expired: "bg-gray-200 text-gray-700 border-gray-300",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[status] || "bg-gray-100 text-gray-700"}`}>
                {status || "pending"}
            </span>
        );
    };

    const urgencyBadge = (urgency) => {
        const styles = {
            critical: "bg-red-100 text-red-700 border-red-200",
            urgent: "bg-orange-100 text-orange-700 border-orange-200",
            normal: "bg-green-100 text-green-700 border-green-200",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[urgency] || "bg-gray-100 text-gray-700"}`}>
                {urgency || "normal"}
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
            ["Patient", "Blood Group", "Units", "Hospital", "District", "Area", "Contact", "Urgency", "Status"],
            ...requests.map((r) => [
                r.patientName || "",
                r.bloodGroup || "",
                r.unitsNeeded || "",
                r.hospitalName || "",
                r.district || "",
                r.area || "",
                r.contactNumber || "",
                r.urgencyLevel || "",
                r.status || "",
            ]),
        ];

        const csv = rows.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "raktosetu-blood-requests.csv";
        a.click();
        URL.revokeObjectURL(url);

        toast.success("CSV exported successfully");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-red-600">
                        Blood Request Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Monitor, update, and manage emergency blood requests.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchRequests}
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
                    ["Pending", summary.pending],
                    ["Accepted", summary.accepted],
                    ["Completed", summary.completed],
                    ["Expired", summary.expired],
                    ["Critical", summary.critical],
                ].map(([title, value]) => (
                    <div key={title} className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">{title}</p>
                        <h2 className="text-2xl font-bold">{value}</h2>
                    </div>
                ))}
            </div>

            <form
                onSubmit={handleSearch}
                className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3"
            >
                <div className="relative">
                    <Search size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search patient, hospital or phone..."
                        className="border p-3 pl-10 rounded-lg w-full"
                    />
                </div>

                <select name="status" value={filters.status} onChange={handleFilterChange} className="border p-3 rounded-lg">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                    <option value="expired">Expired</option>
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
                ) : requests.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">
                        No blood request found.
                    </p>
                ) : (
                    <>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-4 text-left">Patient</th>
                                    <th className="p-4 text-left">Blood</th>
                                    <th className="p-4 text-left">Hospital</th>
                                    <th className="p-4 text-left">Location</th>
                                    <th className="p-4 text-left">Urgency</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Created</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedRequests.map((request) => (
                                    <tr key={request._id} className="border-b hover:bg-red-50 transition">
                                        <td className="p-4">
                                            <button
                                                onClick={() => setSelectedRequest(request)}
                                                className="font-bold text-left hover:text-red-600"
                                            >
                                                {request.patientName}
                                            </button>
                                            <p className="text-gray-500">
                                                Contact: {request.contactNumber}
                                            </p>
                                        </td>

                                        <td className="p-4 font-bold text-red-600">
                                            {request.bloodGroup} ({request.unitsNeeded} unit)
                                        </td>

                                        <td className="p-4">{request.hospitalName}</td>
                                        <td className="p-4">{request.area}, {request.district}</td>
                                        <td className="p-4">{urgencyBadge(request.urgencyLevel)}</td>
                                        <td className="p-4">{statusBadge(request.status)}</td>
                                        <td className="p-4">{formatDate(request.createdAt)}</td>

                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                >
                                                    <Eye size={14} /> View
                                                </button>

                                                {request.status === "pending" && (
                                                    <button
                                                        onClick={() => setConfirmAction({ type: "expired", id: request._id })}
                                                        className="bg-gray-700 text-white px-3 py-1 rounded flex items-center gap-1"
                                                    >
                                                        <AlertTriangle size={14} /> Expire
                                                    </button>
                                                )}

                                                {request.status === "accepted" && (
                                                    <>
                                                        <button
                                                            onClick={() => setConfirmAction({ type: "completed", id: request._id })}
                                                            className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                        >
                                                            <CheckCircle size={14} /> Complete
                                                        </button>

                                                        <button
                                                            onClick={() => setConfirmAction({ type: "expired", id: request._id })}
                                                            className="bg-gray-700 text-white px-3 py-1 rounded flex items-center gap-1"
                                                        >
                                                            <AlertTriangle size={14} /> Expire
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => setConfirmAction({ type: "delete", id: request._id })}
                                                    className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                >
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
                                Showing {(currentPage - 1) * requestsPerPage + 1} -{" "}
                                {Math.min(currentPage * requestsPerPage, requests.length)} of{" "}
                                {requests.length} requests
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

            {selectedRequest && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
                        >
                            <X />
                        </button>

                        <h2 className="text-2xl font-bold text-red-600 mb-5">
                            🩸 Blood Request Details
                        </h2>

                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold">
                                {selectedRequest.bloodGroup}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-red-600">
                                    {selectedRequest.patientName}
                                </h2>
                                <p className="text-gray-500">{selectedRequest.hospitalName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>Patient:</strong> {selectedRequest.patientName}</p>
                            <p><strong>Blood Group:</strong> {selectedRequest.bloodGroup}</p>
                            <p><strong>Units Needed:</strong> {selectedRequest.unitsNeeded}</p>
                            <p><strong>Hospital:</strong> {selectedRequest.hospitalName}</p>
                            <p><strong>District:</strong> {selectedRequest.district}</p>
                            <p><strong>Area:</strong> {selectedRequest.area}</p>
                            <p><strong>Contact:</strong> {selectedRequest.contactNumber}</p>
                            <p><strong>Urgency:</strong> {urgencyBadge(selectedRequest.urgencyLevel)}</p>
                            <p><strong>Status:</strong> {statusBadge(selectedRequest.status)}</p>
                            <p><strong>Created:</strong> {formatDate(selectedRequest.createdAt)}</p>
                            <p className="md:col-span-2">
                                <strong>Message:</strong> {selectedRequest.message || "N/A"}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedRequest(null)}
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
                            Are you sure you want to{" "}
                            {confirmAction.type === "delete"
                                ? "delete"
                                : `mark as ${confirmAction.type}`}{" "}
                            this blood request?
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

export default AdminRequests;