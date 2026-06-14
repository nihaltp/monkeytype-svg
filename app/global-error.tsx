"use client"

import React, { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "oklch(0.145 0 0)",
          color: "oklch(0.985 0 0)",
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "28rem",
            border: "1px solid oklch(0.269 0 0)",
            background: "oklch(0.145 0 0)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            borderRadius: "0.625rem",
            padding: "2rem",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div
              style={{
                padding: "1rem",
                borderRadius: "9999px",
                background: "rgba(229, 179, 35, 0.1)",
                border: "1px solid rgba(229, 179, 35, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={48} style={{ color: "oklch(0.795 0.184 86.04)" }} />
            </div>
          </div>

          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              margin: "0 0 0.5rem 0",
            }}
          >
            Critical Error
          </h1>
          <p
            style={{
              color: "oklch(0.708 0 0)",
              margin: "0 0 1.5rem 0",
              fontSize: "1rem",
              lineHeight: "1.5",
            }}
          >
            A critical server error occurred. Please refresh the page.
          </p>

          {error.digest && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "oklch(0.708 0 0 / 0.6)",
                fontFamily: "monospace",
                backgroundColor: "oklch(0.269 0 0 / 0.3)",
                padding: "0.5rem",
                borderRadius: "0.375rem",
                border: "1px solid oklch(0.269 0 0)",
                margin: "0 0 1.5rem 0",
                wordBreak: "break-all",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}

          <button
            onClick={reset}
            style={{
              width: "100%",
              height: "2.5rem",
              borderRadius: "0.625rem",
              background: "oklch(0.795 0.184 86.04)",
              color: "oklch(0.145 0 0)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "oklch(0.75 0.17 86.04)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "oklch(0.795 0.184 86.04)"
            }}
          >
            <RefreshCw size={16} />
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  )
}

