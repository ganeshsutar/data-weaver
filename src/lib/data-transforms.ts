import type { MoodMonthly, HistoricalEvent } from "./amplify-client"

// Helper to safely parse JSON fields that might be strings or already parsed
function parseJsonArray(value: unknown): string[] | null {
  if (!value) return null
  if (Array.isArray(value)) return value
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value.replace(/'/g, '"'))
      return Array.isArray(parsed) ? parsed : null
    } catch {
      return null
    }
  }
  return null
}

// Timeline data point for charts
export interface TimelineDataPoint {
  yearMonth: string
  year: number
  month: number
  moodComposite: number | null
  moodMusic: number | null
  moodNews: number | null
  spotifyValence: number | null
  spotifyEnergy: number | null
  spotifyDanceability: number | null
  newsSentiment: number | null
  historicalEvent?: string
}

// Heatmap data structure (year x month matrix)
export interface HeatmapData {
  years: number[]
  months: number[]
  values: Map<string, number> // key: "YYYY-MM", value: mood score
}

// Yearly aggregate for summary charts
export interface YearlyAggregate {
  year: number
  decade: number
  avgMoodComposite: number
  avgMoodMusic: number
  avgMoodNews: number
  avgValence: number
  avgEnergy: number
  totalNewsArticles: number
  totalSpotifyTracks: number
}

// Event period data for before/during/after charts
export interface EventPeriodData {
  event: HistoricalEvent
  before: MoodMonthly[]
  during: MoodMonthly[]
  after: MoodMonthly[]
}

// Transform monthly data for timeline charts
export function transformForTimeline(data: MoodMonthly[]): TimelineDataPoint[] {
  return data.map((item) => ({
    yearMonth: item.yearMonth,
    year: item.year,
    month: item.month,
    moodComposite: item.moodComposite ?? null,
    moodMusic: item.moodMusic ?? null,
    moodNews: item.moodNews ?? null,
    spotifyValence: item.spotifyValenceMean ?? item.spotifyYearlyValence ?? null,
    spotifyEnergy: item.spotifyEnergyMean ?? item.spotifyYearlyEnergy ?? null,
    spotifyDanceability: item.spotifyDanceabilityMean ?? item.spotifyYearlyDanceability ?? null,
    newsSentiment: item.newsSentimentMean ?? null,
    historicalEvent: item.historicalEvent ?? undefined,
  }))
}

// Transform for heatmap (year x month matrix)
export function transformForHeatmap(data: MoodMonthly[]): HeatmapData {
  const years = [...new Set(data.map((d) => d.year))].sort((a, b) => a - b)
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const values = new Map<string, number>()

  data.forEach((item) => {
    if (item.moodComposite !== null && item.moodComposite !== undefined) {
      values.set(item.yearMonth, item.moodComposite)
    }
  })

  return { years, months, values }
}

// Aggregate monthly to yearly for certain charts
export function aggregateToYearly(data: MoodMonthly[]): YearlyAggregate[] {
  const yearlyMap = new Map<number, MoodMonthly[]>()

  data.forEach((item) => {
    const existing = yearlyMap.get(item.year) || []
    existing.push(item)
    yearlyMap.set(item.year, existing)
  })

  return Array.from(yearlyMap.entries())
    .map(([year, items]) => {
      const validMoodComposite = items.filter((i) => i.moodComposite != null)
      const validMoodMusic = items.filter((i) => i.moodMusic != null)
      const validMoodNews = items.filter((i) => i.moodNews != null)
      const validValence = items.filter((i) => i.spotifyValenceMean != null || i.spotifyYearlyValence != null)
      const validEnergy = items.filter((i) => i.spotifyEnergyMean != null || i.spotifyYearlyEnergy != null)

      return {
        year,
        decade: Math.floor(year / 10) * 10,
        avgMoodComposite:
          validMoodComposite.length > 0
            ? validMoodComposite.reduce((sum, i) => sum + (i.moodComposite ?? 0), 0) / validMoodComposite.length
            : 0,
        avgMoodMusic:
          validMoodMusic.length > 0
            ? validMoodMusic.reduce((sum, i) => sum + (i.moodMusic ?? 0), 0) / validMoodMusic.length
            : 0,
        avgMoodNews:
          validMoodNews.length > 0
            ? validMoodNews.reduce((sum, i) => sum + (i.moodNews ?? 0), 0) / validMoodNews.length
            : 0,
        avgValence:
          validValence.length > 0
            ? validValence.reduce((sum, i) => sum + (i.spotifyValenceMean ?? i.spotifyYearlyValence ?? 0), 0) /
              validValence.length
            : 0,
        avgEnergy:
          validEnergy.length > 0
            ? validEnergy.reduce((sum, i) => sum + (i.spotifyEnergyMean ?? i.spotifyYearlyEnergy ?? 0), 0) /
              validEnergy.length
            : 0,
        totalNewsArticles: items.reduce((sum, i) => sum + (i.newsArticleCount ?? 0), 0),
        totalSpotifyTracks: items.reduce((sum, i) => sum + (i.spotifyTrackCount ?? 0), 0),
      }
    })
    .sort((a, b) => a.year - b.year)
}

