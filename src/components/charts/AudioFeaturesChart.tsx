import { useMemo, useState } from "react"
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
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { MoodMonthly } from "@/lib/amplify-client"
import { aggregateToYearly } from "@/lib/data-transforms"

interface AudioFeaturesChartProps {
  data: MoodMonthly[]
  loading?: boolean
}

const features = [
  { key: "valence", label: "Valence (Happiness)", color: "hsl(var(--chart-1))" },
  { key: "energy", label: "Energy", color: "hsl(var(--chart-2))" },
  { key: "danceability", label: "Danceability", color: "hsl(var(--chart-3))" },
] as const

type FeatureKey = typeof features[number]["key"]

const chartConfig: ChartConfig = {
  valence: { label: "Valence", color: "hsl(var(--chart-1))" },
  energy: { label: "Energy", color: "hsl(var(--chart-2))" },
  danceability: { label: "Danceability", color: "hsl(var(--chart-3))" },
}

export function AudioFeaturesChart({ data, loading }: AudioFeaturesChartProps) {
  const [activeFeatures, setActiveFeatures] = useState<Set<FeatureKey>>(
    new Set(["valence", "energy"])
  )

  const chartData = useMemo(() => {
    const yearly = aggregateToYearly(data)
    return yearly.map((item) => {
      // Find corresponding monthly data to get audio features
      const yearData = data.filter((d) => d.year === item.year)
      const validValence = yearData.filter((d) => d.spotifyValenceMean != null || d.spotifyYearlyValence != null)
      const validEnergy = yearData.filter((d) => d.spotifyEnergyMean != null || d.spotifyYearlyEnergy != null)
      const validDanceability = yearData.filter((d) => d.spotifyDanceabilityMean != null || d.spotifyYearlyDanceability != null)

      return {
        year: item.year,
        valence: validValence.length > 0
          ? validValence.reduce((sum, d) => sum + (d.spotifyValenceMean ?? d.spotifyYearlyValence ?? 0), 0) / validValence.length
          : null,
        energy: validEnergy.length > 0
          ? validEnergy.reduce((sum, d) => sum + (d.spotifyEnergyMean ?? d.spotifyYearlyEnergy ?? 0), 0) / validEnergy.length
          : null,
        danceability: validDanceability.length > 0
          ? validDanceability.reduce((sum, d) => sum + (d.spotifyDanceabilityMean ?? d.spotifyYearlyDanceability ?? 0), 0) / validDanceability.length
          : null,
      }
    })
  }, [data])

  const audioStats = useMemo(() => {
    if (chartData.length < 2) return null
    const validData = chartData.filter(d => d.valence != null)
    if (validData.length < 2) return null
    const firstHalf = validData.slice(0, Math.floor(validData.length / 2))
    const secondHalf = validData.slice(Math.floor(validData.length / 2))
    const firstAvg = firstHalf.reduce((sum, d) => sum + (d.valence || 0), 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, d) => sum + (d.valence || 0), 0) / secondHalf.length
    const change = ((secondAvg - firstAvg) / firstAvg) * 100
    const startYear = validData[0]?.year || 1958
    const endYear = validData[validData.length - 1]?.year || 2020
    return { change, isUp: change >= 0, startYear, endYear }
  }, [chartData])

  const toggleFeature = (feature: FeatureKey) => {
    setActiveFeatures((prev) => {
      const next = new Set(prev)
      if (next.has(feature)) {
        if (next.size > 1) next.delete(feature)
      } else {
        next.add(feature)
      }
      return next
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audio Features Over Time</CardTitle>
          <CardDescription>Spotify audio features trends</CardDescription>
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Audio Features Over Time</CardTitle>
            <CardDescription>
              Spotify audio feature trends by year
            </CardDescription>
          </div>
          <div className="flex gap-1 flex-wrap">
            {features.map((feature) => (
              <Button
                key={feature.key}
                variant={activeFeatures.has(feature.key) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFeature(feature.key)}
                style={{
                  backgroundColor: activeFeatures.has(feature.key) ? feature.color : undefined,
                  borderColor: feature.color,
                }}
              >
                {feature.label.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
            {activeFeatures.has("valence") && (
              <Line
                dataKey="valence"
                type="monotone"
                stroke="var(--color-valence)"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            )}
            {activeFeatures.has("energy") && (
              <Line
                dataKey="energy"
                type="monotone"
                stroke="var(--color-energy)"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            )}
            {activeFeatures.has("danceability") && (
              <Line
                dataKey="danceability"
                type="monotone"
                stroke="var(--color-danceability)"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
      {audioStats && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Valence {audioStats.isUp ? "increased" : "decreased"} by {Math.abs(audioStats.change).toFixed(1)}% over time
            {audioStats.isUp ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            {audioStats.startYear} - {audioStats.endYear}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
