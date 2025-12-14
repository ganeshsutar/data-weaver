# Mood Dataset Dashboard - Visualization Specifications

This document outlines all visualizations for the mood dataset dashboard, organized by category with detailed specifications for implementation.

---

## Table of Contents
1. [Primary Mood Visualizations](#1-primary-mood-visualizations)
2. [Spotify Audio Feature Charts](#2-spotify-audio-feature-charts)
3. [News Analysis Charts](#3-news-analysis-charts)
4. [Event-Based Comparisons](#4-event-based-comparisons)
5. [Billboard Music Charts](#5-billboard-music-charts)
6. [Heatmaps & Matrix Views](#6-heatmaps--matrix-views)
7. [Correlation & Scatter Plots](#7-correlation--scatter-plots)
8. [Summary Cards & KPIs](#8-summary-cards--kpis)

---

## 1. Primary Mood Visualizations

### 1.1 Composite Mood Timeline (Hero Chart)
**Purpose**: Main dashboard visualization showing overall mood trajectory with event annotations

| Property | Value |
|----------|-------|
| **Chart Type** | Line chart with event markers |
| **Primary Metric** | `mood_composite` (0.0-1.0) |
| **X-Axis** | `year_month` (time series) |
| **Y-Axis** | Mood score (0-1 scale) |
| **Annotations** | Historical events (COVID, Financial Crisis, Elections) |
| **Filters** | Year range slider, Event type checkboxes |
| **Interactions** | Hover for details, Click event to zoom, Pan/zoom |

**Data Fields Required**:
```json
{
  "year_month": "2020-03",
  "mood_composite": 0.45,
  "historical_event": "covid_pandemic_peak",
  "event_label": "COVID-19 Pandemic Peak"
}
```

**Insights Highlighted**:
- Major mood dips (pandemic, financial crisis)
- Recovery patterns after events
- Long-term mood trends

---

### 1.2 Music vs News Mood Dual Line Chart
**Purpose**: Compare music-derived mood (Spotify valence) vs news-derived sentiment

| Property | Value |
|----------|-------|
| **Chart Type** | Dual line chart with shared X-axis |
| **Metrics** | `mood_music` (blue), `mood_news` (orange) |
| **X-Axis** | `year_month` |
| **Y-Axis** | Mood score (0-1) |
| **Secondary** | Divergence area (shaded between lines) |
| **Filters** | Year range, Show/hide individual lines |

**Key Insights**:
- When do music and news mood diverge?
- Does music mood lag behind news sentiment?
- Cultural vs political mood disconnect

---

### 1.3 Mood Gauge / Speedometer
**Purpose**: Current period mood indicator (latest month or selected period)

| Property | Value |
|----------|-------|
| **Chart Type** | Gauge / Radial chart |
| **Metric** | `mood_composite` for selected period |
| **Zones** | Red (0-0.3), Yellow (0.3-0.6), Green (0.6-1.0) |
| **Comparison** | Arrow showing change from previous period |
| **Labels** | "Pessimistic", "Neutral", "Optimistic" |

---

## 2. Spotify Audio Feature Charts

### 2.1 Audio Features Trend (Multi-Line)
**Purpose**: Track evolution of key Spotify audio features over time

| Property | Value |
|----------|-------|
| **Chart Type** | Multi-line chart with legend toggle |
| **Metrics** | `spotify_valence_mean`, `spotify_energy_mean`, `spotify_danceability_mean`, `spotify_acousticness_mean` |
| **X-Axis** | `year_month` |
| **Y-Axis** | Feature score (0-1) |
| **Filters** | Feature selector (checkboxes), Year range |

**Questions Answered**:
- Is music becoming more danceable over time?
- Has acoustic music made a comeback?
- Are songs getting happier or sadder?

---

### 2.2 Energy vs Valence Quadrant Chart
**Purpose**: Classify music mood into emotional quadrants

| Property | Value |
|----------|-------|
| **Chart Type** | Scatter plot with quadrant zones |
| **X-Axis** | `spotify_valence_mean` (Sadness to Happiness) |
| **Y-Axis** | `spotify_energy_mean` (Calm to Intense) |
| **Points** | Each point = one month |
| **Color** | By year or by historical event |

**Quadrants**:
- **Top-Right**: Happy & Energetic (Party music)
- **Top-Left**: Sad & Energetic (Angry/intense)
- **Bottom-Right**: Happy & Calm (Peaceful/chill)
- **Bottom-Left**: Sad & Calm (Melancholic)

**Filters**: Year selection, Event filter, Animation by time

---

### 2.3 Acoustic vs Electronic Evolution
**Purpose**: Track the shift from acoustic to electronic music

| Property | Value |
|----------|-------|
| **Chart Type** | Area chart (stacked or single) |
| **Metric** | `spotify_acousticness_mean` |
| **X-Axis** | Year (aggregated yearly for clarity) |
| **Y-Axis** | Acousticness score (0-1) |
| **Annotation** | Key technology milestones (synthesizers, DAWs, streaming) |

---

### 2.4 Tempo Trends Over Decades
**Purpose**: Show how song tempo has evolved

| Property | Value |
|----------|-------|
| **Chart Type** | Box plot by decade OR line with confidence band |
| **Metric** | `spotify_tempo_mean` (BPM) |
| **Grouping** | By decade (1960s, 1970s, etc.) |
| **Y-Axis** | BPM (typically 60-180) |
| **Additional** | Show `spotify_tempo_std` as error bars |

---

### 2.5 Speechiness Trend (Rise of Hip-Hop)
**Purpose**: Track the rise of spoken word / rap in mainstream music

| Property | Value |
|----------|-------|
| **Chart Type** | Area chart |
| **Metric** | `spotify_speechiness_mean` |
| **X-Axis** | Year |
| **Y-Axis** | Speechiness score (0-1) |
| **Annotations** | Hip-hop milestones (Run DMC crossover, Eminem mainstream, Kendrick era) |

---

## 3. News Analysis Charts

### 3.1 News Category Distribution (Stacked Area/Bar)
**Purpose**: Show how news focus shifts over time

| Property | Value |
|----------|-------|
| **Chart Type** | Stacked area chart OR stacked bar chart |
| **Metrics** | `news_politics_count`, `news_entertainment_count`, `news_crime_count`, `news_wellness_count`, `news_world_news_count`, `news_comedy_count` |
| **X-Axis** | `year_month` |
| **Y-Axis** | Article count (absolute or percentage) |
| **Toggle** | Switch between absolute and percentage view |
| **Filters** | Category selector, Year range |

**Key Insights**:
- Politics spikes during elections
- Entertainment vs hard news balance
- COVID impact on news categories

---

### 3.2 News Sentiment Over Time
**Purpose**: Track news sentiment independent of music

| Property | Value |
|----------|-------|
| **Chart Type** | Line chart with confidence band |
| **Metric** | `news_sentiment_mean` (line), `news_sentiment_std` (band) |
| **X-Axis** | `year_month` |
| **Y-Axis** | Sentiment (0-1) |
| **Annotations** | Major news events |

---

### 3.3 Top News Categories Pie/Donut Chart
**Purpose**: Show category breakdown for selected period

| Property | Value |
|----------|-------|
| **Chart Type** | Donut chart with legend |
| **Data** | `top_news_categories` dict |
| **Filter** | Year/month selector or event period |
| **Interaction** | Click category to filter timeline |

---

### 3.4 News Volume Timeline
**Purpose**: Track total news output over time

| Property | Value |
|----------|-------|
| **Chart Type** | Bar chart or area chart |
| **Metric** | `news_article_count` |
| **X-Axis** | `year_month` |
| **Y-Axis** | Article count |
| **Color** | By dominant category or sentiment |

---

### 3.5 Politics vs Entertainment Index
**Purpose**: Ratio of hard news to soft news over time

| Property | Value |
|----------|-------|
| **Chart Type** | Line chart |
| **Metric** | `news_politics_count / (news_entertainment_count + news_comedy_count)` |
| **X-Axis** | `year_month` |
| **Y-Axis** | Ratio (higher = more political) |
| **Annotations** | Election periods |

---

## 4. Event-Based Comparisons

### 4.1 Event Impact Comparison (Grouped Bar)
**Purpose**: Compare mood metrics across different historical events

| Property | Value |
|----------|-------|
| **Chart Type** | Grouped horizontal bar chart |
| **Events** | COVID pandemic, Financial Crisis 2008, Elections 2016/2020, BLM protests |
| **Metrics** | Average `mood_music`, `mood_news`, `mood_composite` during event |
| **Comparison** | Include "normal baseline" (non-event periods) |

**Data Structure**:
```json
{
  "event": "covid_pandemic_peak",
  "label": "COVID-19 (Mar-Dec 2020)",
  "mood_music_avg": 0.42,
  "mood_news_avg": 0.35,
  "mood_composite_avg": 0.39,
  "baseline_music": 0.48,
  "baseline_news": 0.45
}
```

---

### 4.2 Before/During/After Event Analysis
**Purpose**: Show mood trajectory around major events

| Property | Value |
|----------|-------|
| **Chart Type** | Multi-line chart with vertical dividers |
| **Layout** | 3 zones: Before (6 months), During (event period), After (6 months) |
| **Metrics** | `mood_composite`, `mood_music`, `mood_news` |
| **Events** | Selectable dropdown (COVID, 2008 Crisis, Elections) |

---

### 4.3 Crisis Recovery Timeline
**Purpose**: Compare recovery patterns after different crises

| Property | Value |
|----------|-------|
| **Chart Type** | Normalized line chart (index to 100 at crisis start) |
| **Crises** | COVID vs 2008 Financial Crisis |
| **X-Axis** | Months from crisis start (0, +1, +2, ... +24) |
| **Y-Axis** | Mood index (normalized) |

---

### 4.4 Election Year Mood Patterns
**Purpose**: Compare mood patterns across election years

| Property | Value |
|----------|-------|
| **Chart Type** | Multi-line overlay (each year = one line) |
| **Years** | 2016, 2020 (and optionally 2012) |
| **X-Axis** | Month (Jan-Dec) |
| **Y-Axis** | `mood_composite` |
| **Annotation** | Election month (November) marker |

---

## 5. Billboard Music Charts

### 5.1 Chart Longevity Trend
**Purpose**: Track how long songs stay on charts over time

| Property | Value |
|----------|-------|
| **Chart Type** | Line chart with confidence band |
| **Metric** | `avg_weeks_on_chart` (mean), standard deviation (band) |
| **X-Axis** | Year |
| **Y-Axis** | Weeks on chart |
| **Insight** | Are hits lasting longer in the streaming era? |

---

### 5.2 Artist Diversity Index
**Purpose**: Track the number of unique artists on charts

| Property | Value |
|----------|-------|
| **Chart Type** | Line chart |
| **Metric** | `unique_artists` per month |
| **X-Axis** | `year_month` |
| **Y-Axis** | Count of unique artists |
| **Trend Line** | Show moving average (12-month) |

**Insight**: Is the music industry becoming more or less diverse?

---

### 5.3 Top Songs Timeline / Carousel
**Purpose**: Display notable #1 songs through time

| Property | Value |
|----------|-------|
| **Chart Type** | Horizontal timeline or card carousel |
| **Data** | `top_songs`, `top_artists` arrays |
| **Interaction** | Click to see song details, filter by year |
| **Grouping** | By year or by event period |

---

### 5.4 Billboard Entry Volume
**Purpose**: Track chart activity over time

| Property | Value |
|----------|-------|
| **Chart Type** | Bar chart |
| **Metric** | `billboard_entries` per month |
| **X-Axis** | `year_month` |
| **Y-Axis** | Entry count |
| **Color** | By era (vinyl, CD, digital, streaming) |

---

## 6. Heatmaps & Matrix Views

### 6.1 Monthly Mood Heatmap
**Purpose**: Year x Month matrix showing mood intensity

| Property | Value |
|----------|-------|
| **Chart Type** | Heatmap / Calendar heatmap |
| **Rows** | Years (2012-2022 for full data) |
| **Columns** | Months (Jan-Dec) |
| **Cell Value** | `mood_composite` |
| **Color Scale** | Red (low) -> Yellow -> Green (high) |
| **Interaction** | Click cell to see details |

**Data Structure**:
```json
{
  "year": 2020,
  "months": [
    {"month": 1, "mood": 0.48},
    {"month": 2, "mood": 0.46},
    {"month": 3, "mood": 0.38},
    ...
  ]
}
```

---

### 6.2 Audio Features Heatmap
**Purpose**: Compare multiple audio features across years

| Property | Value |
|----------|-------|
| **Chart Type** | Heatmap |
| **Rows** | Audio features (valence, energy, danceability, acousticness, tempo) |
| **Columns** | Years |
| **Cell Value** | Feature mean (normalized 0-1) |
| **Color Scale** | Sequential color scale per row |

---

### 6.3 News Category Calendar
**Purpose**: Show dominant news category by month

| Property | Value |
|----------|-------|
| **Chart Type** | Calendar heatmap with category colors |
| **Cell Color** | Based on dominant category |
| **Legend** | Category -> Color mapping |
| **Interaction** | Hover for category breakdown |

---

## 7. Correlation & Scatter Plots

### 7.1 Music Energy vs News Sentiment
**Purpose**: Explore correlation between music intensity and news tone

| Property | Value |
|----------|-------|
| **Chart Type** | Scatter plot with trend line |
| **X-Axis** | `news_sentiment_mean` |
| **Y-Axis** | `spotify_energy_mean` |
| **Point Color** | By year or by event |
| **Trend Line** | Linear regression with R-squared |

---

### 7.2 Danceability vs Artist Diversity
**Purpose**: Does diverse music mean more danceable music?

| Property | Value |
|----------|-------|
| **Chart Type** | Scatter plot |
| **X-Axis** | `unique_artists` |
| **Y-Axis** | `spotify_danceability_mean` |
| **Point Size** | By `billboard_entries` |

---

### 7.3 Correlation Matrix
**Purpose**: Overview of all metric correlations

| Property | Value |
|----------|-------|
| **Chart Type** | Heatmap correlation matrix |
| **Metrics** | mood_music, mood_news, energy, valence, danceability, unique_artists, weeks_on_chart |
| **Cell Value** | Pearson correlation coefficient |
| **Color Scale** | Diverging (red negative, blue positive) |

---

## 8. Summary Cards & KPIs

### 8.1 Period Summary Cards
Display key metrics for selected period:

| Card | Metric | Format |
|------|--------|--------|
| Overall Mood | `mood_composite` | 0.45 / 1.0 with gauge |
| Music Happiness | `mood_music` | Percentage with emoji |
| News Sentiment | `mood_news` | Percentage with trend arrow |
| Top Song | `top_songs[0]` | Song name + artist |
| Unique Artists | `unique_artists` | Count with vs previous |
| News Focus | Top category | Category name + % |

---

### 8.2 Year-over-Year Comparison
| Property | Value |
|----------|-------|
| **Layout** | Side-by-side cards or table |
| **Metrics** | All key metrics |
| **Comparison** | Selected year vs previous year |
| **Indicators** | Up/down arrows with percentage change |

---

### 8.3 Decade Comparison Cards
| Property | Value |
|----------|-------|
| **Decades** | 1960s, 1970s, 1980s, 1990s, 2000s, 2010s, 2020s |
| **Metrics** | avg mood_music, avg tempo, avg acousticness, total entries |
| **Format** | Horizontal card row with sparklines |

---

## Filter Panel Specifications

### Global Filters (Apply to All Charts)

| Filter | Type | Options |
|--------|------|---------|
| Year Range | Range slider | 1958 - 2025 |
| Event Periods | Checkbox group | COVID, 2008 Crisis, Elections, BLM |
| Data Source | Checkbox | Music data, News data |

### Per-Chart Filters

| Filter | Charts | Options |
|--------|--------|---------|
| Audio Feature Selector | Audio charts | Valence, Energy, Danceability, etc. |
| News Category | News charts | Politics, Entertainment, etc. |
| View Mode | Stacked charts | Absolute / Percentage |
| Aggregation | Time series | Monthly / Quarterly / Yearly |

---

## Chatbot Integration Points

The chatbot should be able to answer questions like:

1. **Trend Questions**: "What was the mood like during COVID?"
2. **Comparison Questions**: "Compare music mood in 2008 vs 2020 crisis"
3. **Peak/Trough Questions**: "When was the saddest month in the dataset?"
4. **Category Questions**: "What news category dominated during the 2016 election?"
5. **Artist Questions**: "How many unique artists were on charts in 2019?"
6. **Feature Questions**: "Has music become more danceable over time?"

Each visualization should provide data for the chatbot to reference.

---

## Recommended Dashboard Layout

### Page 1: Overview
```
+--------------------------------------------------+
|  [Mood Gauge]  [Period Summary Cards]            |
+--------------------------------------------------+
|  [Composite Mood Timeline - Full Width]          |
+--------------------------------------------------+
|  [Music vs News Mood]  |  [Event Comparison]     |
+--------------------------------------------------+
```

### Page 2: Music Deep Dive
```
+--------------------------------------------------+
|  [Audio Features Multi-Line]                     |
+--------------------------------------------------+
|  [Energy vs Valence Quadrant] | [Tempo Trend]    |
+--------------------------------------------------+
|  [Artist Diversity]   | [Chart Longevity]        |
+--------------------------------------------------+
```

### Page 3: News Analysis
```
+--------------------------------------------------+
|  [News Category Stacked Area]                    |
+--------------------------------------------------+
|  [News Sentiment] | [Category Pie for Period]    |
+--------------------------------------------------+
|  [Politics vs Entertainment Index]               |
+--------------------------------------------------+
```

### Page 4: Events & Comparisons
```
+--------------------------------------------------+
|  [Event Selector Dropdown]                       |
+--------------------------------------------------+
|  [Before/During/After Chart]                     |
+--------------------------------------------------+
|  [Crisis Recovery] | [Election Year Patterns]    |
+--------------------------------------------------+
```

### Sidebar: Chatbot
```
+---------------------------+
| Mood Dataset Assistant    |
| [Chat Interface]          |
|                           |
| Ask me about:             |
| - Mood trends            |
| - Historical events      |
| - Music features         |
| - News patterns          |
+---------------------------+
```

---

## Data Preparation Requirements

For each chart type, the Python script should generate:

1. **Time series data**: `{year_month, value, ...additional_fields}`
2. **Event-indexed data**: `{event_name, metrics...}`
3. **Aggregated summaries**: `{period, aggregates...}`
4. **Heatmap matrices**: `{rows, columns, values}`
5. **Correlation matrices**: Pre-computed for quick rendering

Total estimated JSON files: 7-10 files, ~500KB-1MB total
