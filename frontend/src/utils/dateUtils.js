/**
 * Date and Time Utilities for ParkKar
 * Handles local timezone formatting and display accurately without UTC drift
 */

// Formats a Date object to YYYY-MM-DDTHH:mm for datetime-local input fields
export function formatLocalInputDate(date = new Date()) {
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, "0")
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Formats a Date object to YYYY-MM-DDTHH:mm:ss for backend API payload (local time)
export function formatLocalBackendDate(date) {
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, "0")
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  const seconds = pad(d.getSeconds())
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

// Formats backend timestamp to human-friendly local string (e.g. "25 Aug 2026, 6:38 pm")
export function formatDisplayDateTime(dt) {
  if (!dt) return ""
  
  // If dt is a string from Postgres without Z (naive timestamp), normalize it
  let dateObj = typeof dt === "string" ? new Date(dt) : dt
  
  if (isNaN(dateObj.getTime())) {
    // Try replacing space with T if needed
    dateObj = new Date(String(dt).replace(" ", "T"))
  }

  if (isNaN(dateObj.getTime())) return String(dt)

  return dateObj.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })
}

// Formats time only (e.g. "6:38 pm")
export function formatDisplayTime(dt) {
  if (!dt) return ""
  const dateObj = new Date(dt)
  if (isNaN(dateObj.getTime())) return ""
  return dateObj.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })
}
