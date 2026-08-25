/**
 * Open Google Maps Navigation/Directions in a new tab.
 * Uses origin coordinates when available, otherwise destination coordinates.
 */
export function openGoogleMapsDirections(destLat, destLng, originLat, originLng, title = "Parking Location") {
  if (!destLat || !destLng) {
    console.error("Destination coordinates missing for directions")
    return
  }

  let url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`

  if (originLat && originLng) {
    url += `&origin=${originLat},${originLng}`
  }

  window.open(url, "_blank", "noopener,noreferrer")
}

/**
 * Calculate distance between two coordinates in km using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(2))
}
