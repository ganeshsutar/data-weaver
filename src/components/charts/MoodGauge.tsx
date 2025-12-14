import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Gauge } from "lucide-react"

interface MoodGaugeProps {
  value: number
  loading?: boolean
}

export function MoodGauge({ value, loading }: MoodGaugeProps) {
  if (loading) {
    return (
      <Card className="h-[160px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  const percentage = Math.round((value ?? 0) * 100)
  const getMoodLevel = (pct: number) => {
    if (pct >= 55) return "Above Average"
    if (pct >= 45) return "Average"
    if (pct >= 35) return "Below Average"
    return "Low"
  }

  return (
    <Card className="h-[160px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current Mood</CardTitle>
        <Gauge className="h-4 w-4 text-chart-1" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {percentage}<span className="text-lg text-muted-foreground">/100</span>
        </div>
        <p className="text-xs text-muted-foreground">{getMoodLevel(percentage)}</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Composite score from music and news
        </p>
      </CardContent>
    </Card>
  )
}
