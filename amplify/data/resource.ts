import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Custom types for nested structures

const ColumnSchema = a.customType({
  name: a.string().required(),
  type: a.string().required(),
  nullable: a.boolean().required(),
});

const DatasetSchema = a.customType({
  columns: a.ref("ColumnSchema").array(),
});

const DatasetInfo = a.customType({
  s3Uri: a.string().required(),
  filename: a.string().required(),
  size: a.integer(),
  rowCount: a.integer(),
  schema: a.ref("DatasetSchema"),
});

const JoinConfig = a.customType({
  key1: a.string().required(),
  key2: a.string().required(),
  type: a.string().required(), // 'inner', 'left', 'right', 'outer'
  mappingType: a.string().required(), // 'direct' | 'semantic'
});

const CombinedDataset = a.customType({
  s3Uri: a.string().required(),
  rowCount: a.integer(),
  columns: a.string().array(),
});

const ProcessingStage = a.customType({
  name: a.string().required(),
  status: a.string().required(), // 'pending' | 'in_progress' | 'completed' | 'failed'
  timestamp: a.string(),
  message: a.string(),
});

const CorrelationMatrix = a.customType({
  columns: a.string().array(),
  matrix: a.json(), // 2D array of floats
});

const Outlier = a.customType({
  column: a.string().required(),
  method: a.string().required(),
  count: a.integer().required(),
  indices: a.integer().array(),
  description: a.string(),
});

const MissingValues = a.customType({
  total: a.integer().required(),
  byColumn: a.json(), // { [column: string]: number }
  percentage: a.float(),
});

const ChartConfig = a.customType({
  xColumn: a.string(),
  yColumn: a.string(),
  // Additional chart configuration stored as JSON for flexibility
  options: a.json(),
});

const Insight = a.customType({
  id: a.string().required(),
  title: a.string().required(),
  description: a.string().required(),
  chartType: a.string(), // 'bar' | 'line' | 'scatter' | 'pie' | 'heatmap'
  chartConfig: a.ref("ChartConfig"),
});

const AnalysisResults = a.customType({
  correlationMatrix: a.ref("CorrelationMatrix"),
  outliers: a.ref("Outlier").array(),
  missingValues: a.ref("MissingValues"),
  insights: a.ref("Insight").array(),
  narrative: a.string(),
});

const AnalysisError = a.customType({
  code: a.string().required(),
  message: a.string().required(),
  stage: a.string(),
});

// Schema definition
const schema = a.schema({
  // Custom types must be registered in schema
  ColumnSchema,
  DatasetSchema,
  DatasetInfo,
  JoinConfig,
  CombinedDataset,
  ProcessingStage,
  CorrelationMatrix,
  Outlier,
  MissingValues,
  ChartConfig,
  Insight,
  AnalysisResults,
  AnalysisError,

  // Analysis model - stores analysis metadata and results
  Analysis: a
    .model({
      userId: a.string().required(),
      status: a.enum(["processing", "completed", "failed"]),
      dataset1: a.ref("DatasetInfo"),
      dataset2: a.ref("DatasetInfo"),
      joinConfig: a.ref("JoinConfig"),
      combinedDataset: a.ref("CombinedDataset"),
      stages: a.ref("ProcessingStage").array(),
      results: a.ref("AnalysisResults"),
      error: a.ref("AnalysisError"),
    })
    .secondaryIndexes((index) => [
      index("userId").name("byUser"),
    ])
    .authorization((allow) => [allow.owner()]),

  // ChatMessage model - stores conversation history for each analysis
  ChatMessage: a
    .model({
      analysisId: a.id().required(),
      role: a.enum(["user", "assistant"]),
      content: a.string().required(),
    })
    .secondaryIndexes((index) => [
      index("analysisId").name("byAnalysis"),
    ])
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
