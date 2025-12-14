import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { HistoricalEvent } from "@/lib/amplify-client"

interface EventSelectorProps {
  events: HistoricalEvent[]
  selectedCode: string | undefined
  onChange: (code: string) => void
}

export function EventSelector({ events, selectedCode, onChange }: EventSelectorProps) {
  if (events.length === 0) {
    return null
  }

  return (
    <Select value={selectedCode} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select event" />
      </SelectTrigger>
      <SelectContent>
        {events.map((event) => (
          <SelectItem key={event.eventCode} value={event.eventCode}>
            {event.eventLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
