# Mood Dataset Schema Documentation

This document describes the schema for the combined mood dataset that aggregates data from Billboard Top 100, Spotify audio features, and HuffPost News categories to analyze public mood trends over time.

## Data Sources

### 1. Billboard Hot 100 Daily (1958-2025)
- **Source**: Billboard Hot 100 chart
- **Date Range**: August 4, 1958 - December 13, 2025
- **Records**: ~351,000 daily chart entries
- **Description**: Daily rankings of the top 100 songs in the US based on sales, radio play, and streaming

### 2. Spotify Audio Features (1921-2020)
- **Source**: Spotify Web API
- **Date Range**: 1921 - 2020
- **Records**: ~170,000 tracks
- **Description**: Audio analysis features for tracks including mood indicators like valence (happiness), energy, danceability

### 3. HuffPost News Category Dataset (2012-2022)
- **Source**: HuffPost news articles
- **Date Range**: January 28, 2012 - September 23, 2022
- **Records**: ~209,000 articles
- **Description**: News articles categorized by topic (Politics, Entertainment, Comedy, etc.)

---

## Output Files

### 1. `mood_dataset_monthly.csv`

Monthly aggregated dataset combining all three sources.

| Column | Type | Description |
|--------|------|-------------|
| `year_month` | string | Month in YYYY-MM format (e.g., "2020-03") |
| `year` | int | Year component |
| `month` | int | Month component (1-12) |

#### Billboard Metrics
| Column | Type | Description |
|--------|------|-------------|
| `billboard_entries` | int | Total chart entries for the month |
| `avg_chart_rank` | float | Average chart position (1-100) |
| `avg_weeks_on_chart` | float | Average song longevity on chart |
| `unique_artists` | int | Number of distinct artists on chart |
| `top_songs` | list | Top #1 songs during the month |
| `top_artists` | list | Artists with #1 songs |

#### Spotify Audio Features (Monthly Aggregates)
| Column | Type | Range | Description |
|--------|------|-------|-------------|
| `spotify_valence_mean` | float | 0.0-1.0 | Musical positivity (0=sad, 1=happy) |
| `spotify_valence_std` | float | - | Standard deviation of valence |
| `spotify_energy_mean` | float | 0.0-1.0 | Intensity and activity level |
| `spotify_energy_std` | float | - | Standard deviation of energy |
| `spotify_danceability_mean` | float | 0.0-1.0 | How suitable for dancing |
| `spotify_danceability_std` | float | - | Standard deviation |
| `spotify_acousticness_mean` | float | 0.0-1.0 | Acoustic vs electronic |
| `spotify_acousticness_std` | float | - | Standard deviation |
| `spotify_instrumentalness_mean` | float | 0.0-1.0 | Vocal-free content ratio |
| `spotify_instrumentalness_std` | float | - | Standard deviation |
| `spotify_loudness_mean` | float | dB | Average loudness in decibels |
| `spotify_loudness_std` | float | - | Standard deviation |
| `spotify_tempo_mean` | float | BPM | Beats per minute |
| `spotify_tempo_std` | float | - | Standard deviation |
| `spotify_speechiness_mean` | float | 0.0-1.0 | Spoken word content |
| `spotify_speechiness_std` | float | - | Standard deviation |
| `spotify_popularity_mean` | float | 0-100 | Track popularity score |
| `spotify_popularity_std` | float | - | Standard deviation |
| `spotify_track_count` | int | - | Tracks released that month |

#### Spotify Yearly Fallback (for months without monthly data)
| Column | Type | Description |
|--------|------|-------------|
| `spotify_yearly_valence` | float | Yearly average valence |
| `spotify_yearly_energy` | float | Yearly average energy |
| `spotify_yearly_danceability` | float | Yearly average danceability |
| `spotify_yearly_acousticness` | float | Yearly average acousticness |
| `spotify_yearly_tempo` | float | Yearly average tempo |
| `spotify_yearly_popularity` | float | Yearly average popularity |

#### News Sentiment Metrics
| Column | Type | Description |
|--------|------|-------------|
| `news_article_count` | int | Total articles published |
| `news_sentiment_mean` | float | Average sentiment score (0.0-1.0) |
| `news_sentiment_std` | float | Sentiment variation |
| `top_news_categories` | dict | Top 3 categories with counts |
| `news_politics_count` | int | Political articles count |
| `news_entertainment_count` | int | Entertainment articles count |
| `news_comedy_count` | int | Comedy articles count |
| `news_crime_count` | int | Crime articles count |
| `news_world_news_count` | int | World news articles count |
| `news_wellness_count` | int | Wellness articles count |

#### Composite Mood Indicators
| Column | Type | Range | Description |
|--------|------|-------|-------------|
| `mood_music` | float | 0.0-1.0 | Music-based mood (Spotify valence) |
| `mood_news` | float | 0.0-1.0 | News-based mood (category sentiment) |
| `mood_composite` | float | 0.0-1.0 | Combined mood index (60% music + 40% news) |

#### Historical Event Markers
| Column | Type | Description |
|--------|------|-------------|
| `historical_event` | string | Notable event during this period |

