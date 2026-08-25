import React from "react"
import { Link } from "react-router-dom"

export default function Logo({ size = "normal", showTagline = true, to = "/" }) {
  const isLarge = size === "large"
  const isSmall = size === "small"

  const iconSize = isLarge ? 48 : isSmall ? 32 : 40
  const fontSize = isLarge ? "1.65rem" : isSmall ? "1.1rem" : "1.35rem"
  const taglineSize = isLarge ? "0.75rem" : "0.62rem"

  const Content = (
    <div className="brand-logo-wrapper" style={{
      display: "inline-flex",
      alignItems: "center",
      gap: isSmall ? "0.5rem" : "0.75rem",
      textDecoration: "none",
      cursor: "pointer",
      userSelect: "none"
    }}>
      {/* Sleek Glowing Emblem */}
      <div className="brand-emblem" style={{
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        position: "relative",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 40%, #06b6d4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 20px rgba(37, 99, 235, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "all var(--transition-normal)",
        flexShrink: 0
      }}>
        {/* Custom Modern Parking & Mobility SVG Emblem */}
        <svg 
          width={iconSize * 0.62} 
          height={iconSize * 0.62} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized P with Arrow & Radar Waves */}
          <path 
            d="M5 20V4H12C15.3137 4 18 6.68629 18 10C18 13.3137 15.3137 16 12 16H5" 
            stroke="#ffffff" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M10 10H12.5C13.8807 10 15 8.88071 15 7.5C15 6.11929 13.8807 5 12.5 5H10V10Z" 
            fill="rgba(255, 255, 255, 0.9)" 
          />
          <circle cx="19" cy="19" r="2.5" fill="#38bdf8" />
          <path 
            d="M16 19H17" 
            stroke="#ffffff" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
        </svg>

        {/* Ambient Ring Pulse Glow */}
        <div style={{
          position: "absolute",
          inset: "-3px",
          borderRadius: "15px",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(6, 182, 212, 0.4))",
          filter: "blur(6px)",
          zIndex: -1,
          opacity: 0.7
        }} />
      </div>

      {/* Brand Name Typography */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: fontSize,
          letterSpacing: "-0.035em",
          lineHeight: 1.1,
          display: "flex",
          alignItems: "center"
        }}>
          <span style={{ color: "#ffffff" }}>Park</span>
          <span style={{
            background: "linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900
          }}>
            Kar
          </span>
          <span style={{
            display: "inline-block",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#38bdf8",
            marginLeft: "2px",
            boxShadow: "0 0 6px #38bdf8",
            verticalAlign: "super"
          }} />
        </div>

        {showTagline && (
          <div style={{
            fontSize: taglineSize,
            color: "var(--text-muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginTop: "1px",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem"
          }}>
            <span>Find</span>
            <span style={{ color: "var(--primary-500)", opacity: 0.7 }}>•</span>
            <span>Park</span>
            <span style={{ color: "var(--primary-500)", opacity: 0.7 }}>•</span>
            <span style={{ color: "#38bdf8" }}>Go</span>
          </div>
        )}
      </div>
    </div>
  )

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: "none", display: "inline-block" }}>
        {Content}
      </Link>
    )
  }

  return Content
}
