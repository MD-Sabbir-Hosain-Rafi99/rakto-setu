import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/AdminDashboard";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FindDonor from "../pages/FindDonor";
import EmergencyRequest from "../pages/EmergencyRequest";
import Dashboard from "../pages/Dashboard";
import DonorProfile from "../pages/DonorProfile";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/find-donor" element={<FindDonor />} />
          <Route path="/emergency-request" element={<EmergencyRequest />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donor-profile" element={<DonorProfile />} />
          <Route
            path="/raktosetu-secure-admin-2026"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;