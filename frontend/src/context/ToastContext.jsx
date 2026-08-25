import React, { createContext, useContext, useState, useCallback } from "react"
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(({ message, type = "info", duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9)
    const newToast = { id, message, type }

    setToasts((prev) => [...prev, newToast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  const success = useCallback((msg, duration) => addToast({ message: msg, type: "success", duration }), [addToast])
  const error = useCallback((msg, duration) => addToast({ message: msg, type: "error", duration }), [addToast])
  const warning = useCallback((msg, duration) => addToast({ message: msg, type: "warning", duration }), [addToast])
  const info = useCallback((msg, duration) => addToast({ message: msg, type: "info", duration }), [addToast])

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info, removeToast }}>
      {children}
      <div className="toast-container" style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        zIndex: 9999,
        maxWidth: "420px",
        width: "calc(100vw - 3rem)",
        pointerEvents: "none"
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-item"
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              padding: "0.875rem 1.25rem",
              borderRadius: "var(--radius-md)",
              backdropFilter: "blur(12px)",
              boxShadow: "var(--shadow-xl)",
              border: `1px solid ${
                t.type === "success"
                  ? "var(--success-border)"
                  : t.type === "error"
                  ? "var(--danger-border)"
                  : t.type === "warning"
                  ? "var(--warning-border)"
                  : "var(--border-medium)"
              }`,
              background: `${
                t.type === "success"
                  ? "rgba(6, 78, 59, 0.9)"
                  : t.type === "error"
                  ? "rgba(127, 29, 29, 0.9)"
                  : t.type === "warning"
                  ? "rgba(120, 53, 15, 0.9)"
                  : "rgba(15, 23, 42, 0.95)"
              }`,
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 500,
              animation: "scaleUp 200ms cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              {t.type === "success" && <CheckCircle2 size={18} color="#34d399" />}
              {t.type === "error" && <AlertCircle size={18} color="#f87171" />}
              {t.type === "warning" && <AlertTriangle size={18} color="#fbbf24" />}
              {t.type === "info" && <Info size={18} color="#60a5fa" />}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.7)",
                cursor: "pointer",
                padding: "0.2rem",
                display: "flex",
                alignItems: "center"
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
