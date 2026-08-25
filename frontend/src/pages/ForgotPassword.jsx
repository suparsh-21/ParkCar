import React, { useState } from "react"
import { Link } from "react-router-dom"
import { forgotPassword } from "../services/authService"
import { useToast } from "../context/ToastContext"
import { Car, Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle, KeyRound } from "lucide-react"

export default function ForgotPassword() {
  const { success, error: toastError } = useToast()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.trim()) {
      setErrorMessage("Please enter your email address")
      return
    }

    setLoading(true)
    setErrorMessage("")

    try {
      const data = await forgotPassword(email.trim())
      setSubmitted(true)
      success(data.message || "Password reset link sent!")
    } catch (err) {
      const msg = err.response?.data?.message || err.customMessage || err.message || "Failed to send reset link. Please try again."
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
      {/* Subtle background glow */}
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
        {submitted ? (
          /* Success State */
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

            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Check your email</h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              If an account exists with <strong style={{ color: "var(--text-primary)" }}>{email}</strong>, a password reset link has been sent.
            </p>

            <div style={{
              background: "var(--bg-surface-elevated)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              padding: "1rem",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "2rem",
              textAlign: "left"
            }}>
              💡 The link will remain active for <strong>15 minutes</strong>. If you don't see the email, please check your spam folder.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link to="/login" className="btn btn-primary" style={{ gap: "0.5rem" }}>
                <span>Back to Login</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn btn-outline btn-sm"
                style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)" }}
              >
                Send to another email
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
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
                <KeyRound size={24} />
              </div>
              <h1 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Forgot your password?</h1>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Enter your registered email address and we'll send you a secure link to reset your password.
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
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" htmlFor="email">Registered Email Address</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon-left" size={18} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errorMessage) setErrorMessage("")
                    }}
                    required
                    autoFocus
                    autoComplete="email"
                  />
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
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
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
