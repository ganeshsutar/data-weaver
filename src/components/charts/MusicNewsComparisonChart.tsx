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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { MoodMonthly } from "@/lib/amplify-client"
import { aggregateToYearly } from "@/lib/data-transforms"

interface MusicNewsComparisonChartProps {
  data: MoodMonthly[]
  loading?: boolean
}

const chartConfig = {
  avgMoodMusic: {
    label: "Music Mood",
    color: "hsl(var(--chart-2))",
  },
  avgMoodNews: {
    label: "News Mood",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function MusicNewsComparisonChart({ data, loading }: MusicNewsComparisonChartProps) {
  const chartData = useMemo(() => {
    return aggregateToYearly(data)
  }, [data])

  const comparisonStats = useMemo(() => {
    if (chartData.length === 0) return null
    const avgMusic = chartData.reduce((sum, d) => sum + (d.avgMoodMusic || 0), 0) / chartData.length
    const avgNews = chartData.reduce((sum, d) => sum + (d.avgMoodNews || 0), 0) / chartData.length
    const diff = ((avgMusic - avgNews) / avgNews) * 100
    const startYear = chartData[0]?.year || 1958
    const endYear = chartData[chartData.length - 1]?.year || 2025
    return { diff, musicHigher: avgMusic > avgNews, startYear, endYear }
  }, [chartData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Music vs News Mood</CardTitle>
          <CardDescription>Comparing sentiment from both sources</CardDescription>
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
        <CardTitle>Music vs News Mood</CardTitle>
        <CardDescription>
          Yearly comparison of music happiness and news sentiment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={chartData} accessibilityLayer>
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
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="avgMoodMusic"
              type="monotone"
              stroke="var(--color-avgMoodMusic)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="avgMoodNews"
              type="monotone"
              stroke="var(--color-avgMoodNews)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {comparisonStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Music mood {Math.abs(comparisonStats.diff).toFixed(1)}% {comparisonStats.musicHigher ? "higher" : "lower"} than news
            {comparisonStats.musicHigher ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            {comparisonStats.startYear} - {comparisonStats.endYear}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
