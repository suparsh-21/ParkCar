import React, { useState, useEffect } from "react"
import { getMyBookings } from "../services/bookingService"
import BookingCard from "../components/BookingCard"
import PaymentModal from "../components/PaymentModal"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import { useNavigate } from "react-router-dom"
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Filter, 
  RefreshCw,
  AlertTriangle
} from "lucide-react"

export default function MyBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("ALL") // "ALL" | "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED" | "EXPIRED"
  const [searchQuery, setSearchQuery] = useState("")

  // Payment Modal state
  const [activePaymentBooking, setActivePaymentBooking] = useState(null)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const data = await getMyBookings()
      setBookings(data.bookings || [])
    } catch (err) {
      console.error("Failed to load bookings", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeTab === "ALL" || b.status === activeTab
    const matchesSearch =
      (b.parking_name && b.parking_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.address && b.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.id.toString().includes(searchQuery)
    return matchesTab && matchesSearch
  })

  const getTabCount = (status) => {
    if (status === "ALL") return bookings.length
    return bookings.filter((b) => b.status === status).length
  }

  const TABS = [
    { id: "ALL", label: "All Bookings" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "PENDING", label: "Pending Payment" },
    { id: "COMPLETED", label: "Completed" },
    { id: "CANCELLED", label: "Cancelled" },
    { id: "EXPIRED", label: "Expired" }
  ]

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 1.5rem)", paddingBottom: "4rem" }}>
      <div className="container">
        {/* Page Header */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div>
            <h1 style={{ fontSize: "2.2rem", marginBottom: "0.25rem" }}>My Bookings</h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
              Manage your active reservations, payment deadlines & navigation passes
            </p>
          </div>

          <button
            onClick={fetchBookings}
            className="btn btn-outline btn-sm"
            disabled={loading}
            style={{ gap: "0.4rem" }}
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="card-glass" style={{
          padding: "1.25rem",
          borderRadius: "var(--radius-lg)",
          marginBottom: "2rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem"
        }}>
          {/* Status Tabs */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem"
          }}>
            {TABS.map((tab) => {
              const count = getTabCount(tab.id)
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    fontSize: "0.85rem",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "var(--radius-full)",
                    gap: "0.4rem"
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    background: isActive ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.08)",
                    padding: "0.1rem 0.45rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.75rem",
                    fontWeight: 700
                  }}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="input-icon-wrapper" style={{ minWidth: "260px" }}>
            <Search className="input-icon-left" size={16} />
            <input
              type="text"
              className="form-input"
              style={{ padding: "0.5rem 1rem 0.5rem 2.5rem", fontSize: "0.85rem" }}
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <LoadingSpinner fullPage={false} text="Loading your reservations..." />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={activeTab === "ALL" ? "No bookings found" : `No ${activeTab.toLowerCase()} bookings`}
            description={
              activeTab === "ALL"
                ? "You haven't made any parking reservations yet. Find nearby spots and reserve your space."
                : `You don't have any bookings matching status "${activeTab}".`
            }
            actionText={activeTab === "ALL" ? "Find Parking Now" : undefined}
            onAction={activeTab === "ALL" ? () => navigate("/find-parking") : undefined}
          />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "1.5rem"
          }}>
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onBookingUpdated={fetchBookings}
                onPayNow={(b) => setActivePaymentBooking(b)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal if completing payment on a pending booking */}
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
