import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getMyParkings } from "../services/parkingService"
import { getParkingBookings } from "../services/bookingService"
import { useToast } from "../context/ToastContext"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import { 
  Building2, 
  Calendar, 
  Search, 
  Filter, 
  ArrowLeft, 
  User, 
  Mail, 
  Clock, 
  IndianRupee, 
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { formatDisplayDateTime } from "../utils/dateUtils"

export default function OwnerBookings() {
  const { parking_id } = useParams()
  const { error: toastError } = useToast()
  const navigate = useNavigate()

  const [parkings, setParkings] = useState([])
  const [selectedLotId, setSelectedLotId] = useState(parking_id || "")
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  // Load Owner's Parkings
  useEffect(() => {
    async function loadLots() {
      try {
        const data = await getMyParkings()
        const lots = data.parking || []
        setParkings(lots)

        if (!selectedLotId && lots.length > 0) {
          setSelectedLotId(lots[0].id)
        }
      } catch (err) {
        console.error("Failed to load lots", err)
      } finally {
        setLoading(false)
      }
    }

    loadLots()
  }, [])

  // Load Bookings for Selected Lot
  const fetchBookings = async (lotId) => {
    if (!lotId) return
    setLoadingBookings(true)
    try {
      const data = await getParkingBookings(lotId)
      setBookings(data.bookings || [])
    } catch (err) {
      console.error("Failed to load bookings", err)
      const msg = err.response?.data?.message || "Failed to load parking bookings"
      toastError(msg)
      setBookings([])
    } finally {
      setLoadingBookings(false)
    }
  }

  useEffect(() => {
    if (selectedLotId) {
      fetchBookings(selectedLotId)
    }
  }, [selectedLotId])

  const selectedLot = parkings.find((p) => p.id.toString() === selectedLotId?.toString())

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter
    const matchesSearch =
      (b.driver_name && b.driver_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.driver_email && b.driver_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.id.toString().includes(searchQuery)
    return matchesStatus && matchesSearch
  })

  // Calculate Confirmed Bookings Total Revenue
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED")
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.amount || 0), 0)

  const formatDateTime = (dt) => {
    return formatDisplayDateTime(dt)
  }

  if (loading) {
    return <LoadingSpinner fullPage text="Loading parking lots..." />
  }

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 1.5rem)", paddingBottom: "4rem" }}>
      <div className="container">
        {/* Back Link */}
        <Link
          to="/owner/parkings"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            marginBottom: "1.5rem"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Parking Lots</span>
        </Link>

        {/* Page Header with Lot Selector */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div>
            <h1 style={{ fontSize: "2.2rem", marginBottom: "0.25rem" }}>Parking Lot Bookings</h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
              View driver reservations, occupancy schedules, and collected payments
            </p>
          </div>

          {/* Lot Selector Dropdown */}
          {parkings.length > 0 && (
            <div style={{ minWidth: "260px" }}>
              <label className="form-label" style={{ fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                Select Parking Lot:
              </label>
              <select
                className="form-select"
                value={selectedLotId}
                onChange={(e) => setSelectedLotId(e.target.value)}
                style={{ fontWeight: 600 }}
              >
                {parkings.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.available_slots}/{p.total_slots} slots)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Summary Stats for this Lot */}
        {selectedLot && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem"
          }}>
            <div className="card" style={{ background: "var(--bg-surface-elevated)", padding: "1.25rem" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Total Bookings</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", marginTop: "0.25rem" }}>
                {bookings.length}
              </div>
            </div>

            <div className="card" style={{ background: "var(--bg-surface-elevated)", padding: "1.25rem" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Confirmed Reservations</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#34d399", marginTop: "0.25rem" }}>
                {confirmedBookings.length}
              </div>
            </div>

            <div className="card" style={{ background: "var(--bg-surface-elevated)", padding: "1.25rem" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Total Confirmed Value</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#38bdf8", marginTop: "0.25rem" }}>
                ₹{totalRevenue.toFixed(2)}
              </div>
            </div>

            <div className="card" style={{ background: "var(--bg-surface-elevated)", padding: "1.25rem" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Current Status</div>
              <div style={{ marginTop: "0.4rem" }}>
                <span className={`badge ${selectedLot.is_open ? 'badge-success' : 'badge-danger'}`}>
                  {selectedLot.is_open ? "OPEN" : "CLOSED"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search & Status Filters */}
        <div className="card-glass" style={{
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-lg)",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem"
        }}>
          {/* Status Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {["ALL", "CONFIRMED", "PENDING", "CANCELLED", "EXPIRED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem", borderRadius: "var(--radius-full)" }}
              >
                {status}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div className="input-icon-wrapper" style={{ minWidth: "240px" }}>
              <Search className="input-icon-left" size={16} />
              <input
                type="text"
                className="form-input"
                style={{ padding: "0.45rem 0.85rem 0.45rem 2.4rem", fontSize: "0.85rem" }}
                placeholder="Search driver name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => fetchBookings(selectedLotId)}
              className="btn btn-outline btn-sm"
              disabled={loadingBookings}
            >
              <RefreshCw size={14} className={loadingBookings ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Bookings Table View */}
        {loadingBookings ? (
          <LoadingSpinner text="Fetching bookings for this parking lot..." />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No bookings found"
            description={
              searchQuery
                ? "No reservations match your search query."
                : "No customer bookings have been made for this parking lot yet."
            }
          />
        ) : (
          <div className="card-glass" style={{
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid var(--border-subtle)",
            padding: 0
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "0.875rem"
              }}>
                <thead>
                  <tr style={{
                    background: "var(--bg-surface-elevated)",
                    borderBottom: "1px solid var(--border-medium)",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em"
                  }}>
                    <th style={{ padding: "1rem" }}>Booking ID</th>
                    <th style={{ padding: "1rem" }}>Driver Details</th>
                    <th style={{ padding: "1rem" }}>Schedule</th>
                    <th style={{ padding: "1rem" }}>Amount</th>
                    <th style={{ padding: "1rem" }}>Status</th>
                    <th style={{ padding: "1rem" }}>Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => {
                    const isConfirmed = b.status === "CONFIRMED"
                    const isPending = b.status === "PENDING"
                    const isCancelled = b.status === "CANCELLED"

                    return (
                      <tr
                        key={b.id}
                        style={{
                          borderBottom: "1px solid var(--border-subtle)",
                          transition: "background var(--transition-fast)"
                        }}
                      >
                        <td style={{ padding: "1rem", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)" }}>
                          #{b.id}
                        </td>

                        <td style={{ padding: "1rem" }}>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            {b.driver_name || "Driver"}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {b.driver_email}
                          </div>
                        </td>

                        <td style={{ padding: "1rem" }}>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                            <strong>In:</strong> {formatDateTime(b.start_time)}
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                            <strong>Out:</strong> {formatDateTime(b.end_time)}
                          </div>
                        </td>

                        <td style={{ padding: "1rem", fontWeight: 700, color: "#38bdf8", fontSize: "1rem" }}>
                          ₹{Number(b.amount)}
                        </td>

                        <td style={{ padding: "1rem" }}>
                          <span className={`badge ${
                            isConfirmed
                              ? "badge-success"
                              : isPending
                              ? "badge-warning"
                              : isCancelled
                              ? "badge-neutral"
                              : "badge-danger"
                          }`}>
                            {b.status}
                          </span>
                        </td>

                        <td style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                          {formatDateTime(b.created_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
