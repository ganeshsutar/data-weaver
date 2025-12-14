import { useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import type { HistoricalEvent, MoodMonthly } from "@/lib/amplify-client"
import { getEventPeriodData } from "@/lib/data-transforms"

interface CrisisRecoveryChartProps {
  events: HistoricalEvent[]
  moodData: MoodMonthly[]
  loading?: boolean
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function CrisisRecoveryChart({ events, moodData, loading }: CrisisRecoveryChartProps) {
  const chartData = useMemo(() => {
    if (events.length === 0 || moodData.length === 0) return { data: [], config: {} }

    // Get event period data for each event
    const eventPeriods = events.map((event) => getEventPeriodData(moodData, event))

    // Normalize each event's trajectory to start from 0
    // Create a common timeline (months from event start)
    const maxMonths = Math.max(
      ...eventPeriods.map((ep) => ep.before.length + ep.during.length + ep.after.length)
    )

    const normalizedData: Array<Record<string, number | string>> = []

    for (let i = 0; i < maxMonths; i++) {
      const point: Record<string, number | string> = { monthIndex: i }

      eventPeriods.forEach((ep) => {
        const allData = [...ep.before, ...ep.during, ...ep.after]
        if (i < allData.length) {
          const baseline = allData[0]?.moodComposite ?? 0.5
          const current = allData[i]?.moodComposite ?? baseline
          // Normalize: difference from baseline
          point[ep.event.eventCode] = current - baseline
        }
      })

      normalizedData.push(point)
    }

    // Build config
    const config: ChartConfig = {}
    events.forEach((event, idx) => {
      config[event.eventCode] = {
        label: event.eventLabel.slice(0, 20),
        color: COLORS[idx % COLORS.length],
      }
    })

    return { data: normalizedData, config }
  }, [events, moodData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crisis Recovery Comparison</CardTitle>
          <CardDescription>Normalized mood recovery patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crisis Recovery Comparison</CardTitle>
          <CardDescription>Normalized mood recovery patterns</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">No events available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crisis Recovery Comparison</CardTitle>
        <CardDescription>
          Normalized mood change from event start (0 = baseline)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartData.config} className="h-[250px] w-full">
          <LineChart data={chartData.data} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="monthIndex"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}mo`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-medium">
                      {typeof value === "number" ? (value >= 0 ? "+" : "") + value.toFixed(3) : value}
                    </span>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {events.map((event, idx) => (
              <Line
                key={event.eventCode}
                dataKey={event.eventCode}
                type="monotone"
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
