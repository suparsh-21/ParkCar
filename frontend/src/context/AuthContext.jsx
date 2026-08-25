import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { getCurrentUser, logoutUser } from "../services/authService"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkUser = useCallback(async () => {
    try {
      const data = await getCurrentUser()
      setUser(data.user)
    } catch (error) {
      // 401 on initial startup is expected when not logged in; keep user as null without error
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error("Logout Error:", error.message)
      setUser(null)
    }
  }, [])

  const role = user?.role || null
  const isDriver = role === "DRIVER"
  const isOwner = role === "OWNER"

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        role,
        isDriver,
        isOwner,
        logout,
        checkUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext