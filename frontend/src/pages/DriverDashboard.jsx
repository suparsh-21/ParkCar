import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getMyBookings } from "../services/bookingService"
import { openGoogleMapsDirections } from "../utils/directions"
import BookingCard from "../components/BookingCard"
import PaymentModal from "../components/PaymentModal"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import { 
  Car, 
  MapPin, 
  Clock, 
  Calendar, 
  Navigation, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard,
  Search,
  CheckCircle2
} from "lucide-react"
import { formatDisplayTime } from "../utils/dateUtils"

export default function DriverDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePaymentBooking, setActivePaymentBooking] = useState(null)

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings()
      setBookings(data.bookings || [])
    } catch (err) {
      console.error("Failed to load driver bookings", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  // Active / Upcoming Confirmed Booking
  const activeBooking = bookings.find(
    (b) => b.status === "CONFIRMED" && new Date(b.end_time) > new Date()
  )

  const pendingBookingsCount = bookings.filter((b) => b.status === "PENDING").length
  const confirmedBookingsCount = bookings.filter((b) => b.status === "CONFIRMED").length

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 1.5rem)", paddingBottom: "4rem" }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--primary-500)", fontWeight: 600 }}>
                {getGreeting()},
              </span>
              <span className="badge badge-primary">Driver Portal</span>
            </div>
            <h1 style={{ fontSize: "2.2rem", margin: 0 }}>
              {user?.name || "Driver"}
            </h1>
          </div>

          <Link to="/find-parking" className="btn btn-primary btn-lg" style={{ gap: "0.5rem" }}>
            <Search size={18} />
            <span>Find Nearby Parking</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Active Booking Banner if present */}
        {activeBooking && (
          <div className="card-glass" style={{
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(15, 23, 42, 0.9))",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            borderRadius: "var(--radius-xl)",
            padding: "1.75rem",
            marginBottom: "2.5rem",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1.25rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span className="status-dot online animate-pulse" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#34d399", textTransform: "uppercase" }}>
                    Active Parking Pass
                  </span>
                </div>
                <h3 style={{ fontSize: "1.4rem", color: "#ffffff", marginBottom: "0.25rem" }}>
                  {activeBooking.parking_name}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <MapPin size={15} color="var(--primary-500)" />
                  <span>{activeBooking.address}</span>
                </p>
                <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Valid until: <strong style={{ color: "var(--text-primary)" }}>{formatDisplayTime(activeBooking.end_time)}</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                {(activeBooking.address || activeBooking.parking_name) && (
                  <button
                    onClick={() => openGoogleMapsDirections(
                      activeBooking.latitude,
                      activeBooking.longitude,
                      null,
                      null,
                      [activeBooking.parking_name, activeBooking.address].filter(Boolean).join(", ")
                    )}
                    className="btn btn-success btn-lg"
                    style={{ gap: "0.5rem" }}
                  >
                    <Navigation size={18} />
                    <span>Get Directions</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Summary Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem"
        }}>
          <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Active Pass</span>
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
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffffff" }}>
              {activeBooking ? "1 Active" : "0 Active"}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {activeBooking ? activeBooking.parking_name : "No live reservation"}
            </div>
          </div>

          <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Total Bookings</span>
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
                <Calendar size={18} />
              </div>
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffffff" }}>
              {bookings.length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {confirmedBookingsCount} confirmed · {pendingBookingsCount} pending
            </div>
          </div>

          <div className="card" style={{ background: "var(--bg-surface-elevated)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Nearby Discovery</span>
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
                <MapPin size={18} />
              </div>
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#38bdf8" }}>
              Live GPS
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Real-time slot availability
            </div>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div style={{ marginTop: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", color: "var(--text-primary)" }}>Recent Bookings</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Your recent parking reservation history</p>
            </div>
            <Link to="/my-bookings" className="btn btn-sm btn-outline" style={{ gap: "0.3rem" }}>
              <span>View All Bookings</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching your bookings..." />
          ) : bookings.length === 0 ? (
            <EmptyState
              title="No bookings yet"
              description="Discover nearby parking lots, reserve your spot in advance, and get direct turn-by-turn navigation."
              actionText="Find Parking Now"
              onAction={() => navigate("/find-parking")}
            />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
              {bookings.slice(0, 4).map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onBookingUpdated={fetchBookings}
                  onPayNow={(booking) => setActivePaymentBooking(booking)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal if Pay Now clicked on pending booking */}
      {activePaymentBooking && (
        <PaymentModal
          booking={activePaymentBooking}
          parking={{ name: activePaymentBooking.parking_name, address: activePaymentBooking.address }}
          onClose={() => setActivePaymentBooking(null)}
          onPaymentSuccess={() => {
            fetchBookings()
          }}
        />
      )}
    </div>
  )
}