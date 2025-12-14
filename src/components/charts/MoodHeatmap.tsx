import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { MoodMonthly, HistoricalEvent } from "@/lib/amplify-client"
import { cn } from "@/lib/utils"

interface MoodHeatmapProps {
  data: MoodMonthly[]
  events: HistoricalEvent[]
  loading?: boolean
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function getMoodColor(value: number | null): string {
  if (value === null) return "bg-muted"
  // Scale from red (low) to green (high)
  if (value < 0.3) return "bg-red-500/70"
  if (value < 0.4) return "bg-orange-500/70"
  if (value < 0.5) return "bg-yellow-500/70"
  if (value < 0.6) return "bg-lime-500/70"
  return "bg-green-500/70"
}

export function MoodHeatmap({ data, events, loading }: MoodHeatmapProps) {
  const heatmapData = useMemo(() => {
    // Build a map of yearMonth -> mood value
    const moodMap = new Map<string, number>()
    data.forEach((item) => {
      if (item.moodComposite != null) {
        moodMap.set(item.yearMonth, item.moodComposite)
      }
    })

    // Get year range
    const years = [...new Set(data.map((d) => d.year))].sort((a, b) => b - a)

    // Build event markers
    const eventSet = new Set<string>()
    events.forEach((event) => {
      const startYear = parseInt(event.startDate.split("-")[0])
      const endYear = parseInt(event.endDate.split("-")[0])
      for (let y = startYear; y <= endYear; y++) {
        const startMonth = y === startYear ? parseInt(event.startDate.split("-")[1]) : 1
        const endMonth = y === endYear ? parseInt(event.endDate.split("-")[1]) : 12
        for (let m = startMonth; m <= endMonth; m++) {
          eventSet.add(`${y}-${String(m).padStart(2, "0")}`)
        }
      }
    })

    return { years: years.slice(0, 30), moodMap, eventSet } // Limit to recent 30 years
  }, [data, events])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Mood Heatmap</CardTitle>
          <CardDescription>Year-by-year mood patterns revealing long-term cultural shifts</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Mood Heatmap</CardTitle>
        <CardDescription>
          Year-by-year mood patterns revealing long-term cultural shifts. Green indicates higher collective mood,
          red shows periods of lower sentiment like the 2020-2022 pandemic era. Gray cells indicate missing data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header row with months */}
            <div className="flex gap-1 mb-1">
              <div className="w-12 text-xs text-muted-foreground"></div>
              {MONTHS.map((month) => (
                <div key={month} className="w-8 text-center text-xs text-muted-foreground">
                  {month}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {heatmapData.years.map((year) => (
              <div key={year} className="flex gap-1 mb-1">
                <div className="w-12 text-xs text-muted-foreground flex items-center">
                  {year}
                </div>
                {MONTHS.map((_, monthIdx) => {
                  const yearMonth = `${year}-${String(monthIdx + 1).padStart(2, "0")}`
                  const value = heatmapData.moodMap.get(yearMonth) ?? null
                  const isEvent = heatmapData.eventSet.has(yearMonth)

                  return (
                    <div
                      key={yearMonth}
                      className={cn(
                        "w-8 h-6 rounded-sm transition-colors",
                        getMoodColor(value),
                        isEvent && "ring-1 ring-amber-500 ring-dashed"
                      )}
                      title={`${yearMonth}: ${value?.toFixed(3) ?? "N/A"}`}
                    />
                  )
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span>Low</span>
              <div className="flex gap-1">
                <div className="w-6 h-4 rounded-sm bg-red-500/70" />
                <div className="w-6 h-4 rounded-sm bg-orange-500/70" />
                <div className="w-6 h-4 rounded-sm bg-yellow-500/70" />
                <div className="w-6 h-4 rounded-sm bg-lime-500/70" />
                <div className="w-6 h-4 rounded-sm bg-green-500/70" />
              </div>
              <span>High</span>
              <div className="flex items-center gap-1 ml-4">
                <div className="w-6 h-4 rounded-sm bg-muted ring-1 ring-amber-500 ring-dashed" />
                <span>Event period</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
