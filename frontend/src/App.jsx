import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Context Providers
import { AuthProvider } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import RoleRoute from "./components/RoleRoute"

// Pages
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import DriverDashboard from "./pages/DriverDashboard"
import FindParking from "./pages/FindParking"
import MyBookings from "./pages/MyBookings"
import OwnerDashboard from "./pages/OwnerDashboard"
import OwnerParkings from "./pages/OwnerParkings"
import CreateParking from "./pages/CreateParking"
import EditParking from "./pages/EditParking"
import OwnerBookings from "./pages/OwnerBookings"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/find-parking" element={<FindParking />} />

                {/* Driver Routes */}
                <Route
                  path="/driver"
                  element={
                    <RoleRoute allowedRole="DRIVER">
                      <DriverDashboard />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <RoleRoute allowedRole="DRIVER">
                      <MyBookings />
                    </RoleRoute>
                  }
                />

                {/* Owner Routes */}
                <Route
                  path="/owner"
                  element={
                    <RoleRoute allowedRole="OWNER">
                      <OwnerDashboard />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/owner/parkings"
                  element={
                    <RoleRoute allowedRole="OWNER">
                      <OwnerParkings />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/owner/parkings/create"
                  element={
                    <RoleRoute allowedRole="OWNER">
                      <CreateParking />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/owner/parkings/:parking_id/edit"
                  element={
                    <RoleRoute allowedRole="OWNER">
                      <EditParking />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/owner/parkings/:parking_id/bookings"
                  element={
                    <RoleRoute allowedRole="OWNER">
                      <OwnerBookings />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/owner/bookings"
                  element={
                    <RoleRoute allowedRole="OWNER">
                      <OwnerBookings />
                    </RoleRoute>
                  }
                />

                {/* 404 Catch All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App