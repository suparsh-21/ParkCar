import React from "react"
import { Link } from "react-router-dom"
import { Car, ShieldCheck, Zap, Compass, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-subtle)",
      background: "var(--bg-main)",
      padding: "4rem 0 2rem",
      marginTop: "auto"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2.5rem",
          marginBottom: "3rem"
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, var(--primary-600), var(--accent-cyan))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff"
              }}>
                <Car size={18} />
              </div>
              <span style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "1.2rem",
                color: "#ffffff"
              }}>
                ParkKar
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Smart parking simplified. Real-time availability, instant slot reservations, seamless payments, and turn-by-turn navigation.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>Fast</span>
              <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>Secure</span>
              <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>Reliable</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              For Drivers
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
              <li><Link to="/find-parking" style={{ color: "var(--text-secondary)" }}>Find Nearby Parking</Link></li>
              <li><Link to="/my-bookings" style={{ color: "var(--text-secondary)" }}>Manage Bookings</Link></li>
              <li><Link to="/register" style={{ color: "var(--text-secondary)" }}>Create Driver Account</Link></li>
            </ul>
          </div>

          {/* Owners */}
          <div>
            <h4 style={{ fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              For Parking Owners
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
              <li><Link to="/register" style={{ color: "var(--text-secondary)" }}>List Your Parking Lot</Link></li>
              <li><Link to="/owner" style={{ color: "var(--text-secondary)" }}>Owner Portal</Link></li>
              <li><Link to="/owner/parkings" style={{ color: "var(--text-secondary)" }}>Manage Capacity</Link></li>
            </ul>
          </div>

          {/* Trust badges */}
          <div>
            <h4 style={{ fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Platform Highlights
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>Verified Parking Lots</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Zap size={16} color="#3b82f6" />
                <span>Instant Slot Confirmation</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Compass size={16} color="#06b6d4" />
                <span>1-Click Navigation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          paddingTop: "2rem",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          fontSize: "0.85rem",
          color: "var(--text-muted)"
        }}>
          <div>
            © {new Date().getFullYear()} ParkKar. All rights reserved. "Find. Park. Go."
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            Smart Urban Mobility Platform
          </div>
        </div>
      </div>
    </footer>
  )
}
