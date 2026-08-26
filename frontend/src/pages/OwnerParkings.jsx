import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getMyParkings, toggleParking, deleteParking } from "../services/parkingService"
import { useToast } from "../context/ToastContext"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import { openGoogleMapsDirections } from "../utils/directions"
import { 
  Building2, 
  PlusCircle, 
  MapPin, 
  Edit3, 
  Calendar, 
  Search, 
  RefreshCw, 
  Navigation,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  AlertTriangle,
  Loader2
} from "lucide-react"

export default function OwnerParkings() {
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)
  const [lotToDelete, setLotToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchParkings = async () => {
    setLoading(true)
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

  const handleToggle = async (parkingId) => {
    setTogglingId(parkingId)
    try {
      const data = await toggleParking(parkingId)
      success(data.message || "Parking status changed")
      await fetchParkings()
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to toggle status"
      toastError(msg)
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async () => {
    if (!lotToDelete || deleting) return
    setDeleting(true)
    try {
      const data = await deleteParking(lotToDelete.id)
      success(data?.message || "Parking lot deleted successfully.")
      setParkings((prev) => prev.filter((p) => p.id !== lotToDelete.id))
      setLotToDelete(null)
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete parking lot."
      toastError(msg)
    } finally {
      setDeleting(false)
    }
  }

  const filteredParkings = parkings.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 1.5rem)", paddingBottom: "4rem" }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div>
            <h1 style={{ fontSize: "2.2rem", marginBottom: "0.25rem" }}>My Parking Lots</h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
              Manage your parking spaces, live availability & active listings
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={fetchParkings}
              className="btn btn-outline btn-sm"
              disabled={loading}
              style={{ gap: "0.4rem" }}
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>

            <Link to="/owner/parkings/create" className="btn btn-primary btn-sm" style={{ gap: "0.4rem" }}>
              <PlusCircle size={16} />
              <span>+ Add New Lot</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="card-glass" style={{
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-lg)",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div className="input-icon-wrapper" style={{ width: "100%", maxWidth: "420px" }}>
            <Search className="input-icon-left" size={18} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by lot name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <span className="badge badge-primary">
            {filteredParkings.length} Lots
          </span>
        </div>

        {/* Parking Grid */}
        {loading ? (
          <LoadingSpinner text="Loading your parking lots..." />
        ) : filteredParkings.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={searchQuery ? "No matching parking lots" : "No parking lots registered yet"}
            description={
              searchQuery
                ? "No lots match your search query."
                : "Add your first parking lot to begin receiving driver bookings and generating revenue."
            }
            actionText={!searchQuery ? "+ Add Parking Lot" : undefined}
            onAction={!searchQuery ? () => navigate("/owner/parkings/create") : undefined}
          />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "1.5rem"
          }}>
            {filteredParkings.map((lot) => (
              <div
                key={lot.id}
                className="card card-glass card-hover"
                style={{
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  border: lot.is_open ? "1px solid var(--border-subtle)" : "1px solid rgba(239, 68, 68, 0.2)"
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>{lot.name}</h3>
                    <p style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      marginTop: "0.25rem"
                    }}>
                      <MapPin size={14} color="var(--primary-500)" style={{ flexShrink: 0 }} />
                      <span>{lot.address}</span>
                    </p>
                  </div>

                  <span className={`badge ${lot.is_open ? 'badge-success' : 'badge-danger'}`} style={{ flexShrink: 0 }}>
                    {lot.is_open ? "OPEN" : "CLOSED"}
                  </span>
                </div>

                {/* Capacity & Price Metrics Box */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  background: "var(--bg-surface-elevated)",
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem"
                }}>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Hourly Rate</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#38bdf8" }}>
                      ₹{Number(lot.price_per_hour)}/hr
                    </div>
                  </div>

                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Slot Capacity</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {lot.available_slots} <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>/ {lot.total_slots}</span>
                    </div>
                  </div>
                </div>

                {/* GPS Coordinates & Map Link */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)"
                }}>
                  <span>GPS: {Number(lot.latitude).toFixed(4)}, {Number(lot.longitude).toFixed(4)}</span>
                  <button
                    type="button"
                    onClick={() => openGoogleMapsDirections(lot.latitude, lot.longitude, null, null, lot.name)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--accent-cyan)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.8rem"
                    }}
                  >
                    <Navigation size={12} />
                    <span>View on Maps</span>
                  </button>
                </div>

                {/* Actions Bar */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid var(--border-subtle)",
                  flexWrap: "wrap"
                }}>
                  <button
                    onClick={() => handleToggle(lot.id)}
                    disabled={togglingId === lot.id}
                    className={`btn btn-sm ${lot.is_open ? 'btn-outline' : 'btn-success'}`}
                    style={{ fontSize: "0.825rem" }}
                  >
                    {togglingId === lot.id ? "Updating..." : lot.is_open ? "Close Lot" : "Open Lot"}
                  </button>

                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    <Link
                      to={`/owner/parkings/${lot.id}/edit`}
                      className="btn btn-sm btn-secondary"
                      style={{ padding: "0.45rem 0.75rem", fontSize: "0.825rem", gap: "0.3rem" }}
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </Link>

                    <Link
                      to={`/owner/parkings/${lot.id}/bookings`}
                      className="btn btn-sm btn-primary"
                      style={{ padding: "0.45rem 0.75rem", fontSize: "0.825rem", gap: "0.3rem" }}
                    >
                      <Calendar size={14} />
                      <span>Bookings</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setLotToDelete(lot)}
                      className="btn btn-sm btn-danger"
                      style={{ padding: "0.45rem 0.75rem", fontSize: "0.825rem", gap: "0.3rem" }}
                      title="Delete Parking Lot"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Parking Lot Confirmation Modal */}
      {lotToDelete && (
        <div className="modal-backdrop" onClick={() => !deleting && setLotToDelete(null)}>
          <div
            className="modal-content card-glass"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "440px", textAlign: "center" }}
          >
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "var(--danger-bg)",
              border: "1px solid var(--danger-border)",
              color: "var(--danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem"
            }}>
              <AlertTriangle size={28} />
            </div>

            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Delete Parking Lot?
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Are you sure you want to delete
            </p>
            <div style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "0.75rem",
              background: "var(--bg-surface-elevated)",
              padding: "0.6rem 0.85rem",
              borderRadius: "var(--radius-md)",
              wordBreak: "break-word"
            }}>
              "{lotToDelete.name}"
            </div>
            <p style={{ fontSize: "0.85rem", color: "#f87171", marginBottom: "1.5rem" }}>
              This action cannot be undone.
            </p>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setLotToDelete(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger"
                style={{ flex: 1, gap: "0.4rem" }}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete Parking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
