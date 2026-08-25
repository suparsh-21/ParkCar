import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import Logo from "./Logo"
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
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
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
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "var(--navbar-height)",
      backgroundColor: "rgba(9, 13, 22, 0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      zIndex: 900,
      display: "flex",
      alignItems: "center"
    }}>
      {/* Top Navbar Subtle Glow Line */}
      <div style={{
        position: "absolute",
        bottom: "-1px",
        left: "10%",
        right: "10%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4) 50%, transparent)",
        pointerEvents: "none"
      }} />

      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
      }}>
        {/* Brand Logo with Custom Emblem & Glow */}
        <Logo to="/" />

        {/* Desktop Navigation Links */}
        <nav style={{
          display: "none",
          alignItems: "center",
          gap: "0.75rem",
          background: "rgba(15, 23, 42, 0.6)",
          padding: "0.35rem 0.6rem",
          borderRadius: "var(--radius-full)",
          border: "1px solid rgba(255, 255, 255, 0.06)"
        }} className="desktop-nav">
          <Link 
            to="/" 
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 1rem",
              borderRadius: "var(--radius-full)",
              color: isActive("/") ? "#38bdf8" : "var(--text-secondary)",
              background: isActive("/") ? "rgba(37, 99, 235, 0.15)" : "transparent",
              border: isActive("/") ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
              fontWeight: isActive("/") ? 700 : 500,
              fontSize: "0.9rem",
              transition: "all var(--transition-fast)"
            }}
          >
            <span>Home</span>
          </Link>

          {!user && (
            <>
              <Link 
                to="/find-parking" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 1rem",
                  borderRadius: "var(--radius-full)",
                  color: isActive("/find-parking") ? "#38bdf8" : "var(--text-secondary)",
                  background: isActive("/find-parking") ? "rgba(37, 99, 235, 0.15)" : "transparent",
                  border: isActive("/find-parking") ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
                  fontWeight: isActive("/find-parking") ? 700 : 500,
                  fontSize: "0.9rem",
                  transition: "all var(--transition-fast)"
                }}
              >
                <MapPin size={15} color={isActive("/find-parking") ? "var(--primary-500)" : "currentColor"} />
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
                  padding: "0.45rem 1rem",
                  borderRadius: "var(--radius-full)",
                  color: isActive("/driver") ? "#38bdf8" : "var(--text-secondary)",
                  background: isActive("/driver") ? "rgba(37, 99, 235, 0.15)" : "transparent",
                  border: isActive("/driver") ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
                  fontWeight: isActive("/driver") ? 700 : 500,
                  fontSize: "0.9rem",
                  transition: "all var(--transition-fast)"
                }}
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/find-parking" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 1rem",
                  borderRadius: "var(--radius-full)",
                  color: isActive("/find-parking") ? "#38bdf8" : "var(--text-secondary)",
                  background: isActive("/find-parking") ? "rgba(37, 99, 235, 0.15)" : "transparent",
                  border: isActive("/find-parking") ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
                  fontWeight: isActive("/find-parking") ? 700 : 500,
                  fontSize: "0.9rem",
                  transition: "all var(--transition-fast)"
                }}
              >
                <MapPin size={15} />
                <span>Find Parking</span>
              </Link>
              <Link 
                to="/my-bookings" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 1rem",
                  borderRadius: "var(--radius-full)",
                  color: isActive("/my-bookings") ? "#38bdf8" : "var(--text-secondary)",
                  background: isActive("/my-bookings") ? "rgba(37, 99, 235, 0.15)" : "transparent",
                  border: isActive("/my-bookings") ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
                  fontWeight: isActive("/my-bookings") ? 700 : 500,
                  fontSize: "0.9rem",
                  transition: "all var(--transition-fast)"
                }}
              >
                <Calendar size={15} />
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
                  padding: "0.45rem 1rem",
                  borderRadius: "var(--radius-full)",
                  color: isActive("/owner") ? "#38bdf8" : "var(--text-secondary)",
                  background: isActive("/owner") ? "rgba(37, 99, 235, 0.15)" : "transparent",
                  border: isActive("/owner") ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
                  fontWeight: isActive("/owner") ? 700 : 500,
                  fontSize: "0.9rem",
                  transition: "all var(--transition-fast)"
                }}
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/owner/parkings" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 1rem",
                  borderRadius: "var(--radius-full)",
                  color: isActive("/owner/parkings") ? "#38bdf8" : "var(--text-secondary)",
                  background: isActive("/owner/parkings") ? "rgba(37, 99, 235, 0.15)" : "transparent",
                  border: isActive("/owner/parkings") ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
                  fontWeight: isActive("/owner/parkings") ? 700 : 500,
                  fontSize: "0.9rem",
                  transition: "all var(--transition-fast)"
                }}
              >
                <Building2 size={15} />
                <span>My Lots</span>
              </Link>
              <Link 
                to="/owner/parkings/create" 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "var(--radius-full)",
                  background: "linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(168, 85, 247, 0.2))",
                  border: "1px solid rgba(168, 85, 247, 0.4)",
                  color: "#c084fc",
                  fontSize: "0.85rem",
                  fontWeight: 700
                }}
              >
                <PlusCircle size={15} />
                <span>Add Lot</span>
              </Link>
            </>
          )}
        </nav>

        {/* Right Side Auth Actions */}
        <div style={{
          display: "none",
          alignItems: "center",
          gap: "1rem"
        }} className="desktop-auth">
          {!user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <Link 
                to="/login" 
                className="btn btn-sm btn-outline"
                style={{ borderRadius: "var(--radius-full)", padding: "0.45rem 1.15rem" }}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn btn-sm btn-primary btn-shimmer"
                style={{ 
                  borderRadius: "var(--radius-full)", 
                  padding: "0.45rem 1.25rem",
                  boxShadow: "0 0 18px rgba(37, 99, 235, 0.35)",
                  gap: "0.4rem"
                }}
              >
                <span>Get Started</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.35rem 0.85rem",
                background: "var(--bg-surface-elevated)",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: isOwner ? "linear-gradient(135deg, #a855f7, #ec4899)" : "linear-gradient(135deg, #2563eb, #06b6d4)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  boxShadow: "0 0 10px rgba(37, 99, 235, 0.4)"
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
                style={{ 
                  borderRadius: "var(--radius-full)",
                  color: "var(--text-secondary)", 
                  borderColor: "var(--border-subtle)",
                  gap: "0.4rem",
                  padding: "0.4rem 0.85rem"
                }}
                title="Sign out"
              >
                <LogOut size={14} />
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

      {/* Mobile Menu Drawer */}
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
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary-600), var(--accent-cyan))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
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
                <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)", fontWeight: 600 }}>Home</Link>
                <Link to="/find-parking" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)", fontWeight: 600 }}>Find Parking</Link>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ flex: 1, borderRadius: "var(--radius-full)" }}>Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1, borderRadius: "var(--radius-full)" }}>Get Started</Link>
                </div>
              </>
            ) : isDriver ? (
              <>
                <Link to="/driver" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)", fontWeight: 600 }}>Dashboard</Link>
                <Link to="/find-parking" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)", fontWeight: 600 }}>Find Parking</Link>
                <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)", fontWeight: 600 }}>My Bookings</Link>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="btn btn-danger" style={{ marginTop: "1rem", borderRadius: "var(--radius-full)" }}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/owner" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)", fontWeight: 600 }}>Dashboard</Link>
                <Link to="/owner/parkings" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)", fontWeight: 600 }}>My Parking Lots</Link>
                <Link to="/owner/parkings/create" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", color: "var(--text-primary)", fontWeight: 600 }}>+ Add New Parking</Link>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="btn btn-danger" style={{ marginTop: "1rem", borderRadius: "var(--radius-full)" }}>
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
