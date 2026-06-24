import { useState } from "react";
import api from "../api/axios";
import DonorMap from "../components/DonorMap";

const FindDonor = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [radius, setRadius] = useState("20");

  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        alert("Your location added successfully!");
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  const handleSearch = async () => {
    try {
      setSearched(true);

      const res = await api.get("/donors/search", {
        params: {
          bloodGroup,
          district,
          area,
        },
      });

      console.log("RAW DONORS:", res.data);

      let donorData = res.data || [];

      if (userLocation) {
        donorData = donorData
          .map((donor) => {
            if (!donor.latitude || !donor.longitude) {
              return {
                ...donor,
                distance: null,
              };
            }

            const distance = getDistanceKm(
              userLocation.latitude,
              userLocation.longitude,
              donor.latitude,
              donor.longitude
            );

            return {
              ...donor,
              distance: Number(distance.toFixed(2)),
            };
          })
          .filter((donor) => {
            if (donor.distance === null) return true;
            return donor.distance <= Number(radius);
          })
          .sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
          });
      }

      console.log("FINAL DONORS:", donorData);
      setDonors(donorData);
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to search donors");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold text-red-600 mb-8">
        Find Blood Donor
      </h1>

      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="border p-3 rounded-lg"
        >
          <option value="">Blood Group</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <select
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="border p-3 rounded-lg"
        >
          <option value="1">1 KM</option>
          <option value="3">3 KM</option>
          <option value="5">5 KM</option>
          <option value="10">10 KM</option>
          <option value="20">20 KM</option>
          <option value="50">50 KM</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-red-600 text-white rounded-lg"
        >
          Search
        </button>
      </div>

      <button
        onClick={handleUseMyLocation}
        className="mb-8 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
      >
        📍 Use My Location for Nearby Donors
      </button>

      {userLocation && (
        <p className="text-green-700 mb-6">
          Your location added. Nearby donors will be sorted by distance.
        </p>
      )}

      {donors.length > 0 && (
        <DonorMap donors={donors} userLocation={userLocation} />
      )}

      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {donors.map((donor) => (
          <div key={donor._id} className="bg-white shadow-lg rounded-xl p-5">
            <h2 className="text-2xl font-bold mb-2">{donor.user?.name}</h2>

            <p>Blood Group: {donor.bloodGroup}</p>
            <p>District: {donor.district}</p>
            <p>Area: {donor.area}</p>
            <p>Availability: {donor.availability}</p>

            {donor.distance !== undefined && donor.distance !== null && (
              <p className="text-green-700 font-semibold">
                Distance: {donor.distance} KM away
              </p>
            )}

            <a
              href={`https://wa.me/88${donor.user?.phone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              WhatsApp Contact
            </a>
          </div>
        ))}
      </div>

      {searched && donors.length === 0 && (
        <p className="mt-10 text-gray-600">
          No donors found. Try increasing radius or changing blood group, district, or area.
        </p>
      )}
    </div>
  );
};

export default FindDonor;