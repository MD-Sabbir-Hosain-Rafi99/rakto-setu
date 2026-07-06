import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getMyBloodRequests,
    completeBloodRequest,
} from "../services/requestService";

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await getMyBloodRequests();
            setRequests(data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleComplete = async (id) => {
        if (!window.confirm("Confirm donation completed?")) return;

        try {
            await completeBloodRequest(id);

            toast.success("Donation completed successfully");

            loadRequests();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed");
        }
    };

    if (loading)
        return (
            <div className="max-w-7xl mx-auto py-10 px-5">
                Loading...
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto py-10 px-5">

            <h1 className="text-4xl font-bold text-red-600">
                My Blood Requests
            </h1>

            <p className="text-gray-600 mt-2 mb-8">
                Track every emergency request you've created.
            </p>

            {requests.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                    No requests found.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">

                    {requests.map((req) => (
                        <div
                            key={req._id}
                            className="bg-white rounded-2xl shadow p-6"
                        >
                            <div className="flex justify-between">

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {req.patientName}
                                    </h2>

                                    <p className="text-red-600 text-xl font-bold">
                                        🩸 {req.bloodGroup}
                                    </p>
                                </div>

                                <span className="bg-red-100 px-3 py-1 rounded-full capitalize font-semibold">
                                    {req.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-5">

                                <div className="bg-gray-50 p-3 rounded">
                                    Hospital
                                    <br />
                                    <b>{req.hospitalName}</b>
                                </div>

                                <div className="bg-gray-50 p-3 rounded">
                                    Location
                                    <br />
                                    <b>
                                        {req.area}, {req.district}
                                    </b>
                                </div>

                                <div className="bg-gray-50 p-3 rounded">
                                    Units
                                    <br />
                                    <b>{req.unitsNeeded}</b>
                                </div>

                                <div className="bg-gray-50 p-3 rounded">
                                    Urgency
                                    <br />
                                    <b>{req.urgencyLevel}</b>
                                </div>

                            </div>

                            {req.acceptedBy && (
                                <div className="bg-green-50 rounded-lg p-4 mt-5">

                                    <h3 className="font-bold mb-2">
                                        Accepted By
                                    </h3>

                                    <p>{req.acceptedBy.name}</p>

                                    <p>{req.acceptedBy.phone}</p>

                                    <a
                                        href={`https://wa.me/88${req.acceptedBy.phone}`}
                                        className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        WhatsApp
                                    </a>

                                </div>
                            )}

                            {req.status === "accepted" && (
                                <button
                                    onClick={() => handleComplete(req._id)}
                                    className="w-full mt-5 bg-red-600 text-white py-3 rounded-lg font-bold"
                                >
                                    Donation Completed
                                </button>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRequests;