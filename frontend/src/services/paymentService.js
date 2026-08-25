import api from "./api"

/**
 * Create a payment order via backend and Razorpay.
 * Body: { booking_id, payment_method }
 */
export async function createPayment({ booking_id, payment_method = "RAZORPAY" }) {
  const response = await api.post("/payment", {
    booking_id,
    payment_method
  })
  return response.data
}

/**
 * Confirm successful Razorpay payment signature with backend.
 * Body: { payment_id, razorpay_payment_id, razorpay_order_id, razorpay_signature }
 */
export async function confirmPaymentSuccess({
  payment_id,
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature
}) {
  const response = await api.post("/payment/success", {
    payment_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  })
  return response.data
}

/**
 * Utility to dynamically load the Razorpay checkout script if not already present in window.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}
