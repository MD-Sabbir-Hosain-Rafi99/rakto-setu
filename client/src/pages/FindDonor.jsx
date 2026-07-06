import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import DonorMap from "../components/DonorMap";

const FindDonor = () => {
  const [filters, setFilters] = useState({
    bloodGroup: "",
    district: "",
    area: "",
    radius: "20",
    emergency: false,
    sortBy: "ai",
  });

  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatReplies, setChatReplies] = useState([
    {
      type: "bot",
      text: "🩸 Welcome! I'm RaktoSetu AI Assistant. Tell me what you need—for example, finding a donor, understanding blood groups, locating nearby donors, or getting emergency guidance.",
    },
  ]);

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

  const calculateAiScore = (donor) => {
    let score = 0;
    const reasons = [];

    if (donor.bloodGroup === filters.bloodGroup) {
      score += 45;
      reasons.push("Blood group matched");
    }

    if (donor.district?.toLowerCase() === filters.district?.toLowerCase()) {
      score += 15;
      reasons.push("Same district");
    }

    if (donor.area?.toLowerCase().includes(filters.area?.toLowerCase())) {
      score += 20;
      reasons.push("Same area");
    }

    if (donor.availability === "available") {
      score += 10;
      reasons.push("Available now");
    }

    if (donor.isVerified || donor.verificationStatus === "verified") {
      score += 10;
      reasons.push("Verified donor");
    }

    if (donor.distance !== null && donor.distance !== undefined) {
      if (donor.distance <= 3) score += 10;
      else if (donor.distance <= 10) score += 5;
    }

    if (filters.emergency) score += 10;

    return {
      aiScore: Math.min(score, 100),
      matchReasons: reasons,
    };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        toast.success("Your location added successfully");
      },
      () => {
        toast.error("Location permission denied");
      }
    );
  };

  const handleAiAssistant = async () => {
    if (!chatMessage.trim()) return;

    const message = chatMessage.trim();

    setChatReplies((prev) => [
      ...prev,
      { type: "user", text: message },
    ]);

    const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    const foundBloodGroup = bloodGroups.find((group) =>
      message.toUpperCase().includes(group)
    );

    const knownDistricts = [
      "Dhaka",
      "Chattogram",
      "Rajshahi",
      "Khulna",
      "Barishal",
      "Sylhet",
      "Rangpur",
      "Mymensingh",
    ];

    const foundDistrict = knownDistricts.find((d) =>
      message.toLowerCase().includes(d.toLowerCase())
    );

    let foundArea = "";

    if (foundDistrict) {
      foundArea = message
        .replace(foundBloodGroup || "", "")
        .replace(new RegExp(foundDistrict, "i"), "")
        .replace(/blood|need|urgent|emergency|in|at|for|please|lagbe|dorkar|chai/gi, "")
        .trim();
    }

    if (!foundBloodGroup) {
      setChatReplies((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Please mention a blood group, like O+, A-, B+, or AB+.",
        },
      ]);
      setChatMessage("");
      return;
    }

    const updatedFilters = {
      ...filters,
      bloodGroup: foundBloodGroup,
      district: foundDistrict || filters.district,
      area: foundArea || filters.area,
    };

    setFilters(updatedFilters);
    setChatMessage("");

    setChatReplies((prev) => [
      ...prev,
      {
        type: "bot",
        text: `I found your need: ${foundBloodGroup}${foundDistrict ? ` in ${foundDistrict}` : ""
          }${foundArea ? `, ${foundArea}` : ""}. Searching best matched donors now...`,
      },
    ]);

    try {
      setSearched(true);

      const res = await api.get("/donors/search", {
        params: {
          bloodGroup: updatedFilters.bloodGroup,
          district: updatedFilters.district,
          area: updatedFilters.area,
        },
      });

      let donorData = res.data || [];

      donorData = donorData.map((donor) => {
        let distance = null;

        if (userLocation && donor.latitude && donor.longitude) {
          distance = getDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            donor.latitude,
            donor.longitude
          );
        }

        return {
          ...donor,
          distance: distance !== null ? Number(distance.toFixed(2)) : null,
        };
      });

      donorData = donorData.map((donor) => ({
        ...donor,
        ...calculateAiScore(donor),
      }));

      donorData.sort((a, b) => b.aiScore - a.aiScore);

      setDonors(donorData);

      setChatReplies((prev) => [
        ...prev,
        {
          type: "bot",
          text:
            donorData.length > 0
              ? `I found ${donorData.length} matched donor(s). Please check the donor cards and map.`
              : "Sorry, I could not find any matched donor. Try another area or district.",
        },
      ]);
    } catch (error) {
      setChatReplies((prev) => [
        ...prev,
        {
          type: "bot",
          text: error.response?.data?.message || "Failed to search donors.",
        },
      ]);
    }
  };


  const searchDonors = async (searchFilters = filters) => {
    try {
      setSearched(true);

      const res = await api.get("/donors/search", {
        params: {
          bloodGroup: searchFilters.bloodGroup,
          district: searchFilters.district,
          area: searchFilters.area,
          emergency: searchFilters.emergency,
        },
      });

      let donorData = res.data || [];

      donorData = donorData.map((donor) => {
        let distance = null;

        if (userLocation && donor.latitude && donor.longitude) {
          distance = getDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            donor.latitude,
            donor.longitude
          );
        }

        return {
          ...donor,
          distance: distance !== null ? Number(distance.toFixed(2)) : null,
        };
      });

      if (userLocation) {
        donorData = donorData.filter((donor) => {
          if (donor.distance === null) return true;
          return donor.distance <= Number(searchFilters.radius);
        });
      }

      donorData = donorData
        .map((donor) => ({
          ...donor,
          ...calculateAiScore(donor),
        }))
        .sort((a, b) => b.aiScore - a.aiScore);

      setDonors(donorData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to search donors");
    }
  };



  const handleSearch = async (customFilters = null) => {
    try {
      setSearched(true);

      const searchFilters = customFilters || filters;

      const res = await api.get("/donors/search", {
        params: {
          bloodGroup: searchFilters.bloodGroup,
          district: searchFilters.district,
          area: searchFilters.area,
        },
      });

      let donorData = res.data || [];

      donorData = donorData.map((donor) => {
        let distance = null;

        if (userLocation && donor.latitude && donor.longitude) {
          distance = getDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            donor.latitude,
            donor.longitude
          );
        }

        return {
          ...donor,
          distance: distance !== null ? Number(distance.toFixed(2)) : null,
        };
      });

      if (userLocation) {
        donorData = donorData.filter((donor) => {
          if (donor.distance === null) return true;
          return donor.distance <= Number(searchFilters.radius);
        });
      }

      donorData = donorData.map((donor) => ({
        ...donor,
        ...calculateAiScore(donor),
      }));

      donorData.sort((a, b) => {
        if (searchFilters.sortBy === "distance") {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        }

        if (searchFilters.sortBy === "availability") {
          return a.availability === "available" ? -1 : 1;
        }

        return b.aiScore - a.aiScore;
      });

      setDonors(donorData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to search donors");
    }
  };


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const bloodGroup = params.get("bloodGroup");
    const district = params.get("district");
    const area = params.get("area");
    const autoSearch = params.get("autoSearch");

    if (autoSearch === "true" && bloodGroup) {
      const newFilters = {
        ...filters,
        bloodGroup,
        district: district || "",
        area: area || "",
      };

      setFilters(newFilters);

      // Automatically search
      handleSearch(newFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-red-600">
          Find the Best Blood Donor
        </h1>
        <p className="text-gray-600 mt-2">
          Search verified and available donors near your location.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-xl">Smart Donor Search</h2>

          <label className="flex items-center gap-2 text-red-600 font-semibold">
            <input
              type="checkbox"
              name="emergency"
              checked={filters.emergency}
              onChange={handleChange}
            />
            🚨 Critical Emergency
          </label>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          <select
            name="bloodGroup"
            value={filters.bloodGroup}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="">Blood Group *</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <input
            name="district"
            type="text"
            placeholder="District"
            value={filters.district}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="area"
            type="text"
            placeholder="Area"
            value={filters.area}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <select
            name="radius"
            value={filters.radius}
            onChange={handleChange}
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
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
          >
            🔍 Find Best Donor
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-5">
          <button
            onClick={handleUseMyLocation}
            className="bg-green-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            📍 Detect My Location
          </button>

          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="ai">Sort by AI Score</option>
            <option value="distance">Sort by Distance</option>
            <option value="availability">Sort by Availability</option>
          </select>
        </div>

        {userLocation && (
          <p className="text-green-700 mt-4">
            Your location is active. Nearby donors will be ranked better.
          </p>
        )}
      </div>

      {donors.length > 0 && (
        <DonorMap donors={donors} userLocation={userLocation} />
      )}

      <div className="mt-8 mb-4">
        <h2 className="text-2xl font-bold">
          Found <span className="text-red-600">{donors.length}</span> donor(s)
        </h2>
        {searched && donors.length > 0 && (
          <p className="text-gray-500">Sorted by smart matching score.</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {donors.map((donor) => (
          <div
            key={donor._id}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{donor.user?.name}</h2>
                <p className="text-red-600 font-bold text-xl mt-1">
                  🩸 {donor.bloodGroup}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">AI Match</p>
                <h3 className="text-3xl font-bold text-green-700">
                  {donor.aiScore}%
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
              <p className="bg-green-50 p-3 rounded-lg">
                ✅ {donor.availability}
              </p>

              <p className="bg-blue-50 p-3 rounded-lg">
                📍 {donor.distance !== null ? `${donor.distance} KM Away` : "Distance N/A"}
              </p>

              <p className="bg-red-50 p-3 rounded-lg">
                District: {donor.district}
              </p>

              <p className="bg-gray-50 p-3 rounded-lg">
                Area: {donor.area}
              </p>
            </div>

            <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-4">
              <h4 className="font-bold mb-2">Why High Match?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {donor.matchReasons?.map((reason) => (
                  <p key={reason}>✅ {reason}</p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <a
                href={`tel:${donor.user?.phone}`}
                className="bg-gray-900 text-white text-center py-3 rounded-lg font-semibold"
              >
                📞 Call
              </a>

              <a
                href={`https://wa.me/88${donor.user?.phone}`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 text-white text-center py-3 rounded-lg font-semibold"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {searched && donors.length === 0 && (
        <div className="mt-10 bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-bold text-red-600">No donors found</h2>
          <p className="text-gray-600 mt-2">
            Try changing blood group, district, area, or increasing radius.
          </p>
        </div>
      )}

      {/* <div className="mt-10 bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-2">Need Help Finding Donor?</h2>
        <p className="text-gray-600 mb-4">
          AI Assistant and Telegram Bot integration will be added next using n8n workflow.
        </p>

        <button className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
          🤖 Chat with AI Assistant Coming Soon
        </button>
      </div> */}
      {/* AI Assistant Floating Button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 bg-green-700 text-white px-5 py-4 rounded-full shadow-xl font-bold z-50"
      >
        🤖 AI Assistant
      </button>

      {/* AI Assistant Chat Box */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-[340px] bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">
          <div className="bg-green-800 text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold">🤖 RaktoSetu AI Assistant</h3>
            <button onClick={() => setChatOpen(false)}>✕</button>
          </div>

          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-gray-50">
            {chatReplies.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl text-sm max-w-[85%] ${msg.type === "user"
                  ? "bg-red-600 text-white ml-auto"
                  : "bg-white border text-gray-700"
                  }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAiAssistant()}
              placeholder="Type: O+ blood in Dhaka..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />

            <button
              onClick={handleAiAssistant}
              className="bg-green-700 text-white px-4 rounded-lg font-semibold"
            >
              Send
            </button>
          </div>

          {/* <div className="px-4 py-2 text-xs text-gray-500 border-t">
            n8n workflow integration coming next.
          </div> */}
        </div>
      )}
    </div>
  );
};

export default FindDonor;