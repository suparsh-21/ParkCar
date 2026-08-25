import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/authService"
import { useToast } from "../context/ToastContext"
import { Car, User, Mail, Lock, Building2, ArrowRight, Loader2 } from "lucide-react"

export default function Register() {
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "DRIVER"
  })
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
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      const data = await registerUser(formData)
      success(data.message || "Account created successfully! Please sign in.")
      navigate("/login")
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please check your details."
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
      <div style={{
        position: "absolute",
        width: "350px",
        height: "350px",
        background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />

      <div className="card-glass" style={{
        width: "100%",
        maxWidth: "480px",
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
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Create your account</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Join ParkKar to find or list smart parking spots
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
            marginBottom: "1.25rem"
          }}>
            {errorMessage}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
          marginBottom: "1.5rem"
        }}>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: "DRIVER" }))}
            style={{
              padding: "0.85rem",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${formData.role === "DRIVER" ? "var(--primary-500)" : "var(--border-subtle)"}`,
              background: formData.role === "DRIVER" ? "rgba(37, 99, 235, 0.15)" : "var(--bg-surface)",
              color: formData.role === "DRIVER" ? "#60a5fa" : "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.35rem",
              transition: "all var(--transition-fast)"
            }}
          >
            <Car size={20} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>I am a Driver</span>
            <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>Find & reserve parking</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: "OWNER" }))}
            style={{
              padding: "0.85rem",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${formData.role === "OWNER" ? "var(--accent-purple)" : "var(--border-subtle)"}`,
              background: formData.role === "OWNER" ? "rgba(139, 92, 246, 0.15)" : "var(--bg-surface)",
              color: formData.role === "OWNER" ? "#c084fc" : "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.35rem",
              transition: "all var(--transition-fast)"
            }}
          >
            <Building2 size={20} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Parking Owner</span>
            <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>List lots & earn</span>
          </button>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="input-icon-wrapper">
              <User className="input-icon-left" size={18} />
              <input
                id="name"
                type="text"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          </div>

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

          <div className="form-group" style={{ marginBottom: "1.75rem" }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon-left" size={18} />
              <input
                id="password"
                type="password"
                name="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create {formData.role === "OWNER" ? "Owner" : "Driver"} Account</span>
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
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary-500)", fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}