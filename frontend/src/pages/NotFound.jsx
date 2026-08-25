import React from "react"
import { Link } from "react-router-dom"
import { Car, Compass, ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div style={{
      minHeight: "calc(100vh - var(--navbar-height))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center"
    }}>
      <div className="card-glass" style={{
        maxWidth: "480px",
        padding: "3rem 2rem",
        borderRadius: "var(--radius-xl)"
      }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(37, 99, 235, 0.15)",
          color: "var(--primary-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem"
        }}>
          <Compass size={36} />
        </div>

        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, color: "#38bdf8", marginBottom: "0.5rem" }}>
          404
        </h1>
        <h2 style={{ fontSize: "1.4rem", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          Page Not Found
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "2rem" }}>
          The parking spot or page you are looking for might have been moved, renamed, or is currently unavailable.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <Link to="/" className="btn btn-primary" style={{ gap: "0.4rem" }}>
            <Home size={16} />
            <span>Go Home</span>
          </Link>
          <Link to="/find-parking" className="btn btn-secondary" style={{ gap: "0.4rem" }}>
            <Car size={16} />
            <span>Find Parking</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
