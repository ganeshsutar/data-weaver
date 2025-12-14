import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Minus, Music, Newspaper, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface PeriodStats {
  yearMonth: string
  moodComposite: number | null
  moodMusic: number | null
  moodNews: number | null
  topSong: string
  topArtist: string
  change: {
    value: number
    trend: "up" | "down" | "stable"
  }
}

interface PeriodStatsCardsProps {
  stats: PeriodStats | null
  loading?: boolean
}

export function PeriodStatsCards({ stats, loading }: PeriodStatsCardsProps) {
  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-[160px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  if (!stats) {
    return null
  }

  const TrendIcon = stats.change.trend === "up" ? TrendingUp : stats.change.trend === "down" ? TrendingDown : Minus

  // Helper to get mood description
  const getMoodDescription = (value: number | null) => {
    if (value === null) return "No data"
    if (value >= 0.55) return "Above average mood"
    if (value >= 0.45) return "Average mood level"
    if (value >= 0.35) return "Below average mood"
    return "Low mood period"
  }

  const cards = [
    {
      title: "Overall Mood",
      value: stats.moodComposite?.toFixed(2) ?? "N/A",
      subtitle: `${stats.change.trend === "up" ? "+" : stats.change.trend === "down" ? "-" : ""}${Math.abs(stats.change.value).toFixed(1)}% vs last month`,
      description: getMoodDescription(stats.moodComposite),
      icon: TrendIcon,
      iconColor: stats.change.trend === "up" ? "text-emerald-500" : stats.change.trend === "down" ? "text-red-500" : "text-muted-foreground",
    },
    {
      title: "Music Happiness",
      value: stats.moodMusic?.toFixed(2) ?? "N/A",
      subtitle: "From Spotify valence (0-1)",
      description: "Measures musical positivity based on audio features",
      icon: Music,
      iconColor: "text-chart-2",
    },
    {
      title: "News Sentiment",
      value: stats.moodNews?.toFixed(2) ?? "N/A",
      subtitle: "From news analysis (0-1)",
      description: "Average sentiment score from news articles",
      icon: Newspaper,
      iconColor: "text-chart-3",
    },
    {
      title: "Top Song",
      value: stats.topSong.length > 20 ? stats.topSong.slice(0, 20) + "..." : stats.topSong,
      subtitle: stats.topArtist,
      description: "Most popular song in this period",
      icon: Trophy,
      iconColor: "text-amber-500",
    },
  ]

  return (
    <>
      {cards.map((card) => (
        <Card key={card.title} className="h-[160px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={cn("h-4 w-4", card.iconColor)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
