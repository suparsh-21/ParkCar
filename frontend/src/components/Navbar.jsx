import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { 
  Car, 
  MapPin, 
  Calendar, 
  LayoutDashboard, 
  Building2, 
  LogOut, 
  Menu, 
  X, 
  User, 
  PlusCircle 
} from "lucide-react"

export default function Navbar() {
  const { user, isDriver, isOwner, logout } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    success("Logged out successfully")
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "var(--navbar-height)",
      backgroundColor: "var(--bg-glass)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border-subtle)",
      zIndex: 900,
      display: "flex",
      alignItems: "center"
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
      }}>
        {/* Brand Logo */}
        <Link 
          to={user ? (isOwner ? "/owner" : "/driver") : "/"} 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none"
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, var(--primary-600), var(--accent-cyan))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(37, 99, 235, 0.4)",
            color: "#ffffff"
          }}>
            <Car size={22} />
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "1.3rem",
              letterSpacing: "-0.03em",
              background: "linear-gradient(to right, #ffffff, #93c5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              ParkKar
            </div>
            <div style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginTop: "-2px"
            }}>
              Find. Park. Go.
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: "none",
          alignItems: "center",
          gap: "1.5rem"
        }} className="desktop-nav">
          {!user && (
            <>
              <Link 
                to="/find-parking" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: isActive("/find-parking") ? "var(--primary-500)" : "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              >
                <MapPin size={16} />
                <span>Find Parking</span>
              </Link>
            </>
          )}

          {user && isDriver && (
            <>
              <Link 
                to="/driver" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: isActive("/driver") ? "var(--primary-500)" : "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/find-parking" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: isActive("/find-parking") ? "var(--primary-500)" : "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              >
                <MapPin size={16} />
                <span>Find Parking</span>
              </Link>
              <Link 
                to="/my-bookings" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: isActive("/my-bookings") ? "var(--primary-500)" : "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              >
                <Calendar size={16} />
                <span>My Bookings</span>
              </Link>
            </>
          )}

          {user && isOwner && (
            <>
              <Link 
                to="/owner" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: isActive("/owner") ? "var(--primary-500)" : "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/owner/parkings" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: isActive("/owner/parkings") ? "var(--primary-500)" : "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              >
                <Building2 size={16} />
                <span>My Parkings</span>
              </Link>
              <Link 
                to="/owner/parkings/create" 
                className="btn btn-sm btn-outline"
                style={{ gap: "0.3rem" }}
              >
                <PlusCircle size={15} />
                <span>Add Lot</span>
              </Link>
            </>
          )}
        </nav>

        {/* Right Side / Auth Actions */}
        <div style={{
          display: "none",
          alignItems: "center",
          gap: "1rem"
        }} className="desktop-auth">
          {!user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link to="/login" className="btn btn-sm btn-outline">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Get Started
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.75rem",
                background: "var(--bg-surface-elevated)",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-subtle)"
              }}>
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: isOwner ? "rgba(139, 92, 246, 0.2)" : "rgba(37, 99, 235, 0.2)",
                  color: isOwner ? "#c084fc" : "#60a5fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {user.name}
                </span>
                <span className={`badge ${isOwner ? 'badge-primary' : 'badge-neutral'}`} style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}>
                  {user.role}
                </span>
              </div>

              <button 
                onClick={handleLogout}
                className="btn btn-sm btn-outline"
                style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)" }}
                title="Sign out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-btn"
          style={{
            background: "transparent",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            padding: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed",
          top: "var(--navbar-height)",
          left: 0,
          right: 0,
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-medium)",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "var(--shadow-xl)",
          animation: "fadeIn 150ms ease-out"
        }}>
          {user && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--border-subtle)"
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--primary-glow)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-500)",
                fontWeight: 700
              }}>
                <User size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{user.email} · <span className="badge badge-primary">{user.role}</span></div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {!user ? (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>Home</Link>
                <Link to="/find-parking" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>Find Parking</Link>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>Register</Link>
                </div>
              </>
            ) : isDriver ? (
              <>
                <Link to="/driver" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>Dashboard</Link>
                <Link to="/find-parking" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>Find Parking</Link>
                <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>My Bookings</Link>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="btn btn-danger" style={{ marginTop: "1rem" }}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/owner" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>Dashboard</Link>
                <Link to="/owner/parkings" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>My Parking Lots</Link>
                <Link to="/owner/parkings/create" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>+ Add New Parking</Link>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="btn btn-danger" style={{ marginTop: "1rem" }}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  )
}
