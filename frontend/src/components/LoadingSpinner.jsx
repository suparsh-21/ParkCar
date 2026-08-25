import React from "react"
import { Loader2 } from "lucide-react"

export default function LoadingSpinner({ text = "Loading...", fullPage = false }) {
  if (fullPage) {
    return (
      <div style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem"
      }}>
        <div style={{
          position: "relative",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Loader2 className="animate-spin" size={40} color="#3b82f6" />
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", fontWeight: 500 }}>
          {text}
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "1rem",
      color: "var(--text-secondary)"
    }}>
      <Loader2 className="animate-spin" size={20} color="#3b82f6" />
      <span style={{ fontSize: "0.9rem" }}>{text}</span>
    </div>
  )
}
