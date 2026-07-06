import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getAllBloodRequests,
    acceptBloodRequest,
} from "../services/requestService";

const AvailableRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await getAllBloodRequests();
            setRequests(data.filter((req) => req.status === "pending"));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAccept = async (id) => {
        try {
            await acceptBloodRequest(id);
            toast.success("Request accepted successfully");
            fetchRequests();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to accept request");
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-10 px-5">
                <h2 className="text-xl font-bold">Loading requests...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-5">
            <h1 className="text-4xl font-bold text-red-600">
                Available Blood Requests
            </h1>

            <p className="text-gray-600 mt-2 mb-8">
                Accept emergency blood requests and help save lives.
            </p>

            {requests.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                    <h2 className="text-xl font-bold">No pending requests found</h2>
                    <p className="text-gray-600 mt-2">
                        New emergency blood requests will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {requests.map((request) => (
                        <div
                            key={request._id}
                            className="bg-white rounded-2xl shadow p-6 border border-gray-100"
                        >
                            <div className="flex justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {request.patientName}
                                    </h2>
                                    <p className="text-red-600 font-bold text-xl mt-1">
                                        🩸 {request.bloodGroup} ({request.unitsNeeded} unit)
                                    </p>
                                </div>

                                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold h-fit capitalize">
                                    {request.urgencyLevel}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 text-sm">
                                <p className="bg-gray-50 p-3 rounded-lg">
                                    <strong>Hospital:</strong> {request.hospitalName}
                                </p>

                                <p className="bg-gray-50 p-3 rounded-lg">
                                    <strong>Location:</strong> {request.area}, {request.district}
                                </p>

                                <p className="bg-gray-50 p-3 rounded-lg">
                                    <strong>Contact:</strong> {request.contactNumber}
                                </p>

                                <p className="bg-red-50 p-3 rounded-lg">
                                    <strong>Status:</strong> {request.status}
                                </p>
                            </div>

                            {request.message && (
                                <p className="mt-4 bg-blue-50 p-3 rounded-lg text-sm">
                                    <strong>Message:</strong> {request.message}
                                </p>
                            )}

                            <button
                                onClick={() => handleAccept(request._id)}
                                className="w-full mt-5 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
                            >
                                Accept Request
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvailableRequests;