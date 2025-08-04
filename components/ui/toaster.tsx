// components/ui/toaster.tsx
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t, i) => (
        <div
          key={i}
          className="bg-secondary-700 text-white px-4 py-3 rounded shadow-lg w-72"
        >
          <strong>{t.title}</strong>
          {t.description && <p className="text-sm">{t.description}</p>}
        </div>
      ))}
    </div>
  )
}
