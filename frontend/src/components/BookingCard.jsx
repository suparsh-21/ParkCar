import React, { useState, useEffect } from "react"
import { openGoogleMapsDirections } from "../utils/directions"
import { cancelBooking } from "../services/bookingService"
import { useToast } from "../context/ToastContext"
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Navigation, 
  XCircle, 
  CreditCard, 
  AlertTriangle,
  Loader2,
  CheckCircle2
} from "lucide-react"

export default function BookingCard({
  booking,
  onBookingUpdated,
  onPayNow
}) {
  const { success, error: toastError } = useToast()
  const [cancelling, setCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

  if (!booking) return null

  // Countdown timer for PENDING booking payment deadline
  useEffect(() => {
    if (booking.status !== "PENDING" || !booking.payment_deadline) return

    const updateTimer = () => {
      const now = new Date().getTime()
      const deadline = new Date(booking.payment_deadline).getTime()
      const diff = deadline - now

      if (diff <= 0) {
        setTimeLeft("Expired")
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const secs = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${mins}m ${secs < 10 ? "0" : ""}${secs}s`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [booking.status, booking.payment_deadline])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const data = await cancelBooking(booking.id)
      success(data.message || "Booking cancelled successfully")
      setShowCancelModal(false)
      if (onBookingUpdated) onBookingUpdated()
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to cancel booking"
      toastError(msg)
    } finally {
      setCancelling(false)
    }
  }

  const formatDateTime = (dt) => {
    if (!dt) return ""
    return new Date(dt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    })
  }

  const isConfirmed = booking.status === "CONFIRMED"
  const isPending = booking.status === "PENDING"
  const isExpired = booking.status === "EXPIRED"
  const isCancelled = booking.status === "CANCELLED"
  const isCancellable = isConfirmed && new Date(booking.end_time) > new Date()

  return (
    <>
      <div className="card card-glass" style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        border: isConfirmed ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid var(--border-subtle)",
        position: "relative"
      }}>
        {/* Header: Parking name + Status Badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)" }}>
                {booking.parking_name || `Parking Lot #${booking.parking_lot_id}`}
              </h3>
            </div>
            {booking.address && (
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <MapPin size={14} color="var(--primary-500)" />
                <span>{booking.address}</span>
              </p>
            )}
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <span
              className={`badge ${
                isConfirmed
                  ? "badge-success"
                  : isPending
                  ? "badge-warning"
                  : isCancelled
                  ? "badge-neutral"
                  : "badge-danger"
              }`}
            >
              {booking.status}
            </span>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", fontFamily: "var(--font-mono)" }}>
              #{booking.id}
            </div>
          </div>
        </div>

        {/* Booking Details Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem",
          background: "var(--bg-surface-elevated)",
          padding: "1rem",
          borderRadius: "var(--radius-md)",
          fontSize: "0.85rem"
        }}>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Clock size={12} />
              <span>Start Time</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatDateTime(booking.start_time)}</strong>
          </div>

          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Clock size={12} />
              <span>End Time</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatDateTime(booking.end_time)}</strong>
          </div>

          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Amount</div>
            <strong style={{ color: "#38bdf8", fontSize: "1rem" }}>₹{Number(booking.amount)}</strong>
          </div>
        </div>

        {/* Pending payment notice */}
        {isPending && timeLeft && (
          <div style={{
            background: "var(--warning-bg)",
            border: "1px solid var(--warning-border)",
            borderRadius: "var(--radius-md)",
            padding: "0.6rem 0.85rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.825rem",
            color: "#fbbf24"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={14} />
              <span>Payment Deadline: <strong>{timeLeft}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => onPayNow && onPayNow(booking)}
              className="btn btn-sm btn-primary"
              style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem" }}
            >
              Pay Now
            </button>
          </div>
        )}

        {/* Actions Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          paddingTop: "0.5rem",
          borderTop: "1px solid var(--border-subtle)"
        }}>
          {isConfirmed && booking.address && (
            <button
              type="button"
              onClick={() => openGoogleMapsDirections(null, null, null, null, booking.address)}
              className="btn btn-sm btn-success"
              style={{ gap: "0.4rem" }}
            >
              <Navigation size={14} />
              <span>Get Directions</span>
            </button>
          )}

          {isPending && (
            <button
              type="button"
              onClick={() => onPayNow && onPayNow(booking)}
              className="btn btn-sm btn-primary"
              style={{ gap: "0.4rem" }}
            >
              <CreditCard size={14} />
              <span>Complete Payment</span>
            </button>
          )}

          {isCancellable && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="btn btn-sm btn-danger"
              style={{ marginLeft: "auto", gap: "0.35rem" }}
            >
              <XCircle size={14} />
              <span>Cancel Booking</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Cancellation */}
      {showCancelModal && (
        <div className="modal-backdrop" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px", textAlign: "center" }}>
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

            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Cancel Booking?</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Are you sure you want to cancel your reservation for <strong>{booking.parking_name}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={cancelling}
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-danger"
                style={{ flex: 1, gap: "0.4rem" }}
                disabled={cancelling}
              >
                {cancelling ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                <span>Confirm Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
