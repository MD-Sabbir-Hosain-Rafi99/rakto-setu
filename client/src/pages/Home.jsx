import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Home = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/requests");
        setRequests(res.data);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    fetchRequests();
  }, []);

  const getBadgeColor = (level) => {
    if (level === "critical") return "bg-red-600";
    if (level === "urgent") return "bg-orange-500";
    return "bg-green-600";
  };

  return (
    <div>
      <section className="bg-red-600 text-white py-24 text-center">
        <h1 className="text-5xl font-bold">Save Lives With RaktoSetu</h1>

        <p className="mt-6 text-xl">
          Find blood donors instantly in your area
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/find-donor"
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold"
          >
            Find Donor
          </Link>

          <Link
            to="/emergency-request"
            className="bg-black px-6 py-3 rounded-lg font-semibold"
          >
            Emergency Request
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-16 px-5">
        <h2 className="text-4xl font-bold text-red-600 mb-8">
          🚨 Active Emergency Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-gray-600">No active emergency requests found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white shadow-lg rounded-xl p-6 border"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">
                    {request.bloodGroup}
                  </h3>

                  <span
                    className={`${getBadgeColor(
                      request.urgencyLevel
                    )} text-white px-3 py-1 rounded-full text-sm`}
                  >
                    {request.urgencyLevel}
                  </span>
                </div>

                <p>
                  <strong>Patient:</strong> {request.patientName}
                </p>

                <p>
                  <strong>Hospital:</strong> {request.hospitalName}
                </p>

                <p>
                  <strong>Location:</strong> {request.area}, {request.district}
                </p>

                <p>
                  <strong>Units:</strong> {request.unitsNeeded}
                </p>

                <p>
                  <strong>Status:</strong> {request.status}
                </p>

                <a
                  href={`https://wa.me/88${request.contactNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-5 bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  WhatsApp Contact
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;