import { useMemo } from "react"
import { Pie, PieChart, Cell } from "recharts"
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
import { PieChartIcon } from "lucide-react"
import type { MoodMonthly } from "@/lib/amplify-client"

interface CategoryPieChartProps {
  data: MoodMonthly[]
  loading?: boolean
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const chartConfig = {
  politics: { label: "Politics", color: COLORS[0] },
  entertainment: { label: "Entertainment", color: COLORS[1] },
  worldNews: { label: "World News", color: COLORS[2] },
  crime: { label: "Crime", color: COLORS[3] },
  wellness: { label: "Wellness", color: COLORS[4] },
} satisfies ChartConfig

export function CategoryPieChart({ data, loading }: CategoryPieChartProps) {
  const chartData = useMemo(() => {
    // Aggregate totals across all data
    const totals = {
      politics: 0,
      entertainment: 0,
      worldNews: 0,
      crime: 0,
      wellness: 0,
    }

    data.forEach((item) => {
      totals.politics += item.newsPoliticsCount ?? 0
      totals.entertainment += item.newsEntertainmentCount ?? 0
      totals.worldNews += item.newsWorldNewsCount ?? 0
      totals.crime += item.newsCrimeCount ?? 0
      totals.wellness += item.newsWellnessCount ?? 0
    })

    return [
      { name: "politics", value: totals.politics, fill: COLORS[0] },
      { name: "entertainment", value: totals.entertainment, fill: COLORS[1] },
      { name: "worldNews", value: totals.worldNews, fill: COLORS[2] },
      { name: "crime", value: totals.crime, fill: COLORS[3] },
      { name: "wellness", value: totals.wellness, fill: COLORS[4] },
    ].filter((item) => item.value > 0)
  }, [data])

  const total = useMemo(() => chartData.reduce((sum, item) => sum + item.value, 0), [chartData])

  const pieStats = useMemo(() => {
    if (chartData.length === 0) return null
    const largest = chartData.reduce((max, d) => d.value > max.value ? d : max, chartData[0])
    const percentage = total > 0 ? ((largest.value / total) * 100).toFixed(1) : "0"
    return { largestCategory: chartConfig[largest.name as keyof typeof chartConfig]?.label || largest.name, percentage, total }
  }, [chartData, total])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Total news by category</CardDescription>
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
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>
          Total distribution of news articles by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <PieChart accessibilityLayer>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                    const percentage = ((value as number) / total * 100).toFixed(1)
                    return (
                      <span className="font-medium">
                        {(value as number).toLocaleString()} ({percentage}%)
                      </span>
                    )
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {pieStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {pieStats.largestCategory} leads with {pieStats.percentage}%
            <PieChartIcon className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            {pieStats.total.toLocaleString()} total articles
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
