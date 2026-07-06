import { useEffect, useState } from "react";
import { CalendarDays, Droplets, Phone, User } from "lucide-react";
import toast from "react-hot-toast";
import { getDonationHistory } from "../services/requestService";

const DonationHistory = () => {
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);

            const data = await getDonationHistory();

            setHistories(data);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load donation history"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-10 px-5">
                <h2 className="text-xl font-bold">Loading...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-5">

            <h1 className="text-4xl font-bold text-red-600 mb-2">
                Donation History
            </h1>

            <p className="text-gray-600 mb-8">
                View your completed blood donations.
            </p>

            {histories.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-10 text-center">

                    <h2 className="text-2xl font-bold">
                        No Donation History
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Your completed donations will appear here.
                    </p>

                </div>
            ) : (
                <div className="space-y-6">

                    {histories.map((history) => (
                        <div
                            key={history._id}
                            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                        >

                            <div className="flex justify-between flex-wrap gap-5">

                                <div>

                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Droplets className="text-red-600" />

                                        {history.bloodRequest?.bloodGroup}
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        Donation Completed Successfully
                                    </p>

                                </div>

                                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full h-fit font-semibold">
                                    Completed
                                </div>

                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mt-6">

                                <div className="bg-red-50 rounded-xl p-4">

                                    <p className="text-gray-500">
                                        Patient
                                    </p>

                                    <h3 className="font-bold">
                                        {history.bloodRequest?.patientName}
                                    </h3>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-gray-500">
                                        Hospital
                                    </p>

                                    <h3 className="font-bold">
                                        {history.bloodRequest?.hospitalName}
                                    </h3>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-gray-500">
                                        District
                                    </p>

                                    <h3 className="font-bold">
                                        {history.bloodRequest?.district}
                                    </h3>

                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-gray-500">
                                        Area
                                    </p>

                                    <h3 className="font-bold">
                                        {history.bloodRequest?.area}
                                    </h3>

                                </div>

                            </div>

                            <div className="mt-6 bg-blue-50 rounded-xl p-5">

                                <h3 className="font-bold mb-3 flex items-center gap-2">

                                    <User size={20} />

                                    Donor Information

                                </h3>

                                <p>
                                    <strong>Name:</strong>{" "}
                                    {history.donor?.user?.name}
                                </p>

                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {history.donor?.user?.phone}
                                </p>

                            </div>

                            <div className="mt-5 flex items-center gap-2 text-gray-500">

                                <CalendarDays size={18} />

                                {new Date(history.createdAt).toLocaleDateString()}

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default DonationHistory;