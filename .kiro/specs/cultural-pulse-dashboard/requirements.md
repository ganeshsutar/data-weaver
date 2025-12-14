# Requirements Document

## Introduction

Cultural Pulse is a data visualization dashboard that reveals America's cultural mood through 67 years (1958-2025) of integrated music and news data. The system combines 351,134 Billboard chart entries, 170,653 Spotify audio feature tracks, and 209,527 HuffPost news articles into a unified dataset of 809 monthly mood records spanning nearly seven decades. The dashboard enables users to explore correlations between musical characteristics, news sentiment, and historical events through interactive visualizations and temporal analysis.

## Glossary

- **Cultural_Pulse_Dashboard**: The complete web application for cultural mood visualization and temporal analysis
- **MoodMonthly**: Primary dataset containing 809 monthly records (1958-2025) with Billboard, Spotify, and news metrics
- **MoodYearly**: Yearly summary dataset with 68 records providing decade-level aggregations
- **HistoricalEvent**: Major cultural events (8 records) with before/during/after mood trajectory data
- **DashboardMetadata**: Precomputed analytics including correlation matrices and date range summaries
- **Mood_Composite**: Normalized 0-1 score combining music mood and news sentiment
- **Mood_Music**: Derived metric from Spotify audio features (valence, energy, danceability)
- **Mood_News**: Normalized news sentiment score (0-1 scale, derived from -1 to +1 sentiment)
- **Spotify_Audio_Features**: Spotify track metrics including valence, energy, danceability, acousticness, instrumentalness, speechiness, tempo, loudness, and popularity
- **News_Categories**: Six HuffPost article categories (Politics, Entertainment, Comedy, Crime, World News, Wellness)
- **Billboard_Metrics**: Chart performance data including rank, weeks on chart, unique artists, and top songs/artists
- **Theme_System**: Customizable UI theming with 5 styles, 11 colors, 4 base colors, 4 radius options, 4 fonts, and light/dark modes
- **AWS_Amplify_Gen2**: Serverless backend infrastructure using Cognito, AppSync, and DynamoDB
- **AppSync_GraphQL**: AWS AppSync API providing type-safe GraphQL queries for MoodMonthly, MoodYearly, HistoricalEvent, and DashboardMetadata
- **Year_Range_Filter**: UI component allowing users to select start and end years (1958-2025) for data filtering

## Requirements

### Requirement 1

**User Story:** As a cultural researcher, I want to view a comprehensive mood timeline from 1958-2025 with event annotations, so that I can identify long-term cultural trends and the impact of historical events.

#### Acceptance Criteria

1. WHEN a user accesses the Overview page, THE Cultural_Pulse_Dashboard SHALL display a MoodTimelineChart showing Mood_Composite across all available years with reference lines marking HistoricalEvent occurrences
2. WHEN viewing the timeline, THE Cultural_Pulse_Dashboard SHALL render three MoodGauge components displaying current Mood_Composite, Mood_Music, and Mood_News as radial gauge indicators
3. WHEN filtering by Year_Range_Filter, THE Cultural_Pulse_Dashboard SHALL update the MoodTimelineChart and statistics cards to reflect only data within the selected period
4. WHEN displaying summary statistics, THE Cultural_Pulse_Dashboard SHALL show period stats cards with latest mood values, top songs, top artists, and month-over-month change indicators
5. WHEN viewing event impact, THE Cultural_Pulse_Dashboard SHALL display EventImpactChart comparing baseline mood levels to mood during each of the 8 HistoricalEvent periods

### Requirement 2

**User Story:** As a music historian, I want to analyze Spotify_Audio_Features over time, so that I can understand how musical characteristics have evolved across seven decades.

#### Acceptance Criteria

1. WHEN a user navigates to the Music Insights page, THE Cultural_Pulse_Dashboard SHALL display AudioFeaturesChart with multi-line trends for valence, energy, danceability, acousticness, tempo, and popularity
2. WHEN viewing the Energy-Valence quadrant, THE Cultural_Pulse_Dashboard SHALL plot monthly data points in an EnergyValenceQuadrant scatter chart divided into four emotional zones (calm/sad, energetic/happy, calm/happy, energetic/sad)
3. WHEN examining tempo evolution, THE Cultural_Pulse_Dashboard SHALL show TempoTrendChart grouped by decade with average BPM values
4. WHEN analyzing artist diversity, THE Cultural_Pulse_Dashboard SHALL display ArtistDiversityChart showing unique artist counts over time from Billboard_Metrics
5. WHEN Spotify_Audio_Features monthly data is unavailable for early years, THE Cultural_Pulse_Dashboard SHALL fall back to yearly aggregates to ensure continuous visualization

### Requirement 3

**User Story:** As a journalist, I want to view news sentiment trends and category distributions, so that I can understand media focus and public mood shifts over time.

#### Acceptance Criteria

