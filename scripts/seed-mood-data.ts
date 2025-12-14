import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read amplify_outputs.json to get configuration
const amplifyOutputsPath = path.join(__dirname, "..", "amplify_outputs.json");
if (!fs.existsSync(amplifyOutputsPath)) {
  console.error(
    "amplify_outputs.json not found. Please run 'npx ampx sandbox' first."
  );
  process.exit(1);
}

const amplifyOutputs = JSON.parse(fs.readFileSync(amplifyOutputsPath, "utf-8"));
const region = amplifyOutputs.data?.aws_region || "ap-south-1";

// Initialize DynamoDB client
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

// List all DynamoDB tables to find the correct names
async function listTables(): Promise<string[]> {
  const response = await client.send(new ListTablesCommand({}));
  return response.TableNames || [];
}

// Find table name that matches the model name pattern
function findTableName(tables: string[], modelName: string): string | null {
  // Look for table names that start with the model name
  const matching = tables.filter((t) => t.startsWith(`${modelName}-`));
  if (matching.length === 1) {
    return matching[0];
  } else if (matching.length > 1) {
    // Prefer tables without "NONE" (production) or with "NONE" (sandbox)
    const sandbox = matching.find((t) => t.includes("-NONE"));
    return sandbox || matching[0];
  }
  return null;
}


