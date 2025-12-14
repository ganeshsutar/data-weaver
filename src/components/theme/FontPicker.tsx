import { useTheme } from "@/hooks/useTheme"
import { fontMeta, type ThemeFont } from "@/lib/theme-config"
import { cn } from "@/lib/utils"

export function FontPicker() {
  const { config, setFont } = useTheme()

  const fonts: ThemeFont[] = ["inter", "noto-sans", "nunito-sans", "figtree"]

  return (
    <div className="space-y-2">
      {fonts.map((font) => {
        const meta = fontMeta[font]
        const isActive = config.font === font

        return (
          <button
            key={font}
            onClick={() => setFont(font)}
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
                <div
                  className="font-medium text-sm"
                  style={{ fontFamily: meta.family }}
                >
                  {meta.label}
                </div>
                <div
                  className="text-xs text-muted-foreground mt-0.5"
                  style={{ fontFamily: meta.family }}
                >
                  The quick brown fox jumps
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
