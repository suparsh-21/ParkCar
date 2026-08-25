import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { 
  Car, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Navigation, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Clock, 
  Compass,
  Zap
} from "lucide-react"

export default function Landing() {
  const { user, isOwner } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 1.5rem)", paddingBottom: "4rem" }}>
      {/* Hero Section */}
      <section className="container" style={{ marginBottom: "6rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "3.5rem",
          alignItems: "center"
        }}>
          {/* Left Column: Copy & CTAs */}
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.85rem",
              background: "rgba(37, 99, 235, 0.12)",
              border: "1px solid rgba(37, 99, 235, 0.3)",
              borderRadius: "var(--radius-full)",
              color: "var(--primary-500)",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1.5rem"
            }}>
              <Sparkles size={14} />
              <span>Smart Parking Platform</span>
            </div>

            <h1 style={{
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              lineHeight: 1.15,
              marginBottom: "1.25rem",
              background: "linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Find your perfect <span style={{
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>parking spot.</span>
            </h1>

            <p style={{
              fontSize: "1.15rem",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              marginBottom: "2.25rem",
              maxWidth: "520px"
            }}>
              Discover nearby parking, reserve your spot, pay securely and get directions — all from one place.
            </p>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "center"
            }}>
              <Link 
                to={user ? (isOwner ? "/owner" : "/find-parking") : "/find-parking"} 
                className="btn btn-primary btn-lg"
                style={{ gap: "0.6rem" }}
              >
                <MapPin size={18} />
                <span>Find Parking</span>
                <ArrowRight size={16} />
              </Link>

              <Link 
                to={user ? (isOwner ? "/owner/parkings/create" : "/owner") : "/register"} 
                className="btn btn-secondary btn-lg"
              >
                <Building2 size={18} />
                <span>Become a Parking Owner</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: "flex",
              gap: "2rem",
              marginTop: "3rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--border-subtle)"
            }}>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>100%</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Guaranteed Spot</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>&lt; 2 min</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Instant Booking</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>Direct</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Turn-by-turn Maps</div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Visual Card */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              inset: "-10px",
              background: "radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)",
              borderRadius: "var(--radius-xl)",
              filter: "blur(20px)",
              zIndex: 0
            }} />

            <div className="card-glass" style={{
              position: "relative",
              zIndex: 1,
              padding: "2rem",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-medium)"
            }}>
              {/* Mock Map / Search Bar Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid var(--border-subtle)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div className="status-dot online animate-pulse" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#34d399" }}>
                    Live Parking Radar Active
                  </span>
                </div>
                <span className="badge badge-primary">Real-time</span>
              </div>

              {/* Sample Parking Card Item 1 */}
              <div className="card" style={{
                background: "var(--bg-surface-elevated)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                padding: "1.25rem",
                marginBottom: "1rem",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <h4 style={{ fontSize: "1.1rem", color: "#ffffff" }}>Metro City Plaza Parking</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <MapPin size={13} color="var(--primary-500)" />
                      MG Road, Central Commercial Hub · 1.2 km away
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#38bdf8" }}>₹40/hr</div>
                    <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>OPEN</span>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid var(--border-subtle)",
                  fontSize: "0.85rem"
                }}>
                  <span style={{ color: "#34d399", fontWeight: 600 }}>
                    ● 14 slots available now
                  </span>
                  <button 
                    onClick={() => navigate("/find-parking")}
                    className="btn btn-sm btn-primary"
                    style={{ padding: "0.35rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Reserve Now
                  </button>
                </div>
              </div>

              {/* Sample Parking Card Item 2 */}
              <div className="card" style={{
                background: "var(--bg-surface-elevated)",
                padding: "1.25rem",
                opacity: 0.85
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h4 style={{ fontSize: "1rem", color: "#ffffff" }}>Grand Tech Park Basement</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <MapPin size={13} color="var(--primary-500)" />
                      Outer Ring Road, Tech Corridor · 2.8 km away
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>₹50/hr</div>
                    <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>OPEN</span>
                  </div>
                </div>
              </div>

              {/* Verified badge */}
              <div style={{
                marginTop: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                color: "var(--text-muted)",
                fontSize: "0.8rem"
              }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>Verified location coordinates & instant gate entry</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How ParkKar Works Section */}
      <section style={{
        background: "rgba(15, 23, 42, 0.6)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "5rem 0"
      }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3.5rem" }}>
            <span className="badge badge-primary" style={{ marginBottom: "0.75rem" }}>Simple 4-Step Process</span>
            <h2 style={{ fontSize: "2.2rem", marginBottom: "0.75rem" }}>How ParkKar Works</h2>
            <p style={{ fontSize: "1rem" }}>
              From discovering nearby spots to effortless navigation, everything happens in seconds.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem"
          }}>
            {/* Step 1 */}
            <div className="card card-hover" style={{ background: "var(--bg-surface)" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                background: "rgba(37, 99, 235, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-500)",
                marginBottom: "1.25rem"
              }}>
                <MapPin size={24} />
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                Step 01
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Find Nearby Parking</h3>
              <p style={{ fontSize: "0.9rem" }}>
                Enter your desired time slot or use your live GPS location to discover available lots and rates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card card-hover" style={{ background: "var(--bg-surface)" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                background: "rgba(6, 182, 212, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-cyan)",
                marginBottom: "1.25rem"
              }}>
                <Calendar size={24} />
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                Step 02
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Reserve Your Spot</h3>
              <p style={{ fontSize: "0.9rem" }}>
                Choose exact start and end times with automated pricing calculations and slot availability checks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card card-hover" style={{ background: "var(--bg-surface)" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                background: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--success)",
                marginBottom: "1.25rem"
              }}>
                <CreditCard size={24} />
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--success)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                Step 03
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Secure Payment</h3>
              <p style={{ fontSize: "0.9rem" }}>
                Complete your reservation via Razorpay with encrypted payment verification and instant invoice.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card card-hover" style={{ background: "var(--bg-surface)" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                background: "rgba(139, 92, 246, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-purple)",
                marginBottom: "1.25rem"
              }}>
                <Navigation size={24} />
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-purple)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                Step 04
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Get Directions</h3>
              <p style={{ fontSize: "0.9rem" }}>
                One-click navigation opens Google Maps directly from your confirmed booking straight to the parking gate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Parking Owners Section */}
      <section className="container" style={{ margin: "6rem auto" }}>
        <div className="card-glass" style={{
          padding: "3.5rem 2.5rem",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-medium)",
          background: "linear-gradient(135deg, rgba(22, 32, 54, 0.8), rgba(15, 23, 42, 0.95))"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            alignItems: "center"
          }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: "1rem" }}>For Parking Owners</span>
              <h2 style={{ fontSize: "2.4rem", lineHeight: 1.2, marginBottom: "1rem" }}>
                Monetize your empty parking spaces.
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "1.75rem" }}>
                List your parking spaces on ParkKar, manage availability in real time, monitor bookings, and generate recurring revenue effortlessly.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>Visual interactive map picker for adding coordinates</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>1-click Open/Close status toggle</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>Live customer booking history & driver contact details</span>
                </div>
              </div>

              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Start Listing Today</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Owner Portal Preview Card */}
            <div className="card" style={{
              background: "var(--bg-surface-elevated)",
              padding: "1.75rem",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-medium)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Owner Control Center</div>
                <span className="badge badge-success">Verified Hub</span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem"
              }}>
                <div style={{ background: "var(--bg-surface)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Total Capacity</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff" }}>48 Slots</div>
                </div>
                <div style={{ background: "var(--bg-surface)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Status</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#34d399" }}>OPEN</div>
                </div>
              </div>

              <div style={{
                padding: "0.85rem",
                background: "rgba(37, 99, 235, 0.1)",
                borderRadius: "var(--radius-md)",
                border: "1px dashed rgba(37, 99, 235, 0.4)",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                textAlign: "center"
              }}>
                ⚡ Automated overlapping booking collision protection enabled
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <section className="container" style={{ textAlign: "center" }}>
        <div style={{
          padding: "4rem 2rem",
          background: "radial-gradient(circle at center, rgba(37, 99, 235, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-medium)"
        }}>
          <h2 style={{ fontSize: "2.4rem", marginBottom: "1rem" }}>Ready to experience seamless parking?</h2>
          <p style={{ maxWidth: "500px", margin: "0 auto 2rem", fontSize: "1.05rem" }}>
            Join drivers and parking owners transforming urban mobility with ParkKar today.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/find-parking" className="btn btn-primary btn-lg">
              Find Parking Now
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
