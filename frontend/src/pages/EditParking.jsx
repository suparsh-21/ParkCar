import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getMyParkings, updateParking } from "../services/parkingService"
import { useToast } from "../context/ToastContext"
import LoadingSpinner from "../components/LoadingSpinner"
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Layers, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Save
} from "lucide-react"

export default function EditParking() {
  const { parking_id } = useParams()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    total_slots: "",
    price_per_hour: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    async function loadParking() {
      try {
        const data = await getMyParkings()
        const lot = (data.parking || []).find((p) => p.id.toString() === parking_id.toString())
        if (!lot) {
          setErrorMsg("Parking lot not found or you are not authorized to edit it.")
        } else {
          setFormData({
            name: lot.name || "",
            address: lot.address || "",
            total_slots: lot.total_slots || "",
            price_per_hour: lot.price_per_hour || ""
          })
        }
      } catch (err) {
        setErrorMsg("Failed to load parking details")
      } finally {
        setLoading(false)
      }
    }

    loadParking()
  }, [parking_id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (errorMsg) setErrorMsg("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    if (!formData.name || !formData.address || !formData.total_slots || !formData.price_per_hour) {
      setErrorMsg("All fields are required")
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

    setSaving(true)

    try {
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        total_slots: Number(formData.total_slots),
        price_per_hour: Number(formData.price_per_hour)
      }

      const data = await updateParking(parking_id, payload)
      success(data.message || "Parking details updated successfully!")
      navigate("/owner/parkings")
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update parking lot"
      setErrorMsg(msg)
      toastError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullPage text="Loading parking lot details..." />
  }

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 1.5rem)", paddingBottom: "4rem" }}>
      <div className="container" style={{ maxWidth: "700px" }}>
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
              <span>Lot Management</span>
            </div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>Edit Parking Lot</h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
              Update parking name, street address, bay capacity, and hourly rate.
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
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label" htmlFor="address">Address</label>
              <div className="input-icon-wrapper">
                <MapPin className="input-icon-left" size={18} />
                <input
                  id="address"
                  type="text"
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Capacity & Price */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
              marginBottom: "2rem"
            }}>
              <div className="form-group">
                <label className="form-label" htmlFor="total_slots">Total Slots</label>
                <div className="input-icon-wrapper">
                  <Layers className="input-icon-left" size={18} />
                  <input
                    id="total_slots"
                    type="number"
                    name="total_slots"
                    min="1"
                    className="form-input"
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
                style={{ flex: 2, gap: "0.5rem" }}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
