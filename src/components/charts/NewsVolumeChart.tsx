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
import { BarChart3 } from "lucide-react"
import type { MoodMonthly } from "@/lib/amplify-client"

interface NewsVolumeChartProps {
  data: MoodMonthly[]
  loading?: boolean
}

const chartConfig = {
  articleCount: {
    label: "Articles",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function NewsVolumeChart({ data, loading }: NewsVolumeChartProps) {
  const chartData = useMemo(() => {
    // Aggregate by year
    const yearMap = new Map<number, number>()

    data.forEach((item) => {
      const existing = yearMap.get(item.year) || 0
      yearMap.set(item.year, existing + (item.newsArticleCount ?? 0))
    })

    return Array.from(yearMap.entries())
      .map(([year, articleCount]) => ({ year, articleCount }))
      .filter((item) => item.articleCount > 0) // Only show years with news data
      .sort((a, b) => a.year - b.year)
  }, [data])

  const volumeStats = useMemo(() => {
    if (chartData.length === 0) return null
    const total = chartData.reduce((sum, d) => sum + d.articleCount, 0)
    const peak = chartData.reduce((max, d) => d.articleCount > max.articleCount ? d : max, chartData[0])
    const startYear = chartData[0]?.year || 2012
    const endYear = chartData[chartData.length - 1]?.year || 2022
    return { total, peakYear: peak.year, peakCount: peak.articleCount, startYear, endYear }
  }, [chartData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>News Volume Timeline</CardTitle>
          <CardDescription>Total articles per year</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>News Volume Timeline</CardTitle>
        <CardDescription>
          Total number of news articles analyzed per year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData} accessibilityLayer>
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
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-medium">
                      {(value as number).toLocaleString()} articles
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="articleCount"
              fill="var(--color-articleCount)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {volumeStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Peak in {volumeStats.peakYear} with {volumeStats.peakCount.toLocaleString()} articles
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            {volumeStats.startYear} - {volumeStats.endYear}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
