"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error en componente:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive">
          <AlertTriangle className="h-10 w-10 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Algo salió mal</h2>
          <p className="text-sm mb-4 text-center">Ha ocurrido un error al cargar este componente.</p>
          <Button variant="outline" onClick={() => this.setState({ hasError: false })}>
            Intentar de nuevo
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
