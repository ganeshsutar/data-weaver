# Data Weaver - Complete Requirements

## Overview
A data analysis and storytelling application that allows users to upload two CSV datasets, automatically combines them, performs comprehensive analysis, and generates insights using LLM. Users can interact with findings through a chat interface.

---

## 1. Authentication & User Management

**Provider**: AWS Cognito (via Amplify)

**Features**:
- User registration and login
- Password reset functionality
- Session management
- Per-user data isolation

---

## 2. Dataset Management

### Upload
- Accept two CSV files per analysis (max 25 MB each)
- Drag-and-drop or file picker UI
- Client-side validation (file type, size)
- Upload directly to S3 via presigned URLs

### Storage
- S3 bucket with user-prefixed paths: `s3://bucket/{userId}/uploads/`
- Combined datasets stored at: `s3://bucket/{userId}/combined/`

### Sample Data
- Pre-loaded demo datasets for new users to explore
- Accessible from dashboard without upload

---

## 3. Data Processing Pipeline

| Stage | Description | Output |
|-------|-------------|--------|
| 1. Upload | Files uploaded to S3 | S3 URIs |
| 2. Schema Analysis | LLM describes columns, data types, value distributions | Schema metadata JSON |
| 3. Join Key Detection | LLM auto-detects matching columns between datasets | Join configuration |
| 3b. Column Mapping | If no direct match, attempt semantic column mapping | Mapped columns or failure |
| 4. Data Cleaning | Handle nulls, normalize formats, type coercion | Cleaned datasets |
| 5. Combine | Map-reduce style merge using detected join keys | Combined dataset |
| 6. Store Combined | Save merged dataset to S3 | S3 URI |
| 7. Analysis | Generate all analytical outputs (see below) | Analysis results |

---

## 4. Analysis Features

### 4.1 Statistical Analysis
- **Correlation Heatmap**: Pairwise correlation matrix for numeric columns
- **Outlier Detection**: Identify and explain statistical outliers (IQR/Z-score)
- **Missing Values**: Report missing value patterns and potential impact
- **Column Pair Suggestions**: Identify interesting column pairs for visualization

### 4.2 Visualization (Charts)
Using shadcn UI charts (Recharts-based):
- **Standard Charts**: Bar, line, scatter, pie (based on data types)
- **LLM-Suggested Charts**: AI picks optimal chart types for insights
- **Correlation Charts**: Scatter plots with trend lines, heatmaps

### 4.3 Narrative Generation
LLM generates a narrative explaining:
- How the datasets relate
- Key findings and patterns
- Interesting insights with supporting visualizations
- Each insight includes: title, description, relevant chart

---

## 5. User Interface

### 5.1 Pages/Views
1. **Login/Register** - Cognito-hosted UI or custom forms
2. **Dashboard** - List of past analyses + new analysis button + sample data
3. **Upload** - Two-file upload with validation
4. **Processing** - Real-time progress through stages
5. **Results** - Story view with charts, insights, heatmaps
6. **Chat** - Conversational interface to explore findings

### 5.2 Progress Display
- Real-time stage updates via WebSocket or AppSync subscriptions
- Visual pipeline showing: Upload -> Analyze -> Clean -> Combine -> Insights
- Each stage shows: pending, in-progress, completed, or error state

### 5.3 Historical Analyses
- List of user's past analyses with timestamps
- Click to view previous results
- No re-run or modification (one-shot analysis)

---

## 6. Chat Interface for Findings

- Embedded chat UI on results page
- Users can ask questions about the analysis:
  - "Why is column X correlated with Y?"
  - "Show me more details about the outliers"
  - "What does this trend mean?"
- Context-aware: LLM has access to analysis results, dataset schema, and generated insights

---

## 7. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript |
| UI Components | shadcn/ui + Tailwind CSS |
| Charts | shadcn charts (Recharts-based) |
| Authentication | AWS Cognito |
| API | AWS AppSync (GraphQL) |
| Database | Amazon DynamoDB |
| File Storage | Amazon S3 |
| LLM | Amazon Bedrock (any available model, default: Claude 3.5 Haiku) |
| Data Processing | AWS Lambda |
| Workflow | AWS Step Functions (optional for complex pipelines) |
| Real-time | AppSync Subscriptions |

**Base Template**: https://github.com/aws-samples/amplify-vite-react-template

---

## 8. Data Model (DynamoDB)

```
User
├── userId (PK)
├── email
├── createdAt

Analysis
├── analysisId (PK)
├── userId (SK/GSI)
├── status: "processing" | "completed" | "failed"
├── createdAt
├── dataset1: { s3Uri, filename, schema }
├── dataset2: { s3Uri, filename, schema }
├── combinedDataset: { s3Uri, rowCount, columns }
├── results: {
│   ├── correlationMatrix
│   ├── outliers
│   ├── missingValues
│   ├── insights[]
│   ├── charts[]
│   └── narrative
│ }
└── processingStages: [{ stage, status, timestamp, message }]

ChatMessage
├── analysisId (PK)
├── messageId (SK)
├── role: "user" | "assistant"
├── content
├── timestamp
```

---

## 9. API Endpoints (GraphQL)

### Mutations
- `createAnalysis(dataset1, dataset2)` - Start new analysis
- `sendChatMessage(analysisId, message)` - Send chat message

### Queries
- `getAnalysis(analysisId)` - Get analysis details and results
- `listAnalyses(userId)` - List user's analyses
- `getChatHistory(analysisId)` - Get chat messages for analysis

### Subscriptions
- `onAnalysisUpdate(analysisId)` - Real-time processing updates
- `onChatResponse(analysisId)` - Real-time chat responses

---

## 10. Error Handling

### Dataset Join Failure
When datasets cannot be combined:
1. **Step 1**: Attempt automatic join key detection based on column names
2. **Step 2**: If no match, attempt semantic column mapping (e.g., "customer_id" <-> "client_id")
3. **Step 3**: If mapping fails, display user-friendly error:
   > "Unable to combine or correlate the datasets. Please modify your data or add a common column that exists in both files to enable analysis."

---

## 11. Non-Functional Requirements

- **Performance**: Analysis completes within 2-5 minutes for <25MB files
- **Security**: All data encrypted at rest (S3) and in transit (HTTPS)
- **Scalability**: Serverless architecture scales automatically
- **Cost**: Pay-per-use model with Bedrock and Lambda

---

## 12. File Structure (Proposed)

```
/
├── amplify/
│   ├── auth/             # Cognito configuration
│   ├── data/             # AppSync schema & resolvers
│   ├── storage/          # S3 bucket configuration
│   └── functions/        # Lambda functions
│       ├── analyzeSchema/
│       ├── detectJoinKeys/
│       ├── cleanData/
│       ├── combineDatasets/
│       ├── generateInsights/
│       └── chatHandler/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── charts/       # Chart components
│   │   ├── upload/       # Upload components
│   │   ├── results/      # Results display
│   │   └── chat/         # Chat interface
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Upload.tsx
│   │   ├── Processing.tsx
│   │   └── Results.tsx
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities
│   ├── types/            # TypeScript types
│   └── App.tsx
├── package.json
└── vite.config.ts
```
