import { generateClient } from "aws-amplify/data"
import type { Schema } from "../../amplify/data/resource"

export const client = generateClient<Schema>()

// Re-export types for convenience
export type MoodMonthly = Schema["MoodMonthly"]["type"]
export type MoodYearly = Schema["MoodYearly"]["type"]
export type HistoricalEvent = Schema["HistoricalEvent"]["type"]
export type DashboardMetadata = Schema["DashboardMetadata"]["type"]