1. WHEN accessing the News Analysis page, THE Cultural_Pulse_Dashboard SHALL display NewsCategoryChart with stacked area visualization of the six News_Categories (Politics, Entertainment, Comedy, Crime, World News, Wellness)
2. WHEN toggling view modes, THE Cultural_Pulse_Dashboard SHALL switch between absolute article counts and percentage distribution displays in NewsCategoryChart
3. WHEN viewing sentiment analysis, THE Cultural_Pulse_Dashboard SHALL show NewsSentimentChart with Mood_News trends and standard deviation bands
4. WHEN examining category distribution, THE Cultural_Pulse_Dashboard SHALL display CategoryPieChart showing the proportion of articles in each News_Categories for the selected time period
5. WHEN analyzing article volume, THE Cultural_Pulse_Dashboard SHALL show NewsVolumeChart with total article counts per month across all News_Categories

### Requirement 4

**User Story:** As a sociologist, I want to compare mood changes before, during, and after major historical events, so that I can measure cultural impact and recovery patterns.

#### Acceptance Criteria

1. WHEN selecting a HistoricalEvent from the event selector dropdown, THE Cultural_Pulse_Dashboard SHALL display BeforeDuringAfterChart with equal-duration pre/during/post periods showing Mood_Composite, Mood_Music, and Mood_News for the selected event
2. WHEN viewing all events simultaneously, THE Cultural_Pulse_Dashboard SHALL show CrisisRecoveryChart comparing normalized mood trajectories across all 8 HistoricalEvent records to identify common recovery patterns
3. WHEN examining the heatmap, THE Cultural_Pulse_Dashboard SHALL display MoodHeatmap with month-by-year Mood_Composite values using a color scale and visual markers for HistoricalEvent periods
4. WHEN analyzing event context, THE Cultural_Pulse_Dashboard SHALL show baseline comparison percentages indicating how much mood changed during each HistoricalEvent relative to normal periods
5. WHEN no event is selected, THE Cultural_Pulse_Dashboard SHALL default to showing aggregate statistics across all HistoricalEvent records

### Requirement 5

**User Story:** As a user, I want to customize the dashboard appearance, so that I can personalize my viewing experience and optimize readability for different contexts.

#### Acceptance Criteria

1. WHEN accessing the theme settings, THE Cultural_Pulse_Dashboard SHALL provide Theme_System options for style selection among 5 choices (Vega, Nova, Mala, Lyra, Mira) with distinct spacing and layout characteristics
2. WHEN changing theme colors, THE Cultural_Pulse_Dashboard SHALL offer 11 accent color schemes (Neutral, Amber, Blue, Cyan, Emerald, Fuchsia, Green, Indigo, Lime, Orange, Pink) with 4 base color options (Neutral, Stone, Zinc, Gray)
3. WHEN toggling light/dark mode, THE Cultural_Pulse_Dashboard SHALL update all UI components and charts to reflect the selected mode and persist the preference to localStorage
4. WHEN selecting border radius, THE Cultural_Pulse_Dashboard SHALL apply the chosen radius setting (None, Small, Medium, Large) to all card and button components
5. WHEN changing fonts, THE Cultural_Pulse_Dashboard SHALL dynamically load the selected Google Font (Inter, Noto Sans, Nunito Sans, Figtree) and apply it system-wide

### Requirement 6

**User Story:** As any user, I want data to load efficiently with client-side caching and instant filtering, so that I experience fast page transitions and responsive interactions.

#### Acceptance Criteria

1. WHEN fetching MoodMonthly data for the first time, THE Cultural_Pulse_Dashboard SHALL retrieve all 809 records via AppSync_GraphQL, cache them in memory, and use pagination to handle DynamoDB list operations with nextToken
2. WHEN switching pages or navigating, THE Cultural_Pulse_Dashboard SHALL reuse cached MoodMonthly data without refetching from AWS_Amplify_Gen2 backend
3. WHEN filtering by Year_Range_Filter, THE Cultural_Pulse_Dashboard SHALL filter cached MoodMonthly data instantly on the client side without triggering new AppSync_GraphQL queries
4. WHEN data is loading, THE Cultural_Pulse_Dashboard SHALL display skeleton loading states for charts and statistics cards until data arrives
5. WHEN refetch is explicitly requested, THE Cultural_Pulse_Dashboard SHALL clear the cache and fetch fresh data from DynamoDB via AppSync_GraphQL

### Requirement 7

**User Story:** As a returning user, I want secure authentication and intuitive navigation, so that I can quickly access different analyses and protect my session.

#### Acceptance Criteria

1. WHEN accessing the Cultural_Pulse_Dashboard, THE system SHALL require authentication via AWS_Amplify_Gen2 Cognito user pool with email-based login
2. WHEN authenticated, THE Cultural_Pulse_Dashboard SHALL display AppSidebar with four navigation items (Overview, Music Insights, News Analysis, Historical Events) and highlight the active page
3. WHEN viewing user profile in the sidebar, THE Cultural_Pulse_Dashboard SHALL show the authenticated user's email address with a sign-out button
4. WHEN navigating between pages, THE Cultural_Pulse_Dashboard SHALL use client-side routing to provide instant transitions without full page reloads
5. WHEN authorization fails, THE Cultural_Pulse_Dashboard SHALL enforce read-only access to all DynamoDB tables (MoodMonthly, MoodYearly, HistoricalEvent, DashboardMetadata) with no create/update/delete operations permitted