// Filter data by year range
export function filterByYearRange(data: MoodMonthly[], range: [number, number]): MoodMonthly[] {
  const [startYear, endYear] = range
  return data.filter((item) => item.year >= startYear && item.year <= endYear)
}

// Get data for specific event period
export function getEventPeriodData(data: MoodMonthly[], event: HistoricalEvent): EventPeriodData {
  const startDate = event.startDate
  const endDate = event.endDate
  const durationMonths = event.durationMonths ?? 12

  // Calculate before period (same duration as event)
  const startDateObj = new Date(`${startDate}-01`)
  const beforeStart = new Date(startDateObj)
  beforeStart.setMonth(beforeStart.getMonth() - durationMonths)
  const beforeStartStr = `${beforeStart.getFullYear()}-${String(beforeStart.getMonth() + 1).padStart(2, "0")}`

  // Calculate after period (same duration as event)
  const endDateObj = new Date(`${endDate}-01`)
  const afterEnd = new Date(endDateObj)
  afterEnd.setMonth(afterEnd.getMonth() + durationMonths)
  const afterEndStr = `${afterEnd.getFullYear()}-${String(afterEnd.getMonth() + 1).padStart(2, "0")}`

  const before = data.filter((item) => item.yearMonth >= beforeStartStr && item.yearMonth < startDate)
  const during = data.filter((item) => item.yearMonth >= startDate && item.yearMonth <= endDate)
  const after = data.filter((item) => item.yearMonth > endDate && item.yearMonth <= afterEndStr)

  return { event, before, during, after }
}

// Format year-month for display
export function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-")
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

// Get decade label
export function getDecadeLabel(decade: number): string {
  return `${decade}s`
}

// Calculate percentage change
export function calculateChange(current: number, previous: number): { value: number; trend: "up" | "down" | "stable" } {
  if (previous === 0) return { value: 0, trend: "stable" }
  const change = ((current - previous) / previous) * 100
  return {
    value: Math.abs(change),
    trend: change > 0.5 ? "up" : change < -0.5 ? "down" : "stable",
  }
}

// Get latest period stats (finds latest valid value for each metric)
export function getLatestPeriodStats(data: MoodMonthly[]): {
  yearMonth: string
  moodComposite: number | null
  moodMusic: number | null
  moodNews: number | null
  topSong: string
  topArtist: string
  change: { value: number; trend: "up" | "down" | "stable" }
} | null {
  if (data.length === 0) return null

  // Find latest record with valid moodComposite (for overall stats)
  let latestCompositeIndex = -1
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].moodComposite != null) {
      latestCompositeIndex = i
      break
    }
  }

  // If no valid composite found, fall back to last record
  if (latestCompositeIndex === -1) {
    latestCompositeIndex = data.length - 1
  }

  const latestComposite = data[latestCompositeIndex]

  // Find latest record with valid moodMusic (Spotify data ends earlier)
  let latestMoodMusic: number | null = null
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].moodMusic != null) {
      latestMoodMusic = data[i].moodMusic ?? null
      break
    }
  }

  // Find latest record with valid moodNews
  let latestMoodNews: number | null = null
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].moodNews != null) {
      latestMoodNews = data[i].moodNews ?? null
      break
    }
  }

  // Find previous month with valid data for comparison
  let previousMonth: MoodMonthly | null = null
  for (let i = latestCompositeIndex - 1; i >= 0; i--) {
    if (data[i].moodComposite != null) {
      previousMonth = data[i]
      break
    }
  }

  const topSongs = parseJsonArray(latestComposite.topSongs)
  const topArtists = parseJsonArray(latestComposite.topArtists)

  return {
    yearMonth: latestComposite.yearMonth,
    moodComposite: latestComposite.moodComposite ?? null,
    moodMusic: latestMoodMusic,
    moodNews: latestMoodNews,
    topSong: topSongs?.[0] ?? "N/A",
    topArtist: topArtists?.[0] ?? "N/A",
    change: previousMonth
      ? calculateChange(latestComposite.moodComposite ?? 0, previousMonth.moodComposite ?? 0)
      : { value: 0, trend: "stable" as const },
  }
}
