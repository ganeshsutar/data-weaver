import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
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
import { TrendingUp, TrendingDown } from "lucide-react"
import type { MoodMonthly, HistoricalEvent } from "@/lib/amplify-client"
import { transformForTimeline, formatYearMonth } from "@/lib/data-transforms"

interface MoodTimelineChartProps {
  data: MoodMonthly[]
  events: HistoricalEvent[]
  loading?: boolean
}

const chartConfig = {
  moodComposite: {
    label: "Overall Mood",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function MoodTimelineChart({ data, events, loading }: MoodTimelineChartProps) {
  const chartData = useMemo(() => {
    const timelineData = transformForTimeline(data)
    // Sample data for performance if too many points
    if (timelineData.length > 200) {
      const step = Math.ceil(timelineData.length / 200)
      return timelineData.filter((_, i) => i % step === 0)
    }
    return timelineData
  }, [data])

  const trendStats = useMemo(() => {
    if (chartData.length < 2) return null
    const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2))
    const secondHalf = chartData.slice(Math.floor(chartData.length / 2))
    const firstAvg = firstHalf.reduce((sum, d) => sum + (d.moodComposite || 0), 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, d) => sum + (d.moodComposite || 0), 0) / secondHalf.length
    const change = ((secondAvg - firstAvg) / firstAvg) * 100
    const startYear = chartData[0]?.yearMonth?.split("-")[0] || "1958"
    const endYear = chartData[chartData.length - 1]?.yearMonth?.split("-")[0] || "2025"
    return { change, isUp: change >= 0, startYear, endYear }
  }, [chartData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood Over Time</CardTitle>
          <CardDescription>Composite mood score from 1958-2025</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Over Time</CardTitle>
        <CardDescription>
          Composite mood score derived from music and news sentiment (1958-2025)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData} accessibilityLayer>
            <defs>
              <linearGradient id="fillMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-moodComposite)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-moodComposite)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="yearMonth"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const year = value.split("-")[0]
                return year
              }}
              interval="preserveStartEnd"
              minTickGap={50}
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
            {/* Event reference lines */}
            {events.slice(0, 5).map((event) => (
              <ReferenceLine
                key={event.eventCode}
                x={event.startDate}
                stroke="hsl(var(--chart-4))"
                strokeDasharray="3 3"
                label={{
                  value: event.eventLabel.slice(0, 15),
                  position: "top",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                }}
              />
            ))}
            <Area
              dataKey="moodComposite"
              type="monotone"
              fill="url(#fillMood)"
              stroke="var(--color-moodComposite)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {trendStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending {trendStats.isUp ? "up" : "down"} by {Math.abs(trendStats.change).toFixed(1)}% over this period
            {trendStats.isUp ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            {trendStats.startYear} - {trendStats.endYear}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
