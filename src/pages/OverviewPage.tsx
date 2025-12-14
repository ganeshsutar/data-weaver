import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useMoodData } from "@/hooks/useMoodData"
import { useHistoricalEvents } from "@/hooks/useHistoricalEvents"
import { MoodTimelineChart } from "@/components/charts/MoodTimelineChart"
import { MusicNewsComparisonChart } from "@/components/charts/MusicNewsComparisonChart"
import { MoodGauge } from "@/components/charts/MoodGauge"
import { PeriodStatsCards } from "@/components/cards/PeriodStatsCards"
import { EventImpactChart } from "@/components/charts/EventImpactChart"
import { YearRangeFilter } from "@/components/filters/YearRangeFilter"
import { getLatestPeriodStats } from "@/lib/data-transforms"

export function OverviewPage() {
  const [yearRange, setYearRange] = useState<[number, number]>([1958, 2025])
  const { data: moodData, loading: moodLoading } = useMoodData({ yearRange })
  const { data: events, loading: eventsLoading } = useHistoricalEvents()

  const latestStats = getLatestPeriodStats(moodData)
  const loading = moodLoading || eventsLoading

  return (
    <SidebarInset>
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 bg-background/50 backdrop-blur-lg">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold">Overview</h1>
          <YearRangeFilter
            minYear={1958}
            maxYear={2025}
            value={yearRange}
            onChange={setYearRange}
          />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Dataset Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cultural Pulse reveals America's mood through 67 years of music and news. Explore how Billboard chart trends and Spotify audio features align with news sentiment across 351K chart entries, 170K tracks, and 209K articles.
          </p>

          {/* Top row: All stats cards in uniform grid */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <MoodGauge
              value={latestStats?.moodComposite ?? 0}
              loading={loading}
            />
            <PeriodStatsCards stats={latestStats} loading={loading} />
          </div>

          {/* Main timeline chart */}
          <MoodTimelineChart
            data={moodData}
            events={events}
            loading={loading}
          />

          {/* Bottom row: Music vs News + Event Impact */}
          <div className="grid gap-4 lg:grid-cols-2">
            <MusicNewsComparisonChart data={moodData} loading={loading} />
            <EventImpactChart events={events} loading={loading} />
          </div>
        </div>
      </main>
    </SidebarInset>
  )
}
