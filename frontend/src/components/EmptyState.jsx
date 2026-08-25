import React from "react"
import { SearchX } from "lucide-react"

export default function EmptyState({
  icon: Icon = SearchX,
  title = "No data found",
  description = "There are currently no items to display.",
  actionText,
  onAction
}) {
  return (
    <div className="card-glass" style={{
      padding: "3.5rem 2rem",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-xl)",
      margin: "1rem 0"
    }}>
      <div style={{
        width: "64px",
        height: "64px",
        borderRadius: "var(--radius-full)",
        background: "rgba(59, 130, 246, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.25rem",
        color: "var(--primary-500)",
        border: "1px solid rgba(59, 130, 246, 0.2)"
      }}>
        <Icon size={32} />
      </div>
      <h3 style={{ marginBottom: "0.5rem", color: "var(--text-primary)" }}>{title}</h3>
      <p style={{ maxWidth: "420px", margin: "0 auto 1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  )
}
