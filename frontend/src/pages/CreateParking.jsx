import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { createParking } from "../services/parkingService"
import MapLocationPicker from "../components/MapLocationPicker"
import { useToast } from "../context/ToastContext"
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Layers, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react"

export default function CreateParking() {
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: 12.9716,
    longitude: 77.5946,
    total_slots: "",
    price_per_hour: ""
  })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (errorMsg) setErrorMsg("")
  }

  const handleCoordinatesChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    if (!formData.name || !formData.address || !formData.total_slots || !formData.price_per_hour) {
      setErrorMsg("Please complete all required fields")
      return
    }

    if (Number(formData.total_slots) <= 0) {
      setErrorMsg("Total slots must be greater than 0")
      return
    }

    if (Number(formData.price_per_hour) <= 0) {
      setErrorMsg("Price per hour must be greater than 0")
      return
    }

    if (formData.latitude < -90 || formData.latitude > 90) {
      setErrorMsg("Invalid latitude value")
      return
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      setErrorMsg("Invalid longitude value")
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        total_slots: Number(formData.total_slots),
        price_per_hour: Number(formData.price_per_hour)
      }

      const data = await createParking(payload)
      success(data.message || "Parking lot created successfully!")
      navigate("/owner/parkings")
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create parking lot"
      setErrorMsg(msg)
      toastError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 1.5rem)", paddingBottom: "4rem" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Back Link */}
        <Link
          to="/owner/parkings"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            marginBottom: "1.5rem"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to My Parking Lots</span>
        </Link>

        <div className="card-glass" style={{
          padding: "2.5rem 2rem",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-medium)"
        }}>
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.3rem 0.75rem",
              background: "rgba(139, 92, 246, 0.15)",
              color: "var(--accent-purple)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.75rem",
              fontWeight: 700,
              marginBottom: "0.75rem"
            }}>
              <Building2 size={14} />
              <span>Owner Listing Portal</span>
            </div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>Add New Parking Lot</h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
              Set up your parking location coordinates, slot capacity, and hourly rate.
            </p>
          </div>

          {errorMsg && (
            <div style={{
              background: "var(--danger-bg)",
              border: "1px solid var(--danger-border)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem 1rem",
              color: "#fca5a5",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Lot Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">Parking Lot Name</label>
              <div className="input-icon-wrapper">
                <Building2 className="input-icon-left" size={18} />
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Metro Square Underground Parking"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="address">Physical Address / Street</label>
              <div className="input-icon-wrapper">
                <MapPin className="input-icon-left" size={18} />
                <input
                  id="address"
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="e.g. 45 Commercial Street, Near City Center"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Map Coordinate Picker */}
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">
                <span>Location Coordinates (Latitude & Longitude)</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Used for driver navigation</span>
              </label>
              <MapLocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onChange={handleCoordinatesChange}
                height="280px"
              />
            </div>

            {/* Capacity & Price Row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
              marginBottom: "2rem"
            }}>
              <div className="form-group">
                <label className="form-label" htmlFor="total_slots">Total Slots Capacity</label>
                <div className="input-icon-wrapper">
                  <Layers className="input-icon-left" size={18} />
                  <input
                    id="total_slots"
                    type="number"
                    name="total_slots"
                    min="1"
                    className="form-input"
                    placeholder="e.g. 25"
                    value={formData.total_slots}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price_per_hour">Price Per Hour (₹)</label>
                <div className="input-icon-wrapper">
                  <DollarSign className="input-icon-left" size={18} />
                  <input
                    id="price_per_hour"
                    type="number"
                    step="0.01"
                    min="1"
                    name="price_per_hour"
                    className="form-input"
                    placeholder="e.g. 40"
                    value={formData.price_per_hour}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link to="/owner/parkings" className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Publishing Parking Lot...</span>
                  </>
                ) : (
                  <span>Create Parking Lot</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
