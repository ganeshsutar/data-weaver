import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"

export function ModePicker() {
  const { config, setMode } = useTheme()

  return (
    <div className="flex gap-2">
      <Button
        variant={config.mode === "light" ? "default" : "outline"}
        size="sm"
        className="flex-1"
        onClick={() => setMode("light")}
      >
        <Sun className="h-4 w-4 mr-2" />
        Light
      </Button>
      <Button
        variant={config.mode === "dark" ? "default" : "outline"}
        size="sm"
        className="flex-1"
        onClick={() => setMode("dark")}
      >
        <Moon className="h-4 w-4 mr-2" />
        Dark
      </Button>
    </div>
  )
}
