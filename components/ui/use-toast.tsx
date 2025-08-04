// components/ui/use-toast.tsx
import { createContext, useContext, useState } from "react"

interface ToastData {
  title: string
  description?: string
}

interface ToastContextProps {
  toasts: ToastData[]
  showToast: (toast: ToastData) => void
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = (toast: ToastData) => {
    setToasts(prev => [...prev.slice(-4), toast]) // solo últimos 5
    setTimeout(() => {
      setToasts(prev => prev.slice(1))
    }, 4000) // auto close en 4 segundos
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
