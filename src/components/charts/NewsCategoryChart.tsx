import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { Newspaper } from "lucide-react"
import type { MoodMonthly } from "@/lib/amplify-client"

interface NewsCategoryChartProps {
  data: MoodMonthly[]
  loading?: boolean
  viewMode: "absolute" | "percentage"
}

const chartConfig = {
  politics: {
    label: "Politics",
    color: "hsl(var(--chart-1))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-2))",
  },
  worldNews: {
    label: "World News",
    color: "hsl(var(--chart-3))",
  },
  crime: {
    label: "Crime",
    color: "hsl(var(--chart-4))",
  },
  wellness: {
    label: "Wellness",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function NewsCategoryChart({ data, loading, viewMode }: NewsCategoryChartProps) {
  const chartData = useMemo(() => {
    // Aggregate by year
    const yearMap = new Map<number, {
      politics: number
      entertainment: number
      worldNews: number
      crime: number
      wellness: number
    }>()

    data.forEach((item) => {
      const existing = yearMap.get(item.year) || {
        politics: 0,
        entertainment: 0,
        worldNews: 0,
        crime: 0,
        wellness: 0,
      }
      yearMap.set(item.year, {
        politics: existing.politics + (item.newsPoliticsCount ?? 0),
        entertainment: existing.entertainment + (item.newsEntertainmentCount ?? 0),
        worldNews: existing.worldNews + (item.newsWorldNewsCount ?? 0),
        crime: existing.crime + (item.newsCrimeCount ?? 0),
        wellness: existing.wellness + (item.newsWellnessCount ?? 0),
      })
    })

    return Array.from(yearMap.entries())
      .map(([year, counts]) => {
        const total = counts.politics + counts.entertainment + counts.worldNews + counts.crime + counts.wellness

        if (viewMode === "percentage" && total > 0) {
          return {
            year,
            politics: (counts.politics / total) * 100,
            entertainment: (counts.entertainment / total) * 100,
            worldNews: (counts.worldNews / total) * 100,
            crime: (counts.crime / total) * 100,
            wellness: (counts.wellness / total) * 100,
            total,
          }
        }

        return { year, ...counts, total }
      })
      .filter((item) => item.total > 0) // Only show years with news data
      .sort((a, b) => a.year - b.year)
  }, [data, viewMode])

  const categoryStats = useMemo(() => {
    if (chartData.length === 0) return null
    const totals = chartData.reduce((acc, d) => ({
      politics: acc.politics + (viewMode === "percentage" ? 0 : d.politics),
      entertainment: acc.entertainment + (viewMode === "percentage" ? 0 : d.entertainment),
    }), { politics: 0, entertainment: 0 })
    const dominant = totals.politics > totals.entertainment ? "Politics" : "Entertainment"
    const startYear = chartData[0]?.year || 2012
    const endYear = chartData[chartData.length - 1]?.year || 2022
    return { dominant, startYear, endYear, yearCount: chartData.length }
  }, [chartData, viewMode])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>News Category Distribution</CardTitle>
          <CardDescription>Category breakdown over time</CardDescription>
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
        <CardTitle>News Category Distribution</CardTitle>
        <CardDescription>
          {viewMode === "percentage" ? "Percentage" : "Count"} of news articles by category over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData} accessibilityLayer stackOffset={viewMode === "percentage" ? "expand" : "none"}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                viewMode === "percentage" ? `${(value * 100).toFixed(0)}%` : value.toLocaleString()
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-medium">
                      {typeof value === "number"
                        ? viewMode === "percentage"
                          ? `${value.toFixed(1)}%`
                          : value.toLocaleString()
                        : value}
                    </span>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="politics"
              type="monotone"
              fill="var(--color-politics)"
              stroke="var(--color-politics)"
              stackId="1"
              fillOpacity={0.6}
            />
            <Area
              dataKey="entertainment"
              type="monotone"
              fill="var(--color-entertainment)"
              stroke="var(--color-entertainment)"
              stackId="1"
              fillOpacity={0.6}
            />
            <Area
              dataKey="worldNews"
              type="monotone"
              fill="var(--color-worldNews)"
              stroke="var(--color-worldNews)"
              stackId="1"
              fillOpacity={0.6}
            />
            <Area
              dataKey="crime"
              type="monotone"
              fill="var(--color-crime)"
              stroke="var(--color-crime)"
              stackId="1"
              fillOpacity={0.6}
            />
            <Area
              dataKey="wellness"
              type="monotone"
              fill="var(--color-wellness)"
              stroke="var(--color-wellness)"
              stackId="1"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {categoryStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {categoryStats.dominant} dominated news coverage
            <Newspaper className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            {categoryStats.startYear} - {categoryStats.endYear}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
