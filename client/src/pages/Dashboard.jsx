import { Link } from "react-router-dom";
import {
    User,
    Heart,
    FileText,
    History,
    Award,
    Settings,
    MapPinned,
} from "lucide-react";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="max-w-7xl mx-auto py-10 px-5">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-red-600">
                    Welcome, {user?.name}
                </h1>

                <p className="text-gray-600 mt-2">
                    Manage your RaktoSetu account from one place.
                </p>
            </div>

            {/* User Info */}
            <div className="bg-white rounded-2xl shadow p-6 mb-8">

                <div className="flex items-center gap-3 mb-5">
                    <User className="text-red-600" />
                    <h2 className="text-2xl font-bold">
                        My Account
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">

                    <div>
                        <p className="text-gray-500">Full Name</p>
                        <h3 className="font-semibold">{user?.name}</h3>
                    </div>

                    <div>
                        <p className="text-gray-500">Phone</p>
                        <h3 className="font-semibold">{user?.phone}</h3>
                    </div>

                    <div>
                        <p className="text-gray-500">Email</p>
                        <h3 className="font-semibold">
                            {user?.email || "Not Added"}
                        </h3>
                    </div>

                    <div>
                        <p className="text-gray-500">Account Type</p>
                        <h3 className="font-semibold capitalize">
                            {user?.role}
                        </h3>
                    </div>

                </div>
            </div>

            {/* Dashboard Modules */}

            <div className="grid md:grid-cols-3 gap-6">

                <Link
                    to="/donor-profile"
                    className="bg-white shadow rounded-xl p-6 hover:shadow-xl transition"
                >
                    <Heart className="text-red-600 mb-3" size={35} />

                    <h2 className="text-xl font-bold">
                        My Donor Profile
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Update availability, GPS location and donor information.
                    </p>
                </Link>

                <Link
                    to="/find-donor"
                    className="bg-white shadow rounded-xl p-6 hover:shadow-xl transition"
                >
                    <MapPinned className="text-red-600 mb-3" size={35} />

                    <h2 className="text-xl font-bold">
                        Find Blood Donor
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Search verified nearby blood donors instantly.
                    </p>
                </Link>

                <Link
                    to="/emergency-request"
                    className="bg-white shadow rounded-xl p-6 hover:shadow-xl transition"
                >
                    <FileText className="text-red-600 mb-3" size={35} />

                    <h2 className="text-xl font-bold">
                        Emergency Request
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Create an emergency blood request for patients.
                    </p>
                </Link>

                <Link
                    to="/my-requests"
                    className="bg-white shadow rounded-xl p-6 hover:shadow-xl transition"
                >
                    <FileText className="text-red-600 mb-3" size={35} />

                    <h2 className="text-xl font-bold">
                        My Blood Requests
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Track all your emergency blood requests.
                    </p>
                </Link>

                <Link
                    to="/available-requests"
                    className="bg-white shadow rounded-xl p-6 hover:shadow-xl transition"
                >
                    <FileText className="text-red-600 mb-3" size={35} />

                    <h2 className="text-xl font-bold">
                        Available Blood Requests
                    </h2>

                    <p className="text-gray-600 mt-2">
                        View pending requests and accept donation requests.
                    </p>
                </Link>
                <Link
                    to="/donation-history"
                    className="bg-white shadow rounded-xl p-6 hover:shadow-xl transition"
                >
                    <History className="text-red-600 mb-3" size={35} />

                    <h2 className="text-xl font-bold">
                        Donation History
                    </h2>

                    <p className="text-gray-600 mt-2">
                        View your completed blood donation history.
                    </p>
                </Link>

                {/* Certificate and Settings Comment Kora holo */}
                {/* <div className="bg-white shadow rounded-xl p-6 opacity-70">
                    <Award className="text-red-600 mb-3" size={35} />

                    <h2 className="text-xl font-bold">
                        Certificates
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Coming in next module.
                    </p>
                </div>

                <div className="bg-white shadow rounded-xl p-6 opacity-70">
                    <Settings className="text-red-600 mb-3" size={35} />

                    <h2 className="text-xl font-bold">
                        Settings
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Coming in next module.
                    </p>
                </div> */}

            </div>

        </div>
    );
};

export default Dashboard;