import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface YearRangeFilterProps {
  minYear: number
  maxYear: number
  value: [number, number]
  onChange: (range: [number, number]) => void
}

const quickPresets = [
  { label: "All", range: [1958, 2025] as [number, number] },
  { label: "2020s", range: [2020, 2025] as [number, number] },
  { label: "2010s", range: [2010, 2019] as [number, number] },
  { label: "2000s", range: [2000, 2009] as [number, number] },
]

const decadePresets = [
  { label: "2020s", range: [2020, 2025] as [number, number] },
  { label: "2010s", range: [2010, 2019] as [number, number] },
  { label: "2000s", range: [2000, 2009] as [number, number] },
  { label: "1990s", range: [1990, 1999] as [number, number] },
  { label: "1980s", range: [1980, 1989] as [number, number] },
  { label: "1970s", range: [1970, 1979] as [number, number] },
  { label: "1960s", range: [1960, 1969] as [number, number] },
]

const eraPresets = [
  { label: "1980s+", range: [1980, 2025] as [number, number] },
  { label: "1970s+", range: [1970, 2025] as [number, number] },
  { label: "1960s+", range: [1960, 2025] as [number, number] },
]

export function YearRangeFilter({ value, onChange }: YearRangeFilterProps) {
  const isActive = (range: [number, number]) =>
    value[0] === range[0] && value[1] === range[1]

  return (
    <div className="flex gap-1">
      {quickPresets.map((preset) => (
        <Button
          key={preset.label}
          variant={isActive(preset.range) ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(preset.range)}
        >
          {preset.label}
        </Button>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            More <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>By Decade</DropdownMenuLabel>
          {decadePresets.map((preset) => (
            <DropdownMenuItem
              key={preset.label}
              onClick={() => onChange(preset.range)}
              className={isActive(preset.range) ? "bg-accent" : ""}
            >
              {preset.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>By Era</DropdownMenuLabel>
          {eraPresets.map((preset) => (
            <DropdownMenuItem
              key={preset.label}
              onClick={() => onChange(preset.range)}
              className={isActive(preset.range) ? "bg-accent" : ""}
            >
              {preset.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
