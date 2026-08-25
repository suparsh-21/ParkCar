import React, { useState } from "react"
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
  IndianRupee,
  Compass,
  Zap,
  Mail,
  ChevronDown,
  ChevronUp,
  Search,
  Lock,
  Layers,
  Star,
  Users
} from "lucide-react"

export default function Landing() {
  const { user, isOwner } = useAuth()
  const navigate = useNavigate()

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null)
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "How does booking a parking spot work on ParkKar?",
      a: "Search nearby parking lots or pick your destination, select your arrival and departure time, and reserve your bay. Your slot will be held for 10 minutes to complete the secure payment via Razorpay."
    },
    {
      q: "How do I get directions to my reserved spot?",
      a: "As soon as your booking is confirmed, clicking 'Get Directions' opens Google Maps turn-by-turn navigation straight to the parking entrance."
    },
    {
      q: "How can I list my driveway or commercial parking lot?",
      a: "Sign up as a Parking Owner, use our visual map pin picker to set exact GPS coordinates, set your hourly rate in ₹, and publish. You can toggle between OPEN and CLOSED anytime with one click."
    },
    {
      q: "What payment methods are supported?",
      a: "We support UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, and Net Banking through Razorpay with instant cryptographic verification."
    },
    {
      q: "What happens if I don't pay within the 10-minute hold window?",
      a: "If payment is not completed within 10 minutes, the reserved spot automatically releases back to available inventory so other drivers can book it."
    }
  ]

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 1rem)", paddingBottom: "4rem" }}>
      
      {/* =========================================================================
          HERO SECTION (Matching Webflow Pep's composition with Left/Right 3D Cars & Center Phone)
         ========================================================================= */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        padding: "3rem 1rem 0",
        minHeight: "780px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Soft Ambient Glow in Center */}
        <div style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: "650px",
          height: "450px",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0
        }} />

        {/* Center Copy Content */}
        <div style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: "920px",
          margin: "0 auto"
        }}>
          {/* Pill Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 1.1rem",
            background: "rgba(168, 85, 247, 0.12)",
            border: "1px solid rgba(168, 85, 247, 0.35)",
            borderRadius: "var(--radius-full)",
            color: "#c084fc",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "1.5rem"
          }}>
            <Sparkles size={15} />
            <span>ParkKar · Smart Parking Mobility</span>
          </div>

          {/* Exact Headline Structure from Inspiration */}
          <h1 style={{
            fontSize: "clamp(2.6rem, 6.5vw, 4.8rem)",
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            marginBottom: "1.25rem",
            color: "#ffffff"
          }}>
            Smart parking booking <br />
            <span style={{
              background: "linear-gradient(135deg, #c084fc 0%, #a855f7 40%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block"
            }}>
              between drivers & owners
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            maxWidth: "680px",
            margin: "0 auto 2.25rem"
          }}>
            With ParkKar, save time and avoid parking stress by reserving your spot in advance. Discover a seamless, real-time solution for city parking.
          </p>

          {/* CTA Buttons (NO App store badges) */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "2rem"
          }}>
            <Link 
              to={user ? (isOwner ? "/owner" : "/find-parking") : "/find-parking"} 
              className="btn btn-primary btn-lg"
              style={{
                padding: "0.95rem 2.25rem",
                fontSize: "1.05rem",
                borderRadius: "var(--radius-full)",
                gap: "0.6rem",
                boxShadow: "0 0 25px rgba(37, 99, 235, 0.45)"
              }}
            >
              <MapPin size={19} />
              <span>Find Parking Spot</span>
              <ArrowRight size={17} />
            </Link>

            <Link 
              to={user ? (isOwner ? "/owner/parkings/create" : "/owner") : "/register"} 
              className="btn btn-secondary btn-lg"
              style={{
                padding: "0.95rem 2.25rem",
                fontSize: "1.05rem",
                borderRadius: "var(--radius-full)",
                gap: "0.6rem"
              }}
            >
              <Building2 size={19} />
              <span>List Your Parking Space</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            VISUAL STAGE: Left Car + Center Smartphone App Mockup + Right Car
           ========================================================================= */}
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "1380px",
          margin: "1.5rem auto 0",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          minHeight: "420px",
          zIndex: 1
        }}>
          {/* Left Angled Car */}
          <div style={{
            position: "absolute",
            left: "-40px",
            bottom: "0",
            width: "clamp(240px, 34vw, 440px)",
            zIndex: 1,
            pointerEvents: "none",
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.7))",
            transform: "rotate(3deg)"
          }}>
            <img 
              src="/car-left.jpg" 
              alt="Electric Sedan"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "var(--radius-lg)"
              }}
              onError={(e) => { e.target.style.display = "none" }}
            />
          </div>

          {/* Center Smartphone App Showcase Mockup (Rising from bottom) */}
          <div style={{
            position: "relative",
            zIndex: 3,
            width: "clamp(290px, 28vw, 360px)",
            background: "#0b0f19",
            borderRadius: "36px 36px 0 0",
            border: "4px solid #1e293b",
            borderBottom: "none",
            boxShadow: "0 -15px 40px rgba(0,0,0,0.8), 0 0 35px rgba(168, 85, 247, 0.25)",
            padding: "1.25rem 1rem 0",
            overflow: "hidden"
          }}>
            {/* Phone Speaker Notch */}
            <div style={{
              width: "100px",
              height: "16px",
              background: "#1e293b",
              borderRadius: "0 0 12px 12px",
              margin: "-1.25rem auto 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{ width: "35px", height: "4px", background: "#334155", borderRadius: "2px" }} />
            </div>

            {/* Mobile App UI Screen */}
            <div style={{
              background: "var(--bg-surface)",
              borderRadius: "20px 20px 0 0",
              padding: "1rem",
              border: "1px solid var(--border-subtle)",
              borderBottom: "none"
            }}>
              {/* Top Mini Nav */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    background: "var(--primary-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff"
                  }}>
                    <Car size={13} />
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#ffffff" }}>ParkKar</span>
                </div>
                <span className="badge badge-success" style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem" }}>
                  ● LIVE RADAR
                </span>
              </div>

              {/* Search Bar on App */}
              <div style={{
                background: "var(--bg-surface-elevated)",
                borderRadius: "var(--radius-md)",
                padding: "0.5rem 0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginBottom: "0.85rem",
                border: "1px solid var(--border-subtle)"
              }}>
                <Search size={14} color="var(--primary-500)" />
                <span>Search nearest parking lots...</span>
              </div>

              {/* Spot Card 1 in Mobile Mockup */}
              <div style={{
                background: "rgba(30, 41, 59, 0.9)",
                border: "1px solid rgba(168, 85, 247, 0.4)",
                borderRadius: "var(--radius-md)",
                padding: "0.75rem",
                marginBottom: "0.75rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>City Central Garage</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                      <MapPin size={11} color="var(--primary-500)" />
                      MG Road · 0.5 km
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#38bdf8" }}>₹40/hr</div>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "0.6rem",
                  paddingTop: "0.5rem",
                  borderTop: "1px solid var(--border-subtle)"
                }}>
                  <span style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 600 }}>
                    ● 14 slots free
                  </span>
                  <button 
                    onClick={() => navigate("/find-parking")}
                    style={{
                      background: "var(--primary-600)",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.6rem",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer"
                    }}
                  >
                    Reserve
                  </button>
                </div>
              </div>

              {/* Spot Card 2 */}
              <div style={{
                background: "rgba(30, 41, 59, 0.6)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "0.65rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ffffff" }}>Commercial Plaza Bay</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Tech Corridor · 1.2 km</div>
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#38bdf8" }}>₹50/hr</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Angled Car */}
          <div style={{
            position: "absolute",
            right: "-40px",
            bottom: "0",
            width: "clamp(240px, 34vw, 440px)",
            zIndex: 1,
            pointerEvents: "none",
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.7))",
            transform: "rotate(-3deg)"
          }}>
            <img 
              src="/car-right.jpg" 
              alt="Electric SUV"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "var(--radius-lg)"
              }}
              onError={(e) => { e.target.style.display = "none" }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. KEY PLATFORM NUMBERS
         ========================================================================= */}
      <section className="container" style={{ marginTop: "4rem", marginBottom: "6rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem"
        }}>
          <div className="card-glass" style={{ padding: "1.75rem", textAlign: "center", borderRadius: "var(--radius-xl)" }}>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#38bdf8", marginBottom: "0.25rem" }}>100%</div>
            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>Guaranteed Spot Hold</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>10-min reservation hold</div>
          </div>

          <div className="card-glass" style={{ padding: "1.75rem", textAlign: "center", borderRadius: "var(--radius-xl)" }}>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#34d399", marginBottom: "0.25rem" }}>&lt; 60s</div>
            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>Instant Confirmation</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Razorpay UPI / Cards</div>
          </div>

          <div className="card-glass" style={{ padding: "1.75rem", textAlign: "center", borderRadius: "var(--radius-xl)" }}>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#c084fc", marginBottom: "0.25rem" }}>1-Click</div>
            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>Turn-by-Turn Navigation</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Direct Google Maps route</div>
          </div>

          <div className="card-glass" style={{ padding: "1.75rem", textAlign: "center", borderRadius: "var(--radius-xl)" }}>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#f59e0b", marginBottom: "0.25rem" }}>Real-time</div>
            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>Owner Bay Controls</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Live Open/Close toggles</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW PARKKAR WORKS (4 STEPS)
         ========================================================================= */}
      <section style={{
        background: "rgba(15, 23, 42, 0.65)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "5rem 0",
        marginBottom: "6rem"
      }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "620px", margin: "0 auto 3.5rem" }}>
            <span className="badge badge-primary" style={{ marginBottom: "0.75rem" }}>Simple 4-Step Process</span>
            <h2 style={{ fontSize: "2.4rem", marginBottom: "0.75rem", fontWeight: 800 }}>How ParkKar Works</h2>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
              From discovering nearby spots to effortless Google Maps navigation, everything happens in seconds.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem"
          }}>
            {/* Step 1 */}
            <div className="card card-hover" style={{ background: "var(--bg-surface)", padding: "1.75rem", borderRadius: "var(--radius-xl)" }}>
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
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Find Nearby Parking</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Use live GPS location or set your schedule to discover open parking lots with real-time bay availability.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card card-hover" style={{ background: "var(--bg-surface)", padding: "1.75rem", borderRadius: "var(--radius-xl)" }}>
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
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Reserve Your Spot</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Pick your arrival & departure times with automated price calculation. Spot is held for 10 minutes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card card-hover" style={{ background: "var(--bg-surface)", padding: "1.75rem", borderRadius: "var(--radius-xl)" }}>
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
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Secure Checkout</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Complete payment seamlessly via Razorpay (UPI, Cards, Net Banking) with signature verification.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card card-hover" style={{ background: "var(--bg-surface)", padding: "1.75rem", borderRadius: "var(--radius-xl)" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                background: "rgba(168, 85, 247, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#c084fc",
                marginBottom: "1.25rem"
              }}>
                <Navigation size={24} />
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#c084fc", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                Step 04
              </div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>1-Click Navigation</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Launch Google Maps turn-by-turn navigation straight from your confirmed digital parking pass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FOR PARKING OWNERS (Monetize Space)
         ========================================================================= */}
      <section className="container" style={{ marginBottom: "6rem" }}>
        <div className="card-glass" style={{
          padding: "3.5rem 2.5rem",
          borderRadius: "var(--radius-2xl)",
          border: "1px solid var(--border-medium)",
          background: "linear-gradient(135deg, rgba(22, 32, 54, 0.85), rgba(15, 23, 42, 0.98))"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            alignItems: "center"
          }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: "1rem" }}>For Parking Owners</span>
              <h2 style={{ fontSize: "2.4rem", lineHeight: 1.2, marginBottom: "1rem", fontWeight: 800 }}>
                Monetize your empty parking spaces.
              </h2>
              <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                Turn driveway, basement, or commercial parking spaces into reliable recurring income. Set your rates, control operating hours, and track customer reservations in real time.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>Visual Map Location Pin Picker for accurate driver navigation</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>1-Click Open/Close status toggle</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>Live Driver Booking Logs with contact details & verified earnings</span>
                </div>
              </div>

              <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: "0.6rem" }}>
                <Building2 size={18} />
                <span>Start Listing Today</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Owner Hub Graphic Preview */}
            <div className="card" style={{
              background: "var(--bg-surface-elevated)",
              padding: "2rem",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-medium)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontWeight: 700, fontSize: "1.15rem" }}>Owner Control Center</div>
                <span className="badge badge-success">Verified Lot</span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem"
              }}>
                <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Total Capacity</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", marginTop: "0.25rem" }}>35 Bays</div>
                </div>
                <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Status</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#34d399", marginTop: "0.25rem" }}>OPEN</div>
                </div>
              </div>

              <div style={{
                padding: "1rem",
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

      {/* =========================================================================
          5. FREQUENTLY ASKED QUESTIONS (FAQ)
         ========================================================================= */}
      <section className="container" style={{ maxWidth: "800px", marginBottom: "6rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge badge-neutral" style={{ marginBottom: "0.75rem" }}>Common Questions</span>
          <h2 style={{ fontSize: "2.2rem", marginBottom: "0.5rem", fontWeight: 800 }}>Frequently Asked Questions</h2>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
            Everything you need to know about parking and listing on ParkKar
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div 
                key={index}
                className="card-glass"
                style={{
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem 1.5rem",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
                onClick={() => toggleFaq(index)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ fontSize: "1.05rem", color: "var(--text-primary)", margin: 0, fontWeight: 600 }}>
                    {faq.q}
                  </h4>
                  {isOpen ? <ChevronUp size={20} color="var(--primary-500)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>

                {isOpen && (
                  <div style={{
                    marginTop: "1rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    animation: "fadeIn 150ms ease-out"
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* =========================================================================
          6. CONTACT & SUPPORT BANNER (WITH USER-REQUESTED EMAIL)
         ========================================================================= */}
      <section className="container" style={{ textAlign: "center" }}>
        <div style={{
          padding: "4rem 2rem",
          background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.18) 0%, rgba(37, 99, 235, 0.15) 50%, rgba(15, 23, 42, 0.95) 100%)",
          borderRadius: "var(--radius-2xl)",
          border: "1px solid var(--border-medium)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(168, 85, 247, 0.15)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            color: "#c084fc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem"
          }}>
            <Mail size={28} />
          </div>

          <h2 style={{ fontSize: "2.4rem", marginBottom: "1rem", fontWeight: 800 }}>
            Have questions or need assistance?
          </h2>

          <p style={{
            fontSize: "1.15rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto 1.75rem",
            lineHeight: 1.6
          }}>
            In case of any queries, feel free to contact us at{" "}
            <a 
              href="mailto:parkkar2026@gmail.com" 
              style={{
                color: "#38bdf8",
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: "4px"
              }}
            >
              parkkar2026@gmail.com
            </a>
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="mailto:parkkar2026@gmail.com"
              className="btn btn-primary btn-lg"
              style={{ gap: "0.5rem" }}
            >
              <Mail size={18} />
              <span>Contact Support</span>
            </a>

            <Link to="/find-parking" className="btn btn-secondary btn-lg" style={{ gap: "0.5rem" }}>
              <MapPin size={18} />
              <span>Explore Parking</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
