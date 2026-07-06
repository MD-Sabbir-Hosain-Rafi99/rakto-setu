import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminRoute from "./AdminRoute";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FindDonor from "../pages/FindDonor";
import EmergencyRequest from "../pages/EmergencyRequest";
import Dashboard from "../pages/Dashboard";
import DonorProfile from "../pages/DonorProfile";

import AdminDashboard from "../pages/AdminDashboard";
import AdminDonors from "../pages/AdminDonors";
import AdminRequests from "../pages/AdminRequests";
import AdminUsers from "../pages/AdminUsers";
import AvailableRequests from "../pages/AvailableRequests";
import MyRequests from "../pages/MyRequests";
import DonationHistory from "../pages/DonationHistory";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route
            path="find-donor"
            element={
              <ProtectedRoute>
                <FindDonor />
              </ProtectedRoute>
            }
          />

          <Route
            path="emergency-request"
            element={
              <ProtectedRoute>
                <EmergencyRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="donor-profile"
            element={
              <ProtectedRoute>
                <DonorProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="available-requests"
            element={
              <ProtectedRoute>
                <AvailableRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="my-requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="donation-history"
            element={
              <ProtectedRoute>
                <DonationHistory />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/raktosetu-secure-admin-2026"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="donors" element={<AdminDonors />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;