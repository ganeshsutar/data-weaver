import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useMoodData } from "@/hooks/useMoodData"
import { useHistoricalEvents } from "@/hooks/useHistoricalEvents"
import { EventSelector } from "@/components/filters/EventSelector"
import { BeforeDuringAfterChart } from "@/components/charts/BeforeDuringAfterChart"
import { CrisisRecoveryChart } from "@/components/charts/CrisisRecoveryChart"
import { MoodHeatmap } from "@/components/charts/MoodHeatmap"
import { getEventPeriodData } from "@/lib/data-transforms"

export function EventsPage() {
  const { data: moodData, loading: moodLoading } = useMoodData()
  const { data: events, loading: eventsLoading } = useHistoricalEvents()
  const [selectedEventCode, setSelectedEventCode] = useState<string | null>(null)

  const loading = moodLoading || eventsLoading

  const selectedEvent = events.find((e) => e.eventCode === selectedEventCode) ?? events[0]
  const eventPeriodData = selectedEvent ? getEventPeriodData(moodData, selectedEvent) : null

  return (
    <SidebarInset>
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 bg-background/50 backdrop-blur-lg">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold">Events & Comparisons</h1>
          <EventSelector
            events={events}
            selectedCode={selectedEventCode ?? events[0]?.eventCode}
            onChange={setSelectedEventCode}
          />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-6">
          {/* Before/During/After chart for selected event */}
          <BeforeDuringAfterChart
            eventData={eventPeriodData}
            loading={loading}
          />

          {/* Crisis recovery comparison */}
          <CrisisRecoveryChart events={events} moodData={moodData} loading={loading} />

          {/* Monthly mood heatmap */}
          <MoodHeatmap data={moodData} events={events} loading={loading} />
        </div>
      </main>
    </SidebarInset>
  )
}
