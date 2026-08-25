import React, { useState } from "react"
import { createBooking } from "../services/bookingService"
import { useToast } from "../context/ToastContext"
import { X, Calendar, Clock, IndianRupee, Loader2, ArrowRight, AlertCircle, Info } from "lucide-react"
import { formatLocalInputDate, formatLocalBackendDate } from "../utils/dateUtils"

export default function BookingModal({
  parking,
  initialStartTime,
  initialEndTime,
  onClose,
  onBookingSuccess
}) {
  const { success, error: toastError } = useToast()

  // Calculate a fresh, valid start time (at least 2 mins ahead of now so backend never flags past-time)
  const getFreshStartTime = () => {
    const now = new Date()
    if (initialStartTime) {
      const parsedInitial = new Date(initialStartTime)
      // If initialStartTime is in the past, use now + 2 mins
      if (parsedInitial.getTime() > now.getTime() + 60 * 1000) {
        return parsedInitial
      }
    }
    return new Date(now.getTime() + 2 * 60 * 1000)
  }

  const defaultStart = getFreshStartTime()
  const defaultEnd = initialEndTime && new Date(initialEndTime) > defaultStart
    ? new Date(initialEndTime)
    : new Date(defaultStart.getTime() + 2 * 60 * 60 * 1000)

  const [startTime, setStartTime] = useState(formatLocalInputDate(defaultStart))
  const [endTime, setEndTime] = useState(formatLocalInputDate(defaultEnd))
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!parking) return null

  // Quick preset helper to set duration from start
  const setDurationHours = (hours) => {
    const s = new Date(startTime)
    const baseStart = isNaN(s.getTime()) || s < new Date() ? new Date(Date.now() + 2 * 60 * 1000) : s
    setStartTime(formatLocalInputDate(baseStart))
    const newEnd = new Date(baseStart.getTime() + hours * 60 * 60 * 1000)
    setEndTime(formatLocalInputDate(newEnd))
  }

  // Set Start Time to Right Now
  const setTimeToNow = () => {
    const nowPlusTwoMins = new Date(Date.now() + 2 * 60 * 1000)
    const endPlusTwoHours = new Date(nowPlusTwoMins.getTime() + 2 * 60 * 60 * 1000)
    setStartTime(formatLocalInputDate(nowPlusTwoMins))
    setEndTime(formatLocalInputDate(endPlusTwoHours))
  }

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

    // Backend requires start >= new Date(). Ensure start is at least current time with small buffer
    let validStart = start
    const now = new Date()
    if (validStart.getTime() <= now.getTime()) {
      validStart = new Date(now.getTime() + 60 * 1000) // 1 minute in future
    }

    setLoading(true)

    try {
      const payload = {
        parking_lot_id: parking.id,
        start_time: formatLocalBackendDate(validStart),
        end_time: formatLocalBackendDate(end)
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

        {/* Quick presets */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          background: "var(--bg-surface-elevated)",
          padding: "0.6rem 0.85rem",
          borderRadius: "var(--radius-md)"
        }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Quick Presets:</span>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={setTimeToNow}
              className="btn btn-sm btn-outline"
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
            >
              Start Now
            </button>
            <button
              type="button"
              onClick={() => setDurationHours(1)}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
            >
              1 hr
            </button>
            <button
              type="button"
              onClick={() => setDurationHours(2)}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
            >
              2 hrs
            </button>
            <button
              type="button"
              onClick={() => setDurationHours(4)}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
            >
              4 hrs
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Time Picker Inputs */}
          <div className="form-group">
            <label className="form-label" htmlFor="startTime">
              <span>Start Time</span>
              <button
                type="button"
                onClick={setTimeToNow}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--primary-500)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Use Current Time
              </button>
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
