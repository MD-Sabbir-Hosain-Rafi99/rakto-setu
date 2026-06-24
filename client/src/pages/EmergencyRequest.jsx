import { useState } from "react";
import api from "../api/axios";

const EmergencyRequest = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    unitsNeeded: "",
    hospitalName: "",
    district: "",
    area: "",
    contactNumber: "",
    urgencyLevel: "normal",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/requests", {
        ...formData,
        unitsNeeded: Number(formData.unitsNeeded),
      });

      alert(res.data.message);

      setFormData({
        patientName: "",
        bloodGroup: "",
        unitsNeeded: "",
        hospitalName: "",
        district: "",
        area: "",
        contactNumber: "",
        urgencyLevel: "normal",
        message: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Emergency Blood Request
        </h1>

        <p className="text-gray-600 mb-8">
          Submit an urgent blood request so nearby donors can contact you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Patient Name"
            className="w-full border p-3 rounded-lg"
            required
          />

          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="unitsNeeded"
            value={formData.unitsNeeded}
            onChange={handleChange}
            placeholder="Units Needed"
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            placeholder="Hospital Name"
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="District"
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Area"
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full border p-3 rounded-lg"
            required
          />

          <select
            name="urgencyLevel"
            value={formData.urgencyLevel}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="critical">Critical</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
          </select>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Additional message"
            className="w-full border p-3 rounded-lg h-28"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            {loading ? "Submitting..." : "Submit Emergency Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmergencyRequest;