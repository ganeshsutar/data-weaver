import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { MoodMonthly } from "@/lib/amplify-client"

interface NewsSentimentChartProps {
  data: MoodMonthly[]
  loading?: boolean
}

const chartConfig = {
  sentiment: {
    label: "Sentiment",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function NewsSentimentChart({ data, loading }: NewsSentimentChartProps) {
  const chartData = useMemo(() => {
    // Aggregate by year
    const yearMap = new Map<number, { sentimentSum: number; count: number }>()

    data.forEach((item) => {
      if (item.newsSentimentMean != null) {
        const existing = yearMap.get(item.year) || { sentimentSum: 0, count: 0 }
        yearMap.set(item.year, {
          sentimentSum: existing.sentimentSum + item.newsSentimentMean,
          count: existing.count + 1,
        })
      }
    })

    return Array.from(yearMap.entries())
      .map(([year, { sentimentSum, count }]) => ({
        year,
        sentiment: sentimentSum / count,
      }))
      .sort((a, b) => a.year - b.year)
  }, [data])

  const sentimentStats = useMemo(() => {
    if (chartData.length < 2) return null
    const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2))
    const secondHalf = chartData.slice(Math.floor(chartData.length / 2))
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.sentiment, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.sentiment, 0) / secondHalf.length
    const change = ((secondAvg - firstAvg) / firstAvg) * 100
    const startYear = chartData[0]?.year || 2012
    const endYear = chartData[chartData.length - 1]?.year || 2022
    return { change, isUp: change >= 0, startYear, endYear }
  }, [chartData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>News Sentiment Trend</CardTitle>
          <CardDescription>Average news sentiment over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>News Sentiment Trend</CardTitle>
        <CardDescription>
          Average sentiment score from news articles (0 = negative, 1 = positive)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={chartData} accessibilityLayer>
            <defs>
              <linearGradient id="fillSentiment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sentiment)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-sentiment)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
              domain={[0, 1]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-medium">
                      {typeof value === "number" ? value.toFixed(3) : value}
                    </span>
                  )}
                />
              }
            />
            <Area
              dataKey="sentiment"
              type="monotone"
              fill="url(#fillSentiment)"
              stroke="var(--color-sentiment)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {sentimentStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Sentiment {sentimentStats.isUp ? "improved" : "declined"} by {Math.abs(sentimentStats.change).toFixed(1)}%
            {sentimentStats.isUp ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            {sentimentStats.startYear} - {sentimentStats.endYear}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
