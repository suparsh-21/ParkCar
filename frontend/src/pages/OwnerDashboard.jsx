import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getMyParkings, toggleParking } from "../services/parkingService"
import { useToast } from "../context/ToastContext"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import { 
  Building2, 
  PlusCircle, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  IndianRupee, 
  ArrowRight, 
  ToggleLeft, 
  ToggleRight, 
  Edit3, 
  Calendar,
  Sparkles
} from "lucide-react"

export default function OwnerDashboard() {
  const { user } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)

  const fetchParkings = async () => {
    try {
      const data = await getMyParkings()
      setParkings(data.parking || [])
    } catch (err) {
      console.error("Failed to load owner parkings", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParkings()
  }, [])

  const handleToggle = async (e, parkingId) => {
    e.stopPropagation()
    setTogglingId(parkingId)
    try {
      const data = await toggleParking(parkingId)
      success(data.message || "Parking status updated")
      await fetchParkings()
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to toggle status"
      toastError(msg)
    } finally {
      setTogglingId(null)
    }
  }

  // Calculated Real Statistics
  const totalLots = parkings.length
  const openLots = parkings.filter((p) => p.is_open).length
  const totalSlots = parkings.reduce((acc, p) => acc + Number(p.total_slots || 0), 0)
  const availableSlots = parkings.reduce((acc, p) => acc + Number(p.available_slots || 0), 0)

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 1.5rem)", paddingBottom: "4rem" }}>
      <div className="container">
        {/* Welcome & Action Header */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2.5rem"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--accent-purple)", fontWeight: 600 }}>
                Owner Portal,
              </span>
              <span className="badge badge-primary">Host Center</span>
            </div>
            <h1 style={{ fontSize: "2.2rem", margin: 0 }}>
              {user?.name || "Parking Owner"}
            </h1>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/owner/parkings" className="btn btn-secondary btn-lg">
              <Building2 size={18} />
              <span>Manage Lots</span>
            </Link>
            <Link to="/owner/parkings/create" className="btn btn-primary btn-lg" style={{ gap: "0.5rem" }}>
              <PlusCircle size={18} />
              <span>+ Add Parking Lot</span>
            </Link>
          </div>
        </div>

        {/* Real Analytics Metrics Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "3rem"
        }}>
          {/* Card 1: Total Lots */}
          <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Total Parking Lots</span>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "rgba(139, 92, 246, 0.15)",
                color: "var(--accent-purple)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Building2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff" }}>
              {totalLots}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {openLots} open · {totalLots - openLots} closed
            </div>
          </div>

          {/* Card 2: Open Lots */}
          <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Open & Active</span>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "rgba(16, 185, 129, 0.15)",
                color: "var(--success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#34d399" }}>
              {openLots}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Available for immediate driver reservation
            </div>
          </div>

          {/* Card 3: Total Capacity */}
          <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Total Capacity</span>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "rgba(37, 99, 235, 0.15)",
                color: "var(--primary-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Layers size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff" }}>
              {totalSlots}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Total parking bays registered
            </div>
          </div>

          {/* Card 4: Available Slots */}
          <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Live Free Slots</span>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "rgba(6, 182, 212, 0.15)",
                color: "var(--accent-cyan)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <IndianRupee size={18} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#38bdf8" }}>
              {availableSlots}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Unoccupied bay capacity right now
            </div>
          </div>
        </div>

        {/* Managed Lots Preview List */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", color: "var(--text-primary)" }}>Your Parking Locations</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Quickly toggle open/close status, update rates, or view driver bookings
              </p>
            </div>

            <Link to="/owner/parkings" className="btn btn-sm btn-outline" style={{ gap: "0.3rem" }}>
              <span>View All ({totalLots})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching your parking spaces..." />
          ) : parkings.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No parking lots listed yet"
              description="Start monetizing your parking space by creating your first parking lot listing with coordinates and hourly rates."
              actionText="+ Add Your First Parking Lot"
              onAction={() => navigate("/owner/parkings/create")}
            />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {parkings.slice(0, 6).map((lot) => (
                <div key={lot.id} className="card card-glass" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)" }}>{lot.name}</h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.2rem" }}>
                        <MapPin size={13} color="var(--primary-500)" />
                        <span>{lot.address}</span>
                      </p>
                    </div>
                    <span className={`badge ${lot.is_open ? 'badge-success' : 'badge-danger'}`}>
                      {lot.is_open ? "OPEN" : "CLOSED"}
                    </span>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    background: "var(--bg-surface-elevated)",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.85rem"
                  }}>
                    <div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Rate:</span>
                      <div style={{ fontWeight: 700, color: "#38bdf8" }}>₹{Number(lot.price_per_hour)}/hr</div>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Slots:</span>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                        {lot.available_slots} / {lot.total_slots}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid var(--border-subtle)"
                  }}>
                    <button
                      onClick={(e) => handleToggle(e, lot.id)}
                      disabled={togglingId === lot.id}
                      className={`btn btn-sm ${lot.is_open ? 'btn-outline' : 'btn-success'}`}
                      style={{ fontSize: "0.8rem", gap: "0.3rem" }}
                    >
                      {lot.is_open ? "Close Lot" : "Open Lot"}
                    </button>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Link
                        to={`/owner/parkings/${lot.id}/edit`}
                        className="btn btn-sm btn-secondary"
                        style={{ padding: "0.4rem 0.7rem" }}
                        title="Edit parking details"
                      >
                        <Edit3 size={14} />
                      </Link>

                      <Link
                        to={`/owner/parkings/${lot.id}/bookings`}
                        className="btn btn-sm btn-primary"
                        style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem", gap: "0.3rem" }}
                      >
                        <Calendar size={14} />
                        <span>Bookings</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}