import { useMemo } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ReferenceLine, ZAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles } from "lucide-react"
import type { MoodMonthly } from "@/lib/amplify-client"

interface EnergyValenceQuadrantProps {
  data: MoodMonthly[]
  loading?: boolean
}

const chartConfig = {
  point: {
    label: "Data Point",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function EnergyValenceQuadrant({ data, loading }: EnergyValenceQuadrantProps) {
  const chartData = useMemo(() => {
    // Aggregate by decade for cleaner visualization
    const decadeMap = new Map<number, { valenceSum: number; energySum: number; count: number }>()

    data.forEach((item) => {
      const decade = Math.floor(item.year / 10) * 10
      const valence = item.spotifyValenceMean ?? item.spotifyYearlyValence
      const energy = item.spotifyEnergyMean ?? item.spotifyYearlyEnergy

      if (valence != null && energy != null) {
        const existing = decadeMap.get(decade) || { valenceSum: 0, energySum: 0, count: 0 }
        decadeMap.set(decade, {
          valenceSum: existing.valenceSum + valence,
          energySum: existing.energySum + energy,
          count: existing.count + 1,
        })
      }
    })

    return Array.from(decadeMap.entries())
      .map(([decade, { valenceSum, energySum, count }]) => ({
        decade,
        label: `${decade}s`,
        valence: valenceSum / count,
        energy: energySum / count,
        z: count, // Size based on data points
      }))
      .sort((a, b) => a.decade - b.decade)
  }, [data])

  const quadrantStats = useMemo(() => {
    if (chartData.length === 0) return null
    const happiest = chartData.reduce((max, d) =>
      (d.valence + d.energy) > (max.valence + max.energy) ? d : max, chartData[0])
    const decadeRange = chartData.length > 0
      ? `${chartData[0].label} - ${chartData[chartData.length - 1].label}`
      : ""
    return { happiestDecade: happiest.label, decadeRange, decadeCount: chartData.length }
  }, [chartData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Energy vs Valence</CardTitle>
          <CardDescription>Mood quadrant by decade</CardDescription>
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
        <CardTitle>Energy vs Valence Quadrant</CardTitle>
        <CardDescription>
          Music mood by decade - High energy + high valence = happy energetic music
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ScatterChart accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="valence"
              name="Valence"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 1]}
              label={{ value: "Valence (Happiness)", position: "bottom", offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="energy"
              name="Energy"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 1]}
              label={{ value: "Energy", angle: -90, position: "insideLeft" }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 400]} />
            <ReferenceLine x={0.5} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <ReferenceLine y={0.5} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(_value, _name, item) => {
                    const payload = item.payload
                    return (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{payload.label}</span>
                        <span>Valence: {payload.valence.toFixed(3)}</span>
                        <span>Energy: {payload.energy.toFixed(3)}</span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Scatter
              data={chartData}
              fill="var(--color-point)"
              shape="circle"
            />
          </ScatterChart>
        </ChartContainer>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="text-right">Sad & Calm</div>
          <div>Sad & Energetic</div>
          <div className="text-right">Happy & Calm</div>
          <div>Happy & Energetic</div>
        </div>
      </CardContent>
      {quadrantStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {quadrantStats.happiestDecade} had the happiest, most energetic music
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Across {quadrantStats.decadeCount} decades
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
