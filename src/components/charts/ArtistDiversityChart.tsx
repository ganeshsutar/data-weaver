import { useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

interface ArtistDiversityChartProps {
  data: MoodMonthly[]
  loading?: boolean
}

const chartConfig = {
  uniqueArtists: {
    label: "Unique Artists",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function ArtistDiversityChart({ data, loading }: ArtistDiversityChartProps) {
  const chartData = useMemo(() => {
    // Aggregate by year
    const yearMap = new Map<number, { artistSum: number; count: number }>()

    data.forEach((item) => {
      if (item.uniqueArtists != null) {
        const existing = yearMap.get(item.year) || { artistSum: 0, count: 0 }
        yearMap.set(item.year, {
          artistSum: existing.artistSum + item.uniqueArtists,
          count: existing.count + 1,
        })
      }
    })

    return Array.from(yearMap.entries())
      .map(([year, { artistSum, count }]) => ({
        year,
        uniqueArtists: artistSum / count,
      }))
      .sort((a, b) => a.year - b.year)
  }, [data])

  const diversityStats = useMemo(() => {
    if (chartData.length < 2) return null
    const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2))
    const secondHalf = chartData.slice(Math.floor(chartData.length / 2))
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.uniqueArtists, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.uniqueArtists, 0) / secondHalf.length
    const change = ((secondAvg - firstAvg) / firstAvg) * 100
    const startYear = chartData[0]?.year || 1958
    const endYear = chartData[chartData.length - 1]?.year || 2025
    return { change, isUp: change >= 0, startYear, endYear }
  }, [chartData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Artist Diversity Over Time</CardTitle>
          <CardDescription>Unique artists on charts per month</CardDescription>
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
        <CardTitle>Artist Diversity Over Time</CardTitle>
        <CardDescription>
          Average number of unique artists on Billboard Hot 100 per month
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
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-medium">
                      {typeof value === "number" ? value.toFixed(1) + " artists" : value}
                    </span>
                  )}
                />
              }
            />
            <Line
              dataKey="uniqueArtists"
              type="monotone"
              stroke="var(--color-uniqueArtists)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {diversityStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Artist diversity {diversityStats.isUp ? "increased" : "decreased"} by {Math.abs(diversityStats.change).toFixed(1)}%
            {diversityStats.isUp ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            {diversityStats.startYear} - {diversityStats.endYear}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
