import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "lucide-react"
import type { HistoricalEvent } from "@/lib/amplify-client"

interface EventImpactChartProps {
  events: HistoricalEvent[]
  loading?: boolean
}

const chartConfig = {
  moodMusicAvg: {
    label: "Music Mood",
    color: "hsl(var(--chart-2))",
  },
  moodNewsAvg: {
    label: "News Mood",
    color: "hsl(var(--chart-3))",
  },
  moodCompositeAvg: {
    label: "Overall Mood",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function EventImpactChart({ events, loading }: EventImpactChartProps) {
  const chartData = useMemo(() => {
    return events.map((event) => ({
      name: event.eventLabel,
      fullName: event.eventLabel,
      moodMusicAvg: event.moodMusicAvg ?? 0,
      moodNewsAvg: event.moodNewsAvg ?? 0,
      moodCompositeAvg: event.moodCompositeAvg ?? 0,
    }))
  }, [events])

  const eventStats = useMemo(() => {
    if (chartData.length === 0) return null
    const lowest = chartData.reduce((min, d) =>
      d.moodCompositeAvg < min.moodCompositeAvg ? d : min, chartData[0])
    return { lowestEvent: lowest.fullName, lowestMood: lowest.moodCompositeAvg, eventCount: chartData.length }
  }, [chartData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Impact Comparison</CardTitle>
          <CardDescription>Mood during major historical events</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Impact Comparison</CardTitle>
          <CardDescription>Mood during major historical events</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">No event data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Impact Comparison</CardTitle>
        <CardDescription>
          Average mood scores during major historical events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} layout="vertical" accessibilityLayer>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 1]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={140}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    if (payload?.[0]?.payload?.fullName) {
                      return payload[0].payload.fullName
                    }
                    return ""
                  }}
                  formatter={(value) => (
                    <span className="font-medium">
                      {typeof value === "number" ? value.toFixed(3) : value}
                    </span>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="moodCompositeAvg" fill="var(--color-moodCompositeAvg)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {eventStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Lowest mood during {eventStats.lowestEvent}
            <Calendar className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Across {eventStats.eventCount} historical events
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