// Parse Python-style array strings: "['item1', 'item2']" -> ["item1", "item2"]
function parseArrayField(value: string): string[] | null {
  if (!value || value === "" || value === "nan") return null;
  try {
    // Convert Python-style to JSON: ['a', 'b'] -> ["a", "b"]
    const jsonStr = value.replace(/'/g, '"');
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// Parse numeric field, returning null for empty/NaN values
function parseFloat(value: string): number | null {
  if (!value || value === "" || value === "nan" || value === "NaN") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

function parseInt(value: string): number | null {
  if (!value || value === "" || value === "nan" || value === "NaN") return null;
  const num = Number(value);
  return isNaN(num) ? null : Math.floor(num);
}

// Transform monthly CSV row to DynamoDB item
function transformMonthlyRow(row: Record<string, string>): Record<string, any> {
  return {
    yearMonth: row.year_month,
    year: parseInt(row.year),
    month: parseInt(row.month),

    // Billboard
    billboardEntries: parseInt(row.billboard_entries),
    avgChartRank: parseFloat(row.avg_chart_rank),
    avgWeeksOnChart: parseFloat(row.avg_weeks_on_chart),
    uniqueArtists: parseInt(row.unique_artists),
    topSongs: parseArrayField(row.top_songs),
    topArtists: parseArrayField(row.top_artists),

    // Spotify means
    spotifyValenceMean: parseFloat(row.spotify_valence_mean),
    spotifyEnergyMean: parseFloat(row.spotify_energy_mean),
    spotifyDanceabilityMean: parseFloat(row.spotify_danceability_mean),
    spotifyAcousticnessMean: parseFloat(row.spotify_acousticness_mean),
    spotifyInstrumentalnessMean: parseFloat(row.spotify_instrumentalness_mean),
    spotifyLoudnessMean: parseFloat(row.spotify_loudness_mean),
    spotifyTempoMean: parseFloat(row.spotify_tempo_mean),
    spotifySpeechinessMean: parseFloat(row.spotify_speechiness_mean),
    spotifyPopularityMean: parseFloat(row.spotify_popularity_mean),
    spotifyTrackCount: parseInt(row.spotify_track_count),

    // Spotify std devs
    spotifyValenceStd: parseFloat(row.spotify_valence_std),
    spotifyEnergyStd: parseFloat(row.spotify_energy_std),
    spotifyDanceabilityStd: parseFloat(row.spotify_danceability_std),
    spotifyAcousticnessStd: parseFloat(row.spotify_acousticness_std),
    spotifyInstrumentalnessStd: parseFloat(row.spotify_instrumentalness_std),
    spotifyLoudnessStd: parseFloat(row.spotify_loudness_std),
    spotifyTempoStd: parseFloat(row.spotify_tempo_std),
    spotifySpeechinessStd: parseFloat(row.spotify_speechiness_std),
    spotifyPopularityStd: parseFloat(row.spotify_popularity_std),

    // Spotify yearly fallbacks
    spotifyYearlyValence: parseFloat(row.spotify_yearly_valence),
    spotifyYearlyEnergy: parseFloat(row.spotify_yearly_energy),
    spotifyYearlyDanceability: parseFloat(row.spotify_yearly_danceability),
    spotifyYearlyAcousticness: parseFloat(row.spotify_yearly_acousticness),
    spotifyYearlyTempo: parseFloat(row.spotify_yearly_tempo),
    spotifyYearlyPopularity: parseFloat(row.spotify_yearly_popularity),

    // News
    newsArticleCount: parseInt(row.news_article_count),
    newsSentimentMean: parseFloat(row.news_sentiment_mean),
    newsSentimentStd: parseFloat(row.news_sentiment_std),
    topNewsCategories: parseArrayField(row.top_news_categories),
    newsPoliticsCount: parseInt(row.news_politics_count),
    newsEntertainmentCount: parseInt(row.news_entertainment_count),
    newsComedyCount: parseInt(row.news_comedy_count),
    newsCrimeCount: parseInt(row.news_crime_count),
    newsWorldNewsCount: parseInt(row.news_world_news_count),
    newsWellnessCount: parseInt(row.news_wellness_count),

    // Mood
    moodMusic: parseFloat(row.mood_music),
    moodNews: parseFloat(row.mood_news),
    moodComposite: parseFloat(row.mood_composite),
    historicalEvent: row.historical_event || null,

    // Amplify system fields
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Transform yearly CSV row to DynamoDB item
function transformYearlyRow(row: Record<string, string>): Record<string, any> {
  const year = parseInt(row.year);
  const decade = year ? Math.floor(year / 10) * 10 : null;

  return {
    yearId: row.year, // String ID for DynamoDB
    year: year,
    decade: decade,
    decadeLabel: decade ? `${decade}s` : null,
    totalBillboardEntries: parseInt(row.total_billboard_entries),
    avgUniqueArtistsMonthly: parseFloat(row.avg_unique_artists_monthly),
    avgWeeksOnChart: parseFloat(row.avg_weeks_on_chart),
    avgMoodComposite: parseFloat(row.avg_mood_composite),
    avgMoodMusic: parseFloat(row.avg_mood_music),
    avgMoodNews: parseFloat(row.avg_mood_news),
    totalNewsArticles: parseInt(row.total_news_articles),
    totalSpotifyTracks: parseInt(row.total_spotify_tracks),
    events: row.events || null,

    // Amplify system fields
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Transform event from JSON to DynamoDB item
function transformEvent(event: any): Record<string, any> {
  return {
    eventCode: event.event_code,
    eventLabel: event.event_label,
    startDate: event.start_date,
    endDate: event.end_date,
    durationMonths: event.duration_months,
    moodMusicAvg: event.mood_music_avg,
    moodNewsAvg: event.mood_news_avg,
    moodCompositeAvg: event.mood_composite_avg,
    moodMusicStd: event.mood_music_std,
    moodNewsStd: event.mood_news_std,
    moodCompositeStd: event.mood_composite_std,
    vsBaselineMusic: event.vs_baseline_music,
    vsBaselineNews: event.vs_baseline_news,
    vsBaselineComposite: event.vs_baseline_composite,
    trajectory: event.trajectory,

    // Amplify system fields
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Batch write items to DynamoDB (25 items per batch max)
async function batchWriteItems(
  tableName: string,
  items: Record<string, any>[]
): Promise<void> {
  const BATCH_SIZE = 25;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const writeRequests = batch.map((item) => ({
      PutRequest: { Item: item },
    }));

    const params: BatchWriteCommandInput = {
      RequestItems: {
        [tableName]: writeRequests,
      },
    };

    try {
      await docClient.send(new BatchWriteCommand(params));
      console.log(
        `  Wrote batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} items)`
      );
    } catch (error) {
      console.error(`  Error writing batch to ${tableName}:`, error);
      throw error;
    }
  }
}

// Main seed function
async function seedData(): Promise<void> {
  const datasetsPath = path.join(__dirname, "..", "datasets");

  console.log("Starting data seeding...\n");
  console.log(`Region: ${region}`);
  console.log(`Datasets path: ${datasetsPath}\n`);

  // List all DynamoDB tables to find the correct names
  console.log("Discovering DynamoDB tables...");
  const allTables = await listTables();
  console.log(`Found ${allTables.length} tables in region ${region}`);

  // Find tables for our models
  const modelNames = [
    "MoodMonthly",
    "MoodYearly",
    "HistoricalEvent",
    "DashboardMetadata",
  ];
  const tableMap: Record<string, string> = {};

  for (const modelName of modelNames) {
    const tableName = findTableName(allTables, modelName);
    if (tableName) {
      tableMap[modelName] = tableName;
      console.log(`  ${modelName} -> ${tableName}`);
    } else {
      console.log(`  ${modelName} -> NOT FOUND`);
    }
  }

  // Check if all tables exist
  const missingTables = modelNames.filter((m) => !tableMap[m]);
  if (missingTables.length > 0) {
    console.error(`\nError: Missing tables for models: ${missingTables.join(", ")}`);
    console.error("\nPlease ensure you have:");
    console.error("1. Updated amplify/data/resource.ts with the new models");
    console.error("2. Run 'npx ampx sandbox' and waited for deployment to complete");
    console.error("\nAvailable tables in region:");
    allTables.forEach((t) => console.error(`  - ${t}`));
    process.exit(1);
  }

  console.log("\nAll tables found. Starting data seeding...\n");

  const getFullTableName = (modelName: string) => tableMap[modelName];

  // 1. Seed MoodMonthly
  console.log("1. Seeding MoodMonthly...");
  const monthlyPath = path.join(datasetsPath, "mood_dataset_monthly.csv");
  const monthlyCSV = fs.readFileSync(monthlyPath, "utf-8");
  const monthlyRows = parse(monthlyCSV, { columns: true, skip_empty_lines: true });
  const monthlyItems = monthlyRows.map(transformMonthlyRow);
  console.log(`   Parsed ${monthlyItems.length} monthly records`);

  try {
    await batchWriteItems(getFullTableName("MoodMonthly"), monthlyItems);
    console.log(`   Successfully seeded MoodMonthly\n`);
  } catch (error) {
    console.error("   Failed to seed MoodMonthly:", error);
  }

  // 2. Seed MoodYearly
  console.log("2. Seeding MoodYearly...");
  const yearlyPath = path.join(datasetsPath, "mood_dataset_yearly.csv");
  const yearlyCSV = fs.readFileSync(yearlyPath, "utf-8");
  const yearlyRows = parse(yearlyCSV, { columns: true, skip_empty_lines: true });
  const yearlyItems = yearlyRows.map(transformYearlyRow);
  console.log(`   Parsed ${yearlyItems.length} yearly records`);

  try {
    await batchWriteItems(getFullTableName("MoodYearly"), yearlyItems);
    console.log(`   Successfully seeded MoodYearly\n`);
  } catch (error) {
    console.error("   Failed to seed MoodYearly:", error);
  }

  // 3. Seed HistoricalEvent
  console.log("3. Seeding HistoricalEvent...");
  const eventsPath = path.join(
    datasetsPath,
    "dashboard",
    "events_comparison.json"
  );
  const eventsData = JSON.parse(fs.readFileSync(eventsPath, "utf-8"));
  const eventItems = eventsData.events.map(transformEvent);
  console.log(`   Parsed ${eventItems.length} events`);

  try {
    await batchWriteItems(getFullTableName("HistoricalEvent"), eventItems);
    console.log(`   Successfully seeded HistoricalEvent\n`);
  } catch (error) {
    console.error("   Failed to seed HistoricalEvent:", error);
  }

  // 4. Seed DashboardMetadata
  console.log("4. Seeding DashboardMetadata...");
  const metadataPath = path.join(datasetsPath, "dashboard", "metadata.json");
  const correlationPath = path.join(
    datasetsPath,
    "dashboard",
    "correlation_matrix.json"
  );

  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  const correlationMatrix = JSON.parse(
    fs.readFileSync(correlationPath, "utf-8")
  );

  const now = new Date().toISOString();
  const metadataItems = [
    {
      metadataType: "date_range",
      data: metadata.date_range,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      metadataType: "data_sources",
      data: metadata.data_sources,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      metadataType: "mood_metrics",
      data: metadata.mood_metrics,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      metadataType: "events_list",
      data: metadata.events,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      metadataType: "completeness_by_year",
      data: metadata.completeness_by_year,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      metadataType: "correlation_matrix",
      data: correlationMatrix,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      metadataType: "baseline",
      data: eventsData.baseline,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now,
    },
  ];
  console.log(`   Prepared ${metadataItems.length} metadata records`);

  try {
    await batchWriteItems(getFullTableName("DashboardMetadata"), metadataItems);
    console.log(`   Successfully seeded DashboardMetadata\n`);
  } catch (error) {
    console.error("   Failed to seed DashboardMetadata:", error);
  }

  console.log("Seeding complete!");
  console.log("\nSummary:");
  console.log(`  - MoodMonthly: ${monthlyItems.length} records`);
  console.log(`  - MoodYearly: ${yearlyItems.length} records`);
  console.log(`  - HistoricalEvent: ${eventItems.length} records`);
  console.log(`  - DashboardMetadata: ${metadataItems.length} records`);
}

// Run the seed
seedData().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
