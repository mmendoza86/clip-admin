// components/ui/toast.tsx
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(
      "bg-white border border-gray-200 p-4 rounded shadow-md flex items-center justify-between space-x-2",
      className
    )}
    {...props}
  />
))
Toast.displayName = ToastPrimitives.Root.displayName

export const ToastTitle = ToastPrimitives.Title
export const ToastDescription = ToastPrimitives.Description
export const ToastClose = ToastPrimitives.Close
export const ToastViewport = ToastPrimitives.Viewport
