import { useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { EventPeriodData } from "@/lib/data-transforms"
import { formatYearMonth } from "@/lib/data-transforms"

interface BeforeDuringAfterChartProps {
  eventData: EventPeriodData | null
  loading?: boolean
}

const chartConfig = {
  moodComposite: {
    label: "Overall Mood",
    color: "hsl(var(--chart-1))",
  },
  moodMusic: {
    label: "Music Mood",
    color: "hsl(var(--chart-2))",
  },
  moodNews: {
    label: "News Mood",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function BeforeDuringAfterChart({ eventData, loading }: BeforeDuringAfterChartProps) {
  const chartData = useMemo(() => {
    if (!eventData) return []

    const allData = [
      ...eventData.before.map((d) => ({ ...d, phase: "before" })),
      ...eventData.during.map((d) => ({ ...d, phase: "during" })),
      ...eventData.after.map((d) => ({ ...d, phase: "after" })),
    ]

    return allData.map((item) => ({
      yearMonth: item.yearMonth,
      moodComposite: item.moodComposite,
      moodMusic: item.moodMusic,
      moodNews: item.moodNews,
      phase: item.phase,
    }))
  }, [eventData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Mood Trajectory</CardTitle>
          <CardDescription>Before, during, and after the event</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!eventData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Mood Trajectory</CardTitle>
          <CardDescription>Select an event to view its trajectory</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No event selected</p>
        </CardContent>
      </Card>
    )
  }

  const eventStart = eventData.event.startDate
  const eventEnd = eventData.event.endDate

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Mood Trajectory: {eventData.event.eventLabel}</CardTitle>
        <CardDescription>
          Mood scores before, during ({eventStart} to {eventEnd}), and after the event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="yearMonth"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const [year, month] = value.split("-")
                return `${month}/${year.slice(2)}`
              }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 1]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatYearMonth(value)}
                  formatter={(value) => (
                    <span className="font-medium">
                      {typeof value === "number" ? value.toFixed(3) : value}
                    </span>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {/* Event boundary lines */}
            <ReferenceLine
              x={eventStart}
              stroke="hsl(var(--chart-4))"
              strokeWidth={2}
              label={{ value: "Start", position: "top", fill: "hsl(var(--foreground))" }}
            />
            <ReferenceLine
              x={eventEnd}
              stroke="hsl(var(--chart-4))"
              strokeWidth={2}
              label={{ value: "End", position: "top", fill: "hsl(var(--foreground))" }}
            />
            <Line
              dataKey="moodComposite"
              type="monotone"
              stroke="var(--color-moodComposite)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              dataKey="moodMusic"
              type="monotone"
              stroke="var(--color-moodMusic)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              dataKey="moodNews"
              type="monotone"
              stroke="var(--color-moodNews)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
