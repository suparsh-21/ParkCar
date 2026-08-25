import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { loginUser } from "../services/authService"
import { Car, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react"

export default function Login() {
  const { setUser } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (errorMessage) setErrorMessage("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter both email and password")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      const data = await loginUser(formData)
      setUser(data.user)
      success(data.message || "Welcome back to ParkKar!")

      // Check if user came from a protected page or navigate based on role
      const destination = location.state?.from?.pathname || (data.user.role === "OWNER" ? "/owner" : "/driver")
      navigate(destination, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || err.customMessage || err.message || "Invalid email or password. Please try again."
      setErrorMessage(msg)
      toastError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "calc(100vh - var(--navbar-height))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      position: "relative"
    }}>
      {/* Background subtle glow */}
      <div style={{
        position: "absolute",
        width: "350px",
        height: "350px",
        background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />

      <div className="card-glass" style={{
        width: "100%",
        maxWidth: "440px",
        padding: "2.5rem 2rem",
        borderRadius: "var(--radius-xl)",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, var(--primary-600), var(--accent-cyan))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            color: "#ffffff",
            boxShadow: "0 0 20px var(--primary-glow)"
          }}>
            <Car size={26} />
          </div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Sign in to ParkKar</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Access your bookings, active parkings & directions
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            color: "#fca5a5",
            fontSize: "0.85rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon-left" size={18} />
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <div className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="password" style={{ cursor: "pointer" }}>Password</label>
              <Link
                to="/forgot-password"
                style={{
                  color: "var(--primary-500)",
                  fontSize: "0.8rem",
                  fontWeight: 500
                }}
              >
                Forgot password?
              </Link>
            </div>
            <div className="input-icon-wrapper" style={{ position: "relative" }}>
              <Lock className="input-icon-left" size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={{ paddingRight: "2.75rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.8rem", fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div style={{
          marginTop: "2rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--border-subtle)",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "var(--text-secondary)"
        }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--primary-500)", fontWeight: 600 }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}