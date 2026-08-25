import React, { useState, useEffect, useCallback } from "react"
import { getNearbyParking } from "../services/parkingService"
import ParkingCard from "../components/ParkingCard"
import ParkingMap from "../components/ParkingMap"
import BookingModal from "../components/BookingModal"
import PaymentModal from "../components/PaymentModal"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import { useToast } from "../context/ToastContext"
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  Filter, 
  LocateFixed, 
  RefreshCw, 
  Layers, 
  List, 
  SlidersHorizontal 
} from "lucide-react"

export default function FindParking() {
  const { error: toastError } = useToast()

  // Format local ISO datetime for input
  const formatLocalISO = (date) => {
    const offset = date.getTimezoneOffset() * 60000
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16)
    return localISOTime
  }

  const now = new Date()
  const defaultStart = new Date(now.getTime() + 10 * 60 * 1000)
  const defaultEnd = new Date(defaultStart.getTime() + 2 * 60 * 60 * 1000)

  // State
  const [startTime, setStartTime] = useState(formatLocalISO(defaultStart))
  const [endTime, setEndTime] = useState(formatLocalISO(defaultEnd))
  const [userLocation, setUserLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationStatus, setLocationStatus] = useState("detecting")

  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("distance") // "distance" | "price" | "slots"
  const [selectedParking, setSelectedParking] = useState(null)

  // Modals
  const [bookingLot, setBookingLot] = useState(null)
  const [paymentBooking, setPaymentBooking] = useState(null)
  const [paymentParking, setPaymentParking] = useState(null)

  // Mobile View Toggle ("list" vs "map")
  const [mobileView, setMobileView] = useState("list")

  // Geolocation detection
  const detectLocation = useCallback(() => {
    setLocating(true)
    if (!navigator.geolocation) {
      setUserLocation({ latitude: 12.9716, longitude: 77.5946 }) // Default Bangalore
      setLocationStatus("denied")
      setLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLocationStatus("granted")
        setLocating(false)
      },
      () => {
        // Fallback default coordinates if permission denied
        setUserLocation({ latitude: 12.9716, longitude: 77.5946 })
        setLocationStatus("denied")
        setLocating(false)
      },
      { timeout: 8000, enableHighAccuracy: true }
    )
  }, [])

  useEffect(() => {
    detectLocation()
  }, [detectLocation])

  // Fetch Nearby Parkings
  const fetchNearby = useCallback(async () => {
    if (!userLocation) return
    setLoading(true)

    try {
      const start = new Date(startTime)
      const end = new Date(endTime)

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        setLoading(false)
        return
      }

      const params = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        start_time: start.toISOString(),
        end_time: end.toISOString()
      }

      const data = await getNearbyParking(params)
      setParkings(data.parking || [])
    } catch (err) {
      console.error("Fetch Nearby Parking Error", err)
      const msg = err.response?.data?.message || "Failed to fetch nearby parking"
      toastError(msg)
      setParkings([])
    } finally {
      setLoading(false)
    }
  }, [userLocation, startTime, endTime, toastError])

  useEffect(() => {
    if (userLocation) {
      fetchNearby()
    }
  }, [userLocation, fetchNearby])

  // Filter and Sort parkings
  const filteredParkings = parkings
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return Number(a.price_per_hour) - Number(b.price_per_hour)
      }
      if (sortBy === "slots") {
        return Number(b.available_slots) - Number(a.available_slots)
      }
      return (a.distance || 0) - (b.distance || 0)
    })

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 1rem)", paddingBottom: "2rem" }}>
      <div className="container-fluid" style={{ maxWidth: "1600px" }}>
        {/* Search & Filter Header Bar */}
        <div className="card-glass" style={{
          padding: "1.25rem 1.5rem",
          borderRadius: "var(--radius-lg)",
          marginBottom: "1.5rem",
          border: "1px solid var(--border-subtle)"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            alignItems: "center"
          }}>
            {/* Search Input */}
            <div className="input-icon-wrapper">
              <Search className="input-icon-left" size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="Search by lot name or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Start Time */}
            <div className="input-icon-wrapper">
              <Clock className="input-icon-left" size={16} />
              <input
                type="datetime-local"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                title="Start Time"
              />
            </div>

            {/* End Time */}
            <div className="input-icon-wrapper">
              <Clock className="input-icon-left" size={16} />
              <input
                type="datetime-local"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                title="End Time"
              />
            </div>

            {/* Sort & Location Actions */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => {
                  const n = new Date()
                  const s = new Date(n.getTime() + 2 * 60 * 1000)
                  const e = new Date(s.getTime() + 2 * 60 * 60 * 1000)
                  setStartTime(formatLocalISO(s))
                  setEndTime(formatLocalISO(e))
                }}
                className="btn btn-sm btn-secondary"
                title="Reset time window to current time"
                style={{ fontSize: "0.75rem", padding: "0.55rem 0.75rem" }}
              >
                Now
              </button>

              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="distance">Sort: Nearest</option>
                <option value="price">Sort: Lowest Price</option>
                <option value="slots">Sort: Most Slots</option>
              </select>

              <button
                type="button"
                onClick={detectLocation}
                className="btn btn-outline btn-icon"
                disabled={locating}
                title="Refresh My GPS Location"
              >
                <LocateFixed size={18} color="var(--primary-500)" className={locating ? "animate-spin" : ""} />
              </button>

              <button
                type="button"
                onClick={fetchNearby}
                className="btn btn-primary btn-icon"
                disabled={loading}
                title="Update Radar Search"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="mobile-view-tabs" style={{
          display: "none",
          gap: "0.5rem",
          marginBottom: "1rem"
        }}>
          <button
            onClick={() => setMobileView("list")}
            className={`btn btn-sm ${mobileView === "list" ? "btn-primary" : "btn-secondary"}`}
            style={{ flex: 1, gap: "0.4rem" }}
          >
            <List size={16} />
            <span>List View ({filteredParkings.length})</span>
          </button>
          <button
            onClick={() => setMobileView("map")}
            className={`btn btn-sm ${mobileView === "map" ? "btn-primary" : "btn-secondary"}`}
            style={{ flex: 1, gap: "0.4rem" }}
          >
            <Layers size={16} />
            <span>Map View</span>
          </button>
        </div>

        {/* Main Split Layout: Left List, Right Map */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.25fr",
          gap: "1.5rem",
          minHeight: "calc(100vh - 240px)",
          alignItems: "stretch"
        }} className="find-split-layout">
          {/* Left Column: Parking Cards List */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxHeight: "calc(100vh - 240px)",
            overflowY: "auto",
            paddingRight: "0.5rem"
          }} className={`list-pane ${mobileView === "map" ? "mobile-hidden" : ""}`}>
            {/* Header info */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "0.5rem"
            }}>
              <div>
                <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)" }}>Available Parking Lots</h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {filteredParkings.length} locations available for selected timeframe
                </p>
              </div>
              <span className="badge badge-primary">
                {locationStatus === "granted" ? "GPS Active" : "City Center"}
              </span>
            </div>

            {loading ? (
              <LoadingSpinner text="Scanning nearby parking lots..." />
            ) : filteredParkings.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No parking lots available"
                description="No open parking lots with available slots match your selected time range or location."
                actionText="Adjust Time Window"
                onAction={() => {
                  setStartTime(formatLocalISO(new Date(Date.now() + 10 * 60 * 1000)))
                  setEndTime(formatLocalISO(new Date(Date.now() + 3 * 60 * 60 * 1000)))
                }}
              />
            ) : (
              filteredParkings.map((p) => (
                <ParkingCard
                  key={p.id}
                  parking={p}
                  userLocation={userLocation}
                  isSelected={selectedParking?.id === p.id}
                  onSelect={(lot) => setSelectedParking(lot)}
                  onBook={(lot) => setBookingLot(lot)}
                />
              ))
            )}
          </div>

          {/* Right Column: Google Maps / Radar */}
          <div style={{
            height: "100%",
            minHeight: "480px",
            position: "sticky",
            top: "calc(var(--navbar-height) + 1rem)"
          }} className={`map-pane ${mobileView === "list" ? "mobile-hidden" : ""}`}>
            <ParkingMap
              parkings={filteredParkings}
              userLocation={userLocation}
              selectedParking={selectedParking}
              onSelectParking={(lot) => setSelectedParking(lot)}
              onRecenter={detectLocation}
            />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingLot && (
        <BookingModal
          parking={bookingLot}
          initialStartTime={startTime}
          initialEndTime={endTime}
          onClose={() => setBookingLot(null)}
          onBookingSuccess={(createdBooking, lot) => {
            setBookingLot(null)
            setPaymentBooking(createdBooking)
            setPaymentParking(lot)
          }}
        />
      )}

      {/* Payment Modal */}
      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          parking={paymentParking}
          onClose={() => {
            setPaymentBooking(null)
            setPaymentParking(null)
          }}
          onPaymentSuccess={() => {
            fetchNearby()
          }}
        />
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 992px) {
          .find-split-layout {
            grid-templateColumns: 1fr !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .mobile-view-tabs {
            display: flex !important;
          }
          .mobile-hidden {
            display: none !important;
          }
          .list-pane {
            max-height: none !important;
            overflowY: visible !important;
          }
          .map-pane {
            position: static !important;
            height: 400px !important;
          }
        }
      `}</style>
    </div>
  )
}
