import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "./LoadingSpinner"

export default function RoleRoute({ allowedRole, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner fullPage text="Checking permissions..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) {
    // Redirect to appropriate dashboard based on actual role
    if (user.role === "OWNER") {
      return <Navigate to="/owner" replace />
    }
    return <Navigate to="/driver" replace />
  }

  return children
}
