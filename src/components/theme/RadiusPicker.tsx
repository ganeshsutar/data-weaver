import { useTheme } from "@/hooks/useTheme"
import { radiusMeta, type ThemeRadius } from "@/lib/theme-config"
import { cn } from "@/lib/utils"

export function RadiusPicker() {
  const { config, setRadius } = useTheme()

  const radiusOptions: ThemeRadius[] = ["none", "small", "medium", "large"]

  return (
    <div className="grid grid-cols-4 gap-2">
      {radiusOptions.map((radius) => {
        const meta = radiusMeta[radius]
        const isActive = config.radius === radius

        return (
          <button
            key={radius}
            onClick={() => setRadius(radius)}
            className={cn(
              "p-3 border-2 transition-all flex items-center justify-center",
              isActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            style={{
              borderRadius: radius === "none" ? "0" : meta.value,
            }}
          >
            <div className="text-xs font-medium">{meta.label}</div>
          </button>
        )
      })}
    </div>
  )
}
