"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Error({
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
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-border bg-card shadow-2xl p-8 text-center relative overflow-hidden">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
            <AlertTriangle className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          An unexpected server error occurred. Please try again.
        </p>

        {error.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono mb-6 bg-muted p-2 rounded border border-border">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={reset}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button asChild variant="outline" className="w-full font-semibold">
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </Card>
    </main>
  )
}

