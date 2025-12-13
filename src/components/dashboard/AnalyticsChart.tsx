import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { date: "Apr 2", analyses: 186, datasets: 80 },
  { date: "Apr 6", analyses: 305, datasets: 200 },
  { date: "Apr 10", analyses: 237, datasets: 120 },
  { date: "Apr 14", analyses: 173, datasets: 190 },
  { date: "Apr 18", analyses: 209, datasets: 130 },
  { date: "Apr 23", analyses: 214, datasets: 140 },
  { date: "Apr 28", analyses: 186, datasets: 80 },
  { date: "May 3", analyses: 305, datasets: 200 },
  { date: "May 7", analyses: 237, datasets: 120 },
  { date: "May 12", analyses: 273, datasets: 190 },
  { date: "May 17", analyses: 209, datasets: 130 },
  { date: "May 22", analyses: 314, datasets: 240 },
  { date: "May 27", analyses: 186, datasets: 180 },
  { date: "Jun 1", analyses: 305, datasets: 200 },
  { date: "Jun 5", analyses: 237, datasets: 120 },
  { date: "Jun 9", analyses: 173, datasets: 190 },
  { date: "Jun 14", analyses: 309, datasets: 230 },
  { date: "Jun 19", analyses: 214, datasets: 140 },
  { date: "Jun 24", analyses: 286, datasets: 180 },
  { date: "Jun 30", analyses: 305, datasets: 200 },
]

const chartConfig = {
  analyses: {
    label: "Analyses",
    color: "hsl(var(--chart-1))",
  },
  datasets: {
    label: "Datasets",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type TimeRange = "3months" | "30days" | "7days"

export function AnalyticsChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("3months")

  const getFilteredData = () => {
    switch (timeRange) {
      case "7days":
        return chartData.slice(-4)
      case "30days":
        return chartData.slice(-8)
      default:
        return chartData
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Data Processing Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total for the last 3 months
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === "3months" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("3months")}
          >
            Last 3 months
          </Button>
          <Button
            variant={timeRange === "30days" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30days")}
          >
            Last 30 days
          </Button>
          <Button
            variant={timeRange === "7days" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7days")}
          >
            Last 7 days
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={getFilteredData()}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fillAnalyses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-analyses)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-analyses)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDatasets" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-datasets)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-datasets)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="datasets"
              type="natural"
              fill="url(#fillDatasets)"
              fillOpacity={0.4}
              stroke="var(--color-datasets)"
              stackId="a"
            />
            <Area
              dataKey="analyses"
              type="natural"
              fill="url(#fillAnalyses)"
              fillOpacity={0.4}
              stroke="var(--color-analyses)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
