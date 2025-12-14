import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Monthly mood data (809 records, 1958-2025)
  MoodMonthly: a
    .model({
      yearMonth: a.string().required(), // "YYYY-MM" format - Primary identifier
      year: a.integer().required(),
      month: a.integer().required(),

      // Billboard metrics
      billboardEntries: a.integer(),
      avgChartRank: a.float(),
      avgWeeksOnChart: a.float(),
      uniqueArtists: a.integer(),
      topSongs: a.json(), // Array of strings
      topArtists: a.json(), // Array of strings

      // Spotify audio features (means)
      spotifyValenceMean: a.float(),
      spotifyEnergyMean: a.float(),
      spotifyDanceabilityMean: a.float(),
      spotifyAcousticnessMean: a.float(),
      spotifyInstrumentalnessMean: a.float(),
      spotifyLoudnessMean: a.float(),
      spotifyTempoMean: a.float(),
      spotifySpeechinessMean: a.float(),
      spotifyPopularityMean: a.float(),
      spotifyTrackCount: a.integer(),

      // Spotify audio features (standard deviations)
      spotifyValenceStd: a.float(),
      spotifyEnergyStd: a.float(),
      spotifyDanceabilityStd: a.float(),
      spotifyAcousticnessStd: a.float(),
      spotifyInstrumentalnessStd: a.float(),
      spotifyLoudnessStd: a.float(),
      spotifyTempoStd: a.float(),
      spotifySpeechinessStd: a.float(),
      spotifyPopularityStd: a.float(),

      // Spotify yearly fallbacks (used when monthly data unavailable)
      spotifyYearlyValence: a.float(),
      spotifyYearlyEnergy: a.float(),
      spotifyYearlyDanceability: a.float(),
      spotifyYearlyAcousticness: a.float(),
      spotifyYearlyTempo: a.float(),
      spotifyYearlyPopularity: a.float(),

      // News metrics
      newsArticleCount: a.integer(),
      newsSentimentMean: a.float(),
      newsSentimentStd: a.float(),
      topNewsCategories: a.json(), // Dict: {"POLITICS": 100, ...}
      newsPoliticsCount: a.integer(),
      newsEntertainmentCount: a.integer(),
      newsComedyCount: a.integer(),
      newsCrimeCount: a.integer(),
      newsWorldNewsCount: a.integer(),
      newsWellnessCount: a.integer(),

      // Composite mood indicators (0-1 scale)
      moodMusic: a.float(),
      moodNews: a.float(),
      moodComposite: a.float(),

      // Historical event marker
      historicalEvent: a.string(),
    })
    .identifier(["yearMonth"])
    .secondaryIndexes((index) => [
      index("year").sortKeys(["month"]).queryField("listByYear"),
    ])
    .authorization((allow) => [allow.authenticated().to(["read"])]),

  // Yearly mood summaries (68 records, 1958-2025)
  MoodYearly: a
    .model({
      yearId: a.string().required(), // Year as string for identifier
      year: a.integer().required(),
      decade: a.integer(),
      decadeLabel: a.string(),

      // Billboard aggregates
      totalBillboardEntries: a.integer(),
      avgUniqueArtistsMonthly: a.float(),
      avgWeeksOnChart: a.float(),

      // Mood aggregates
      avgMoodComposite: a.float(),
      avgMoodMusic: a.float(),
      avgMoodNews: a.float(),

      // Volume metrics
      totalNewsArticles: a.integer(),
      totalSpotifyTracks: a.integer(),

      // Events (comma-separated codes)
      events: a.string(),
    })
    .identifier(["yearId"])
    .secondaryIndexes((index) => [index("decade").queryField("listByDecade")])
    .authorization((allow) => [allow.authenticated().to(["read"])]),

  // Historical events (8 major events)
  HistoricalEvent: a
    .model({
      eventCode: a.string().required(), // e.g., "covid_pandemic_peak"
      eventLabel: a.string().required(),
      startDate: a.string().required(), // "YYYY-MM"
      endDate: a.string().required(),
      durationMonths: a.integer(),

      // Mood metrics during event
      moodMusicAvg: a.float(),
      moodNewsAvg: a.float(),
      moodCompositeAvg: a.float(),
      moodMusicStd: a.float(),
      moodNewsStd: a.float(),
      moodCompositeStd: a.float(),

      // Comparison to baseline
      vsBaselineMusic: a.float(),
      vsBaselineNews: a.float(),
      vsBaselineComposite: a.float(),

      // Trajectory data (before/during/after)
      trajectory: a.json(),
    })
    .identifier(["eventCode"])
    .authorization((allow) => [allow.authenticated().to(["read"])]),

  // Dashboard metadata and precomputed data
  DashboardMetadata: a
    .model({
      metadataType: a.string().required(), // "date_range", "correlation_matrix", etc.
      data: a.json().required(),
      lastUpdated: a.datetime(),
    })
    .identifier(["metadataType"])
    .authorization((allow) => [allow.authenticated().to(["read"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
