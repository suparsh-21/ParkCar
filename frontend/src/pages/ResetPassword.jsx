import React, { useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { resetPassword } from "../services/authService"
import { useToast } from "../context/ToastContext"
import { 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  KeyRound
} from "lucide-react"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [tokenExpired, setTokenExpired] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (!token) {
      setTokenExpired(true)
      setErrorMessage("Missing or invalid password reset token.")
      return
    }

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both password fields.")
      return
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      // Send ONLY token and password to backend (never confirmPassword)
      const data = await resetPassword(token, password)
      setSuccessState(true)
      success(data.message || "Password reset successfully!")
    } catch (err) {
      const msg = err.response?.data?.message || err.customMessage || err.message || "Failed to reset password."
      
      // Check if token is invalid or expired
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("expired") ||
        err.response?.status === 400
      ) {
        setTokenExpired(true)
      }
      
      setErrorMessage(msg)
      toastError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Render view
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
        maxWidth: "460px",
        padding: "2.5rem 2rem",
        borderRadius: "var(--radius-xl)",
        position: "relative",
        zIndex: 1
      }}>
        {/* State 1: Success Screen */}
        {successState ? (
          <div style={{ textAlign: "center", animation: "fadeIn 200ms ease-out" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid var(--success-border)",
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.25)"
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Password reset successfully</h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>
              Your ParkKar password has been updated. You can now log in with your new password.
            </p>

            <Link to="/login" className="btn btn-primary" style={{ width: "100%", padding: "0.8rem", gap: "0.5rem" }}>
              <span>Go to Login</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : !token || tokenExpired ? (
          /* State 2: Invalid / Expired Token Error Screen */
          <div style={{ textAlign: "center", animation: "fadeIn 200ms ease-out" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "var(--danger-bg)",
              border: "1px solid var(--danger-border)",
              color: "var(--danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              boxShadow: "0 0 20px rgba(239, 68, 68, 0.25)"
            }}>
              <ShieldAlert size={32} />
            </div>

            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Reset link expired</h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>
              This password reset link is invalid or has expired (links are valid for 15 minutes). Please request a new reset link.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link to="/forgot-password" className="btn btn-primary" style={{ gap: "0.5rem" }}>
                <span>Request New Reset Link</span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/login" className="btn btn-secondary" style={{ gap: "0.4rem" }}>
                <ArrowLeft size={16} />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          /* State 3: Reset Password Form */
          <div>
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
                <Lock size={24} />
              </div>
              <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Create a new password</h1>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Choose a strong password with at least 6 characters.
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
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">New Password</label>
                <div className="input-icon-wrapper" style={{ position: "relative" }}>
                  <Lock className="input-icon-left" size={18} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorMessage) setErrorMessage("")
                    }}
                    required
                    autoFocus
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className="form-group" style={{ marginBottom: "1.75rem" }}>
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-icon-wrapper" style={{ position: "relative" }}>
                  <Lock className="input-icon-left" size={18} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errorMessage) setErrorMessage("")
                    }}
                    required
                    autoComplete="new-password"
                    style={{ paddingRight: "2.75rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.8rem", fontSize: "1rem", gap: "0.5rem" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border-subtle)",
              textAlign: "center"
            }}>
              <Link
                to="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  fontWeight: 500
                }}
              >
                <ArrowLeft size={16} />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
