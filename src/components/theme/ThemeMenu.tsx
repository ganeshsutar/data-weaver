import { Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ModePicker } from "./ModePicker"
import { StylePicker } from "./StylePicker"
import { ColorPicker } from "./ColorPicker"
import { RadiusPicker } from "./RadiusPicker"
import { FontPicker } from "./FontPicker"
import { useTheme } from "@/hooks/useTheme"
import { styleMeta, fontMeta, baseColorMeta } from "@/lib/theme-config"

interface ThemeMenuProps {
  asChild?: boolean
  trigger?: React.ReactNode
}

export function ThemeMenu({ asChild, trigger }: ThemeMenuProps) {
  const { config } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={asChild}>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Theme settings</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2 space-y-1">
          <div className="px-2 py-1.5">
            <h3 className="font-semibold text-sm mb-2">Appearance</h3>
            <ModePicker />
          </div>

          <Separator />

          {/* Style Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Style</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {styleMeta[config.style].label}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-72">
              <div className="p-2">
                <StylePicker />
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <Separator />

          <div className="px-2 py-1">
            <h4 className="font-medium text-xs mb-2 text-muted-foreground">Theme Color</h4>
            <ColorPicker type="theme" />
          </div>

          <Separator />

          {/* Base Color Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Base Color</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {baseColorMeta[config.baseColor].label}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-64">
              <div className="p-2">
                <ColorPicker type="base" />
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <Separator />

          <div className="px-2 py-1">
            <h4 className="font-medium text-xs mb-2 text-muted-foreground">Radius</h4>
            <RadiusPicker />
          </div>

          <Separator />

          {/* Font Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Font</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {fontMeta[config.font].label}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-64">
              <div className="p-2">
                <FontPicker />
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
