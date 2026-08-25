import api from "./api"

/**
 * Create a new parking booking.
 * Body: { parking_lot_id, start_time, end_time }
 */
export async function createBooking({ parking_lot_id, start_time, end_time }) {
  const response = await api.post("/booking", {
    parking_lot_id,
    start_time,
    end_time
  })
  return response.data
}

/**
 * Fetch all bookings of the currently logged in driver.
 * Note: Backend uses POST /booking/my
 */
export async function getMyBookings() {
  const response = await api.post("/booking/my")
  return response.data
}

/**
 * Cancel a confirmed booking before its end time.
 * Route: PATCH /booking/:booking_id/cancel
 */
export async function cancelBooking(bookingId) {
  const response = await api.patch(`/booking/${bookingId}/cancel`)
  return response.data
}

/**
 * Fetch bookings for a specific parking lot (Owner role required).
 * Route: GET /booking/parking/:parking_id
 */
export async function getParkingBookings(parkingId) {
  const response = await api.get(`/booking/parking/${parkingId}`)
  return response.data
}
