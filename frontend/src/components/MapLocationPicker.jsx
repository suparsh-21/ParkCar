import React, { useEffect, useRef, useState } from "react"
import { MapPin, LocateFixed, Navigation, Check } from "lucide-react"

export default function MapLocationPicker({
  latitude,
  longitude,
  onChange,
  height = "320px"
}) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [locating, setLocating] = useState(false)

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  // Load Google Maps API
  useEffect(() => {
    if (!apiKey) return

    if (window.google && window.google.maps) {
      setMapLoaded(true)
      return
    }

    const scriptId = "google-maps-script"
    if (document.getElementById(scriptId)) {
      setMapLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.id = scriptId
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => setMapLoaded(true)
    document.head.appendChild(script)
  }, [apiKey])

  // Initialize Map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return

    const initialLat = Number(latitude) || 12.9716
    const initialLng = Number(longitude) || 77.5946

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: initialLat, lng: initialLng },
      zoom: 14,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#111827" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#111827" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#1f293d" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#090d16" }] }
      ],
      disableDefaultUI: true,
      zoomControl: true
    })

    const marker = new window.google.maps.Marker({
      position: { lat: initialLat, lng: initialLng },
      map: map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      title: "Parking Location"
    })

    map.addListener("click", (e) => {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      marker.setPosition({ lat, lng })
      onChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)))
    })

    marker.addListener("dragend", (e) => {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      onChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)))
    })

    mapInstanceRef.current = map
    markerRef.current = marker
  }, [mapLoaded])

  // Update marker position when props change externally
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      const lat = Number(latitude)
      const lng = Number(longitude)
      if (!isNaN(lat) && !isNaN(lng)) {
        markerRef.current.setPosition({ lat, lng })
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo({ lat, lng })
        }
      }
    }
  }, [latitude, longitude])

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6))
        const lng = Number(pos.coords.longitude.toFixed(6))
        onChange(lat, lng)
        setLocating(false)
      },
      () => {
        setLocating(false)
      }
    )
  }

  return (
    <div style={{
      background: "var(--bg-surface-elevated)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          <MapPin size={15} color="var(--primary-500)" />
          <span>Click map or drag pin to position parking</span>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="btn btn-sm btn-outline"
          disabled={locating}
          style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", gap: "0.3rem" }}
        >
          <LocateFixed size={13} color="var(--accent-cyan)" />
          <span>{locating ? "Locating..." : "Use My GPS"}</span>
        </button>
      </div>

      {apiKey ? (
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--border-medium)"
          }}
        />
      ) : (
        <div style={{
          height: "140px",
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--border-medium)",
          background: "rgba(15, 23, 42, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          textAlign: "center"
        }}>
          <MapPin size={24} color="var(--primary-500)" style={{ marginBottom: "0.5rem" }} />
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            Click "Use My GPS" above or enter coordinates manually below.
          </p>
        </div>
      )}

      {/* Coordinate Display */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        padding: "0.5rem 0.75rem",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-md)",
        fontSize: "0.85rem"
      }}>
        <div>
          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Latitude: </span>
          <strong style={{ color: "var(--text-primary)" }}>{latitude || "Not set"}</strong>
        </div>
        <div>
          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Longitude: </span>
          <strong style={{ color: "var(--text-primary)" }}>{longitude || "Not set"}</strong>
        </div>
      </div>
    </div>
  )
}
