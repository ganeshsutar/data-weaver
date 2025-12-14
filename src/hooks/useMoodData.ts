import { useState, useEffect, useCallback, useMemo } from "react"
import { client, type MoodMonthly } from "@/lib/amplify-client"

interface UseMoodDataOptions {
  yearRange?: [number, number]
  limit?: number
}

interface MoodDataResult {
  data: MoodMonthly[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

// Cache for the full dataset
let cachedData: MoodMonthly[] | null = null
let cachePromise: Promise<MoodMonthly[]> | null = null

async function fetchAllData(limit?: number): Promise<MoodMonthly[]> {
  // Return cached data if available
  if (cachedData) return cachedData

  // If fetch is in progress, wait for it
  if (cachePromise) return cachePromise

  // Start new fetch
  cachePromise = (async () => {
    const allData: MoodMonthly[] = []
    let nextToken: string | null | undefined = undefined

    // Fetch first page
    const firstResponse = await client.models.MoodMonthly.list({
      limit: limit || 1000,
    })

    if (firstResponse.data) {
      allData.push(...firstResponse.data)
    }
    nextToken = firstResponse.nextToken

    // Fetch remaining pages
    while (nextToken) {
      const response = await client.models.MoodMonthly.list({
        limit: limit || 1000,
        nextToken,
      })

      if (response.data) {
        allData.push(...response.data)
      }
      nextToken = response.nextToken
    }

    // Sort by yearMonth
    allData.sort((a, b) => a.yearMonth.localeCompare(b.yearMonth))

    cachedData = allData
    return allData
  })()

  return cachePromise
}

export function useMoodData(options?: UseMoodDataOptions): MoodDataResult {
  const [allData, setAllData] = useState<MoodMonthly[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Extract filter options
  const startYear = options?.yearRange?.[0]
  const endYear = options?.yearRange?.[1]
  const limit = options?.limit

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchAllData(limit)
      setAllData(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch mood data"))
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter data based on year range (instant, no refetch needed)
  const filteredData = useMemo(() => {
    if (startYear === undefined || endYear === undefined) {
      return allData
    }
    return allData.filter((item) => item.year >= startYear && item.year <= endYear)
  }, [allData, startYear, endYear])

  const refetch = useCallback(async () => {
    // Clear cache to force refetch
    cachedData = null
    cachePromise = null
    await fetchData()
  }, [fetchData])

  return { data: filteredData, loading, error, refetch }
}
