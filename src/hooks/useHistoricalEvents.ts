import { useState, useEffect, useCallback } from "react"
import { client, type HistoricalEvent } from "@/lib/amplify-client"

interface HistoricalEventsResult {
  data: HistoricalEvent[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useHistoricalEvents(): HistoricalEventsResult {
  const [data, setData] = useState<HistoricalEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch all events (small dataset ~8 records)
      const response = await client.models.HistoricalEvent.list({
        limit: 50,
      })

      const events = response.data || []
      // Sort by start date
      events.sort((a, b) => a.startDate.localeCompare(b.startDate))
      setData(events)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch historical events"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
