import { useTheme } from "@/hooks/useTheme"
import { styleMeta, type ThemeStyle } from "@/lib/theme-config"
import { cn } from "@/lib/utils"

export function StylePicker() {
  const { config, setStyle } = useTheme()

  const styles: ThemeStyle[] = ["vega", "nova", "mala", "lyra", "mira"]

  return (
    <div className="space-y-2">
      {styles.map((style) => {
        const meta = styleMeta[style]
        const isActive = config.style === style

        return (
          <button
            key={style}
            onClick={() => setStyle(style)}
            className={cn(
              "w-full text-left p-2 rounded-md border transition-colors",
              isActive
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                  isActive ? "border-primary" : "border-muted-foreground"
                )}
              >
                {isActive && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{meta.label}</div>
                <div className="text-xs text-muted-foreground">
                  {meta.description}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
