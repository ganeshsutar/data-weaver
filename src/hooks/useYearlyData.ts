import { useState, useEffect, useCallback } from "react"
import { client, type MoodYearly } from "@/lib/amplify-client"

interface UseYearlyDataOptions {
  decade?: number
}

interface YearlyDataResult {
  data: MoodYearly[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useYearlyData(options?: UseYearlyDataOptions): YearlyDataResult {
  const [data, setData] = useState<MoodYearly[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let response

      if (options?.decade) {
        // Use secondary index for decade filtering
        response = await client.models.MoodYearly.listByDecade({
          decade: options.decade,
        })
      } else {
        // Fetch all yearly data (small dataset ~68 records)
        response = await client.models.MoodYearly.list({
          limit: 100,
        })
      }

      const yearlyData = response.data || []
      // Sort by year
      yearlyData.sort((a, b) => a.year - b.year)
      setData(yearlyData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch yearly data"))
    } finally {
      setLoading(false)
    }
  }, [options?.decade])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
