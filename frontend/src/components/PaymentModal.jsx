import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createPayment, confirmPaymentSuccess, loadRazorpayScript } from "../services/paymentService"
import { useToast } from "../context/ToastContext"
import { openGoogleMapsDirections } from "../utils/directions"
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Navigation, 
  Calendar, 
  Clock, 
  Loader2, 
  AlertCircle,
  ArrowRight
} from "lucide-react"
import { formatDisplayDateTime } from "../utils/dateUtils"

export default function PaymentModal({
  booking,
  parking,
  onClose,
  onPaymentSuccess
}) {
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY")
  const [loading, setLoading] = useState(false)
  const [confirmedData, setConfirmedData] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")

  if (!booking) return null

  const handlePayNow = async () => {
    setLoading(true)
    setErrorMsg("")

    try {
      // 1. Ensure Razorpay checkout script is loaded
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded && !window.Razorpay) {
        throw new Error("Unable to load Razorpay Checkout SDK. Please check your internet connection.")
      }

      // 2. Create Payment Order on Backend
      const paymentOrderData = await createPayment({
        booking_id: booking.id,
        payment_method: paymentMethod
      })

      const { payment, razorpay } = paymentOrderData

      if (!razorpay || !razorpay.order_id) {
        throw new Error("Invalid payment order response from server.")
      }

      const keyId = razorpay.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount: razorpay.amount,
        currency: razorpay.currency || "INR",
        name: "ParkKar Smart Parking",
        description: `Booking #${booking.id} - ${parking?.name || "Parking Spot"}`,
        order_id: razorpay.order_id,
        theme: {
          color: "#2563eb"
        },
        handler: async function (response) {
          try {
            setLoading(true)
            // 4. Verify signature with Backend
            const verificationPayload = {
              payment_id: payment.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }

            const successResult = await confirmPaymentSuccess(verificationPayload)
            success("Payment successful! Your parking is confirmed.")
            setConfirmedData(successResult)

            if (onPaymentSuccess) {
              onPaymentSuccess(successResult)
            }
          } catch (verifErr) {
            const msg = verifErr.response?.data?.message || "Payment verification failed"
            setErrorMsg(msg)
            toastError(msg)
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          }
        }
      }

      const razorpayInstance = new window.Razorpay(options)
      razorpayInstance.on("payment.failed", function (resp) {
        const failureReason = resp.error?.description || "Payment failed"
        setErrorMsg(failureReason)
        toastError(failureReason)
        setLoading(false)
      })

      razorpayInstance.open()
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to initiate payment."
      setErrorMsg(msg)
      toastError(msg)
      setLoading(false)
    }
  }

  // Format date time
  const formatDateTime = (dt) => {
    return formatDisplayDateTime(dt)
  }

  return (
    <div className="modal-backdrop" onClick={!confirmedData ? onClose : undefined}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
        {/* Confirmed Success State View */}
        {confirmedData ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid var(--success-border)",
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)"
            }}>
              <CheckCircle2 size={36} />
            </div>

            <span className="badge badge-success" style={{ marginBottom: "0.75rem" }}>
              Confirmed
            </span>

            <h2 style={{ fontSize: "1.8rem", color: "#ffffff", marginBottom: "0.5rem" }}>
              Parking Confirmed!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.75rem" }}>
              Your spot has been reserved and your pass is active.
            </p>

            {/* Receipt Summary Card */}
            <div style={{
              background: "var(--bg-surface-elevated)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
              padding: "1.25rem",
              textAlign: "left",
              marginBottom: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              fontSize: "0.9rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Booking ID:</span>
                <strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                  #{confirmedData.booking?.id || booking.id}
                </strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Parking Location:</span>
                <strong style={{ color: "var(--text-primary)" }}>{parking?.name || "Parking Lot"}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Start Time:</span>
                <span>{formatDateTime(booking.start_time)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>End Time:</span>
                <span>{formatDateTime(booking.end_time)}</span>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "0.6rem",
                borderTop: "1px solid var(--border-subtle)"
              }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Amount Paid:</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#34d399" }}>
                  ₹{confirmedData.payment?.amount || booking.amount}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {parking?.latitude && parking?.longitude && (
                <button
                  type="button"
                  onClick={() => openGoogleMapsDirections(parking.latitude, parking.longitude, null, null, parking.name)}
                  className="btn btn-success btn-lg"
                  style={{ gap: "0.5rem" }}
                >
                  <Navigation size={18} />
                  <span>Get Directions to Parking</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate("/my-bookings")
                }}
                className="btn btn-secondary"
              >
                <span>View My Bookings</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Payment Initiation View */
          <div>
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
                <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)" }}>Complete Payment</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Booking #{booking.id} · {parking?.name}
                </p>
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

            {/* Booking Summary Box */}
            <div style={{
              background: "var(--bg-surface-elevated)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
              padding: "1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              fontSize: "0.875rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>From:</span>
                <span>{formatDateTime(booking.start_time)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>To:</span>
                <span>{formatDateTime(booking.end_time)}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "0.6rem",
                borderTop: "1px solid var(--border-subtle)"
              }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Payable Amount:</span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38bdf8" }}>
                  ₹{Number(booking.amount)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="form-label" style={{ marginBottom: "0.6rem" }}>Payment Gateway</label>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.85rem 1rem",
                background: "rgba(37, 99, 235, 0.12)",
                border: "1px solid var(--primary-500)",
                borderRadius: "var(--radius-md)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CreditCard size={20} color="var(--primary-500)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>Razorpay Gateway</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Cards, UPI, Netbanking & Wallets</div>
                  </div>
                </div>
                <span className="badge badge-primary" style={{ fontSize: "0.65rem" }}>Encrypted</span>
              </div>
            </div>

            {/* Security Guarantee */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              marginBottom: "1.5rem"
            }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>256-bit SSL encrypted secure checkout via Razorpay</span>
            </div>

            {/* Actions */}
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
                type="button"
                onClick={handlePayNow}
                className="btn btn-primary"
                style={{ flex: 2, gap: "0.5rem" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{Number(booking.amount)}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
