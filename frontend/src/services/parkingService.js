import api from "./api"

/**
 * Fetch nearby parking lots filtered by coordinates and start/end time.
 * Query params: latitude, longitude, start_time, end_time
 */
export async function getNearbyParking({ latitude, longitude, start_time, end_time }) {
  const response = await api.get("/parking/nearby", {
    params: {
      latitude,
      longitude,
      start_time,
      end_time
    }
  })
  return response.data
}

/**
 * Fetch parking lots belonging to the authenticated owner.
 */
export async function getMyParkings() {
  const response = await api.get("/parking/my")
  return response.data
}

/**
 * Create a new parking lot (Owner role required).
 * Body: { name, address, latitude, longitude, total_slots, price_per_hour }
 */
export async function createParking(parkingData) {
  const response = await api.post("/parking", parkingData)
  return response.data
}

/**
 * Update an existing parking lot.
 * Body: { name, address, total_slots, price_per_hour }
 */
export async function updateParking(parkingId, parkingData) {
  const response = await api.patch(`/parking/${parkingId}`, parkingData)
  return response.data
}

/**
 * Toggle open/close status of a parking lot.
 */
export async function toggleParking(parkingId) {
  const response = await api.patch(`/parking/${parkingId}/toggle`)
  return response.data
}

/**
 * Delete a parking lot by ID.
 */
export async function deleteParking(parkingId) {
  const response = await api.delete(`/parking/${parkingId}`)
  return response.data
}
