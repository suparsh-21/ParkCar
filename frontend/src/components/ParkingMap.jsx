import React, { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, LocateFixed, ExternalLink, AlertTriangle, Layers } from "lucide-react"
import { openGoogleMapsDirections } from "../utils/directions"

// Sleek dark theme styling for Google Maps
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#111827" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#111827" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#cbd5e1" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1f293d" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0f172a" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2563eb" }, { lightness: -30 }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#090d16" }]
  }
]

export default function ParkingMap({
  parkings = [],
  userLocation,
  selectedParking,
  onSelectParking,
  onRecenter
}) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const userMarkerRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  // Load Google Maps JS API
  useEffect(() => {
    if (!apiKey) {
      setMapError(true)
      return
    }

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
    script.onerror = () => setMapError(true)
    document.head.appendChild(script)
  }, [apiKey])

  // Initialize Map Instance
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return

    const defaultCenter = userLocation
      ? { lat: Number(userLocation.latitude), lng: Number(userLocation.longitude) }
      : parkings.length > 0
      ? { lat: Number(parkings[0].latitude), lng: Number(parkings[0].longitude) }
      : { lat: 12.9716, lng: 77.5946 } // Default (e.g. Bangalore center)

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 14,
      styles: darkMapStyle,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    })

    mapInstanceRef.current = map
  }, [mapLoaded])

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return
    const map = mapInstanceRef.current

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    // User Location Marker
    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null)
      }

      const userLatLng = {
        lat: Number(userLocation.latitude),
        lng: Number(userLocation.longitude)
      }

      userMarkerRef.current = new window.google.maps.Marker({
        position: userLatLng,
        map: map,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2
        }
      })
    }

    // Parking Markers
    parkings.forEach((p) => {
      if (!p.latitude || !p.longitude) return

      const isSelected = selectedParking && selectedParking.id === p.id
      const isOpen = p.is_open && p.available_slots > 0

      const marker = new window.google.maps.Marker({
        position: { lat: Number(p.latitude), lng: Number(p.longitude) },
        map: map,
        title: p.name,
        label: {
          text: `₹${Number(p.price_per_hour)}`,
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: "bold"
        },
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: isSelected ? "#3b82f6" : isOpen ? "#10b981" : "#ef4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: isSelected ? 2 : 1,
          scale: isSelected ? 1.8 : 1.4,
          anchor: new window.google.maps.Point(12, 22),
          labelOrigin: new window.google.maps.Point(12, 8)
        }
      })

      marker.addListener("click", () => {
        if (onSelectParking) onSelectParking(p)
      })

      markersRef.current.push(marker)
    })
  }, [mapLoaded, parkings, userLocation, selectedParking, onSelectParking])

  // Center on selected parking when clicked
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedParking) return
    const lat = Number(selectedParking.latitude)
    const lng = Number(selectedParking.longitude)
    if (!isNaN(lat) && !isNaN(lng)) {
      mapInstanceRef.current.panTo({ lat, lng })
      mapInstanceRef.current.setZoom(15)
    }
  }, [selectedParking])

  const handleCenterUser = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.panTo({
        lat: Number(userLocation.latitude),
        lng: Number(userLocation.longitude)
      })
      mapInstanceRef.current.setZoom(14)
    }
    if (onRecenter) onRecenter()
  }

  // If Google Maps API key is missing or failed to load, display fallback radar
  if (mapError || !apiKey) {
    return (
      <div className="card-glass" style={{
        height: "100%",
        minHeight: "450px",
        borderRadius: "var(--radius-xl)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Radar Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "1rem",
          zIndex: 2
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Layers size={18} color="var(--primary-500)" />
            <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Parking Radar View</span>
          </div>
          <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>
            {parkings.length} spots plotted
          </span>
        </div>

        {/* Fallback visual canvas */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "1.5rem 0",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)",
          borderRadius: "var(--radius-lg)",
          border: "1px dashed var(--border-medium)",
          padding: "1.5rem",
          textAlign: "center",
          position: "relative"
        }}>
          {/* Animated concentric radar circles */}
          <div style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "50%",
            pointerEvents: "none"
          }} />
          <div style={{
            position: "absolute",
            width: "140px",
            height: "140px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "50%",
            pointerEvents: "none"
          }} />

          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary-600), var(--accent-cyan))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            marginBottom: "1rem",
            boxShadow: "0 0 20px var(--primary-glow)",
            zIndex: 1
          }}>
            <MapPin size={24} />
          </div>

          <h4 style={{ fontSize: "1.1rem", marginBottom: "0.4rem", zIndex: 1 }}>
            {userLocation ? "Location Tracking Active" : "Searching Nearby Lots"}
          </h4>
          <p style={{ maxWidth: "360px", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem", zIndex: 1 }}>
            {userLocation
              ? `GPS Coordinates: ${Number(userLocation.latitude).toFixed(4)}, ${Number(userLocation.longitude).toFixed(4)}`
              : "Enable browser geolocation to calculate live distances to nearby parking lots."}
          </p>

          {/* Quick list of mapped lots */}
          <div style={{
            width: "100%",
            maxHeight: "180px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            zIndex: 1,
            textAlign: "left"
          }}>
            {parkings.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectParking && onSelectParking(p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.6rem 0.85rem",
                  background: selectedParking?.id === p.id ? "rgba(37, 99, 235, 0.2)" : "rgba(15, 23, 42, 0.7)",
                  border: `1px solid ${selectedParking?.id === p.id ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{p.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.distance ? `${p.distance} km away · ` : ""}{p.available_slots} spots</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    openGoogleMapsDirections(p.latitude, p.longitude, userLocation?.latitude, userLocation?.longitude, p.name)
                  }}
                  className="btn btn-sm btn-outline"
                  style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem", gap: "0.3rem" }}
                  title="Open directly in Google Maps"
                >
                  <Navigation size={12} color="var(--accent-cyan)" />
                  <span>Maps</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border-subtle)"
        }}>
          <span>1-Click Google Navigation supported</span>
          {userLocation && (
            <button
              onClick={handleCenterUser}
              className="btn btn-sm btn-outline"
              style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem", gap: "0.3rem" }}
            >
              <LocateFixed size={13} />
              <span>Current GPS</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: "450px",
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      border: "1px solid var(--border-medium)"
    }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: "450px" }} />

      {/* Recenter Button Overlay */}
      {userLocation && (
        <button
          onClick={handleCenterUser}
          className="btn btn-secondary btn-sm"
          style={{
            position: "absolute",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 10,
            boxShadow: "var(--shadow-lg)",
            backdropFilter: "blur(8px)",
            gap: "0.4rem"
          }}
          title="Center on my location"
        >
          <LocateFixed size={16} color="var(--primary-500)" />
          <span>My Location</span>
        </button>
      )}
    </div>
  )
}