**Event Values:**
- `financial_crisis_2008` - Sept 2008 to June 2009
- `covid_pandemic_peak` - March 2020 to Dec 2020
- `covid_vaccine_rollout` - Jan 2021 to Dec 2021
- `trump_rally` - Jan 2017 to Dec 2017 (stock market)
- `post_crisis_recovery` - Jan 2013 to Dec 2014
- `blm_protests` - June 2020 to Aug 2020
- `election_2016` - Nov 2016 to Jan 2017
- `election_2020` - Nov 2020 to Jan 2021

---

### 2. `mood_dataset_yearly.csv`

Yearly summary statistics.

| Column | Type | Description |
|--------|------|-------------|
| `year` | int | Year |
| `total_billboard_entries` | int | Total chart entries for the year |
| `avg_unique_artists_monthly` | float | Average unique artists per month |
| `avg_weeks_on_chart` | float | Average song chart longevity |
| `avg_mood_composite` | float | Average combined mood score |
| `avg_mood_music` | float | Average music mood |
| `avg_mood_news` | float | Average news sentiment |
| `total_news_articles` | int | Total news articles |
| `total_spotify_tracks` | int | Total tracks released |
| `events` | string | Notable events (comma-separated) |

---

## News Category Sentiment Scoring

Categories are assigned sentiment scores (0.0 = negative, 1.0 = positive):

### Positive Categories (0.5-0.9)
| Category | Score | Rationale |
|----------|-------|-----------|
| GOOD NEWS | 0.9 | Explicitly positive content |
| COMEDY | 0.8 | Humor and entertainment |
| WEDDINGS | 0.8 | Celebratory content |
| TRAVEL | 0.7 | Aspirational, leisure content |
| ENTERTAINMENT | 0.6 | Light entertainment news |
| FOOD & DRINK | 0.6 | Lifestyle, enjoyment |

### Neutral Categories (0.3-0.5)
| Category | Score | Rationale |
|----------|-------|-----------|
| SPORTS | 0.5 | Mixed outcomes |
| HOME & LIVING | 0.5 | Lifestyle focus |
| WELLNESS | 0.4 | Health focus, mixed sentiment |
| TECH | 0.4 | Innovation focus |
| BUSINESS | 0.3 | Economic news (mixed) |

### Negative Categories (0.1-0.3)
| Category | Score | Rationale |
|----------|-------|-----------|
| POLITICS | 0.2 | Often contentious |
| WORLD NEWS | 0.2 | Often covers conflicts |
| CRIME | 0.1 | Negative by nature |
| DIVORCE | 0.1 | Relationship breakdown |

---

## Key Insights Available

### Pandemic Analysis (2020)
Compare mood indicators during COVID-19:
- Music valence dropped/increased
- News sentiment shifts
- Category distribution changes

### Financial Crisis (2008-2009)
Analyze mood during economic downturn:
- Music mood patterns
- News focus on business/economy

### Cultural Moments
Track mood around major events:
- Elections (2016, 2020)
- Social movements (BLM)
- Market rallies

---

## Usage Examples

### Python
```python
import pandas as pd

# Load monthly data
df = pd.read_csv('output/mood_dataset_monthly.csv')

# Filter pandemic period
pandemic = df[df['historical_event'] == 'covid_pandemic_peak']
print(f"Pandemic mood (music): {pandemic['mood_music'].mean():.3f}")
print(f"Pandemic mood (news): {pandemic['mood_news'].mean():.3f}")

# Compare years
yearly = pd.read_csv('output/mood_dataset_yearly.csv')
print(yearly[['year', 'avg_mood_composite', 'events']].tail(10))
```

### Visualization Ideas
1. **Line Chart**: mood_composite over time with event annotations
2. **Heatmap**: Monthly mood by year (rows) and month (columns)
3. **Dual Axis**: mood_music vs mood_news comparison
4. **Bar Chart**: Top news categories during specific events
5. **Scatter Plot**: Music energy vs news sentiment

---

## Data Limitations

1. **Spotify Monthly Data**: Sparse for early years (1921-1960s) - yearly fallbacks used
2. **News Data**: Only covers 2012-2022 - no news sentiment for other periods
3. **Sentiment Scoring**: Category-based heuristic, not NLP-based sentiment analysis
4. **Billboard**: US-centric data, may not reflect global mood
5. **Causal Inference**: Correlations don't imply causation between events and mood

---

## File Locations

```
mood-dataset/
├── main.py                           # Data processing script
├── schema-info.md                    # This documentation
├── billboard-top-100-daily.json      # Source: Billboard data
├── News_Category_Dataset_v3.jsonl    # Source: HuffPost news
├── spotify-data/                     # Source: Spotify data
│   ├── data.csv                      # Individual tracks
│   ├── data_by_year.csv              # Yearly aggregates
│   ├── data_by_genres.csv            # Genre aggregates
│   ├── data_by_artist.csv            # Artist aggregates
│   └── data_w_genres.csv             # Tracks with genres
└── output/                           # Generated datasets
    ├── mood_dataset_monthly.csv      # Main monthly dataset
    ├── mood_dataset_yearly.csv       # Yearly summary
    └── sample_data.json              # Sample for inspection
```
