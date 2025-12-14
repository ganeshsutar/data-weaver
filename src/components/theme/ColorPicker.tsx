import { useTheme } from "@/hooks/useTheme"
import {
  themeColorMeta,
  baseColorMeta,
  type ThemeColor,
  type BaseColor,
} from "@/lib/theme-config"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface ColorPickerProps {
  type: "theme" | "base"
}

export function ColorPicker({ type }: ColorPickerProps) {
  const { config, setThemeColor, setBaseColor } = useTheme()

  if (type === "theme") {
    const colors: ThemeColor[] = [
      "neutral",
      "amber",
      "blue",
      "cyan",
      "emerald",
      "fuchsia",
      "green",
      "indigo",
      "lime",
      "orange",
      "pink",
    ]

    return (
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => {
          const meta = themeColorMeta[color]
          const isActive = config.themeColor === color

          return (
            <button
              key={color}
              onClick={() => setThemeColor(color)}
              className={cn(
                "h-10 rounded-md border-2 transition-all relative group",
                isActive
                  ? "border-foreground scale-105"
                  : "border-border hover:border-foreground/50"
              )}
              style={{
                backgroundColor: `hsl(${meta.hue} 70% 50%)`,
              }}
              title={meta.label}
            >
              {isActive && (
                <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-md" />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Base colors
  const baseColors: BaseColor[] = ["neutral", "stone", "zinc", "gray"]

  return (
    <div className="grid grid-cols-4 gap-2">
      {baseColors.map((color) => {
        const meta = baseColorMeta[color]
        const isActive = config.baseColor === color

        return (
          <button
            key={color}
            onClick={() => setBaseColor(color)}
            className={cn(
              "h-16 rounded-md border-2 transition-all relative flex flex-col items-center justify-center",
              isActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="text-xs font-medium">{meta.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {meta.description}
            </div>
          </button>
        )
      })}
    </div>
  )
}
