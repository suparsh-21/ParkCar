import React, { useState } from "react"
import { createBooking } from "../services/bookingService"
import { useToast } from "../context/ToastContext"
import { X, Calendar, Clock, DollarSign, Loader2, ArrowRight, AlertCircle, Info } from "lucide-react"

export default function BookingModal({
  parking,
  initialStartTime,
  initialEndTime,
  onClose,
  onBookingSuccess
}) {
  const { success, error: toastError } = useToast()

  // Format local ISO string for datetime-local input
  const formatLocalISO = (date) => {
    const offset = date.getTimezoneOffset() * 60000
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16)
    return localISOTime
  }

  // Default start time: 10 minutes in future, End time: 2 hours later
  const defaultStart = initialStartTime ? new Date(initialStartTime) : new Date(Date.now() + 10 * 60 * 1000)
  const defaultEnd = initialEndTime ? new Date(initialEndTime) : new Date(defaultStart.getTime() + 2 * 60 * 60 * 1000)

  const [startTime, setStartTime] = useState(formatLocalISO(defaultStart))
  const [endTime, setEndTime] = useState(formatLocalISO(defaultEnd))
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!parking) return null

  // Calculate duration & price
  const start = new Date(startTime)
  const end = new Date(endTime)
  const durationHours = end > start ? (end - start) / (1000 * 60 * 60) : 0
  const estimatedAmount = durationHours > 0 ? (durationHours * Number(parking.price_per_hour)).toFixed(2) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setErrorMsg("Please select valid start and end times")
      return
    }

    if (end <= start) {
      setErrorMsg("End time must be after start time")
      return
    }

    if (start < new Date()) {
      setErrorMsg("Start time cannot be in the past")
      return
    }

    setLoading(true)

    try {
      const payload = {
        parking_lot_id: parking.id,
        start_time: start.toISOString(),
        end_time: end.toISOString()
      }

      const data = await createBooking(payload)
      success(data.message || "Booking created! Proceed to payment.")

      if (onBookingSuccess) {
        onBookingSuccess(data.booking, parking)
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create booking. Please try again."
      setErrorMsg(msg)
      toastError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--border-subtle)"
        }}>
          <div>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)" }}>Reserve Parking</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{parking.name}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "0.4rem"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            color: "#fca5a5",
            fontSize: "0.85rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Time Picker Inputs */}
          <div className="form-group">
            <label className="form-label" htmlFor="startTime">
              <span>Start Time</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>When will you arrive?</span>
            </label>
            <div className="input-icon-wrapper">
              <Clock className="input-icon-left" size={18} />
              <input
                id="startTime"
                type="datetime-local"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label className="form-label" htmlFor="endTime">
              <span>End Time</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>When will you leave?</span>
            </label>
            <div className="input-icon-wrapper">
              <Clock className="input-icon-left" size={18} />
              <input
                id="endTime"
                type="datetime-local"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Pricing & Summary Card */}
          <div style={{
            background: "var(--bg-surface-elevated)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            padding: "1.25rem",
            marginBottom: "1.5rem"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.9rem",
              marginBottom: "0.5rem"
            }}>
              <span style={{ color: "var(--text-secondary)" }}>Hourly Rate:</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>₹{Number(parking.price_per_hour)}/hr</span>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.9rem",
              marginBottom: "0.75rem"
            }}>
              <span style={{ color: "var(--text-secondary)" }}>Duration:</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                {durationHours > 0 ? `${durationHours.toFixed(1)} hrs` : "Invalid time range"}
              </span>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "0.75rem",
              borderTop: "1px solid var(--border-subtle)"
            }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Estimated Total:</span>
              <span style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#38bdf8",
                fontFamily: "var(--font-heading)"
              }}>
                ₹{estimatedAmount}
              </span>
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            marginBottom: "1.5rem"
          }}>
            <Info size={15} color="var(--primary-500)" />
            <span>Spot is held for 10 minutes upon reservation for payment confirmation.</span>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2 }}
              disabled={loading || durationHours <= 0}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Reserving Slot...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
