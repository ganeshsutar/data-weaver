import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp } from "lucide-react"
import type { MoodYearly } from "@/lib/amplify-client"

interface TempoTrendChartProps {
  data: MoodYearly[]
  loading?: boolean
}

const chartConfig = {
  avgWeeksOnChart: {
    label: "Avg Weeks on Chart",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function TempoTrendChart({ data, loading }: TempoTrendChartProps) {
  const chartData = useMemo(() => {
    // Group by decade
    const decadeMap = new Map<number, { weeksSum: number; count: number }>()

    data.forEach((item) => {
      const decade = item.decade ?? Math.floor(item.year / 10) * 10
      if (item.avgWeeksOnChart != null) {
        const existing = decadeMap.get(decade) || { weeksSum: 0, count: 0 }
        decadeMap.set(decade, {
          weeksSum: existing.weeksSum + item.avgWeeksOnChart,
          count: existing.count + 1,
        })
      }
    })

    return Array.from(decadeMap.entries())
      .map(([decade, { weeksSum, count }]) => ({
        decade: `${decade}s`,
        avgWeeksOnChart: weeksSum / count,
      }))
      .sort((a, b) => a.decade.localeCompare(b.decade))
  }, [data])

  const longevityStats = useMemo(() => {
    if (chartData.length === 0) return null
    const longest = chartData.reduce((max, d) =>
      d.avgWeeksOnChart > max.avgWeeksOnChart ? d : max, chartData[0])
    const decadeRange = chartData.length > 0
      ? `${chartData[0].decade} - ${chartData[chartData.length - 1].decade}`
      : ""
    return { longestDecade: longest.decade, longestWeeks: longest.avgWeeksOnChart, decadeRange }
  }, [chartData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chart Longevity by Decade</CardTitle>
          <CardDescription>Average weeks on Billboard chart</CardDescription>
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
        <CardTitle>Chart Longevity by Decade</CardTitle>
        <CardDescription>
          Average weeks songs stayed on Billboard Hot 100
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="decade"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-medium">
                      {typeof value === "number" ? value.toFixed(1) + " weeks" : value}
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="avgWeeksOnChart"
              fill="var(--color-avgWeeksOnChart)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {longevityStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {longevityStats.longestDecade} had longest chart stays ({longevityStats.longestWeeks.toFixed(1)} weeks)
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            {longevityStats.decadeRange}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
