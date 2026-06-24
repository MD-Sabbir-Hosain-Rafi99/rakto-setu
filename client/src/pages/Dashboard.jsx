import { Link } from "react-router-dom";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="max-w-6xl mx-auto py-10 px-5">
            <h1 className="text-4xl font-bold mb-5">
                Welcome {user?.name}
            </h1>

            <div className="bg-white shadow-lg rounded-xl p-6">

                <h2 className="text-2xl font-semibold mb-3">
                    User Information
                </h2>

                <p>
                    <strong>Name:</strong> {user?.name}
                </p>

                <p>
                    <strong>Email:</strong> {user?.email}
                </p>

                <p>
                    <strong>Phone:</strong> {user?.phone}
                </p>

                <p>
                    <strong>Role:</strong> {user?.role}
                </p>

                <div className="mt-6">
                    <Link
                        to="/donor-profile"
                        className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
                    >
                        Complete Donor Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;