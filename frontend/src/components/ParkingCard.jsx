import React from "react"
import { MapPin, Navigation, Car, Clock, ShieldCheck, ArrowRight } from "lucide-react"
import { openGoogleMapsDirections } from "../utils/directions"

export default function ParkingCard({
  parking,
  userLocation,
  isSelected = false,
  onSelect,
  onBook
}) {
  if (!parking) return null

  const handleDirections = (e) => {
    e.stopPropagation()
    openGoogleMapsDirections(
      parking.latitude,
      parking.longitude,
      userLocation?.latitude,
      userLocation?.longitude,
      parking.name
    )
  }

  const isAvailable = parking.available_slots > 0 && parking.is_open

  return (
    <div
      onClick={() => onSelect && onSelect(parking)}
      className="card card-hover"
      style={{
        cursor: onSelect ? "pointer" : "default",
        border: isSelected
          ? "2px solid var(--primary-500)"
          : "1px solid var(--border-subtle)",
        background: isSelected ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
        boxShadow: isSelected ? "var(--shadow-xl), var(--shadow-glow)" : "var(--shadow-md)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        transition: "all var(--transition-normal)"
      }}
    >
      {/* Header with Title and Price */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <h3 style={{ fontSize: "1.15rem", color: "var(--text-primary)", fontWeight: 700 }}>
              {parking.name}
            </h3>
          </div>
          <p style={{
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            lineHeight: 1.4
          }}>
            <MapPin size={14} color="var(--primary-500)" style={{ flexShrink: 0 }} />
            <span>{parking.address}</span>
          </p>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#38bdf8",
            fontFamily: "var(--font-heading)"
          }}>
            ₹{Number(parking.price_per_hour)}
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>/hr</span>
          </div>
          <span className={`badge ${parking.is_open ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: "0.2rem" }}>
            {parking.is_open ? "OPEN" : "CLOSED"}
          </span>
        </div>
      </div>

      {/* Badges / Metrics Bar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.6rem 0",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        fontSize: "0.825rem"
      }}>
        {parking.distance !== undefined && (
          <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Navigation size={13} color="var(--primary-500)" />
            <strong>{parking.distance} km</strong> away
          </span>
        )}

        <span style={{
          color: parking.available_slots > 0 ? "var(--success)" : "var(--danger)",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "0.35rem"
        }}>
          <span className={`status-dot ${parking.available_slots > 0 ? 'online' : 'offline'}`} />
          {parking.available_slots} / {parking.total_slots} spots available
        </span>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.5rem",
        marginTop: "0.25rem"
      }}>
        <button
          type="button"
          onClick={handleDirections}
          className="btn btn-sm btn-outline"
          style={{
            gap: "0.35rem",
            fontSize: "0.825rem",
            borderColor: "var(--border-subtle)"
          }}
          title="Open navigation in Google Maps"
        >
          <Navigation size={14} color="var(--accent-cyan)" />
          <span>Directions</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (onBook) onBook(parking)
          }}
          className={`btn btn-sm ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
          disabled={!isAvailable}
          style={{
            gap: "0.35rem",
            fontSize: "0.825rem"
          }}
        >
          <span>{isAvailable ? "Reserve Spot" : "Unavailable"}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
