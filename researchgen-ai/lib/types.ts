// ================================================================
// ResearchGen AI — Data Types
// ================================================================

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  lastStep: number; // 1-9
  idea: IdeaInput | null;
  research: ResearchRun | null;
}

export interface IdeaInput {
  description: string;
  category: string;
  platforms: string[];
  depth: 'quick' | 'standard' | 'deep';
}

export interface ResearchRun {
  aiAnalysis: AIAnalysisData;
  competitorAnalysis: CompetitorAnalysisData;
  reviewAnalysis: ReviewAnalysisData;
  insightMap: InsightMapData;
  personas: PersonaData[];
  journey: JourneyData;
  opportunities: OpportunityData[];
  report: UXReportData;
}

// Stage 2
export interface AIAnalysisData {
  problemInterpretation: string;
  targetSegments: { name: string; percentage: number }[];
  insights: StrategicInsight[];
  hmwQuestions: string[];
}

export interface StrategicInsight {
  id: string;
  title: string;
  description: string;
  confidence: number; // 0-100
  category: 'user_preference' | 'psychology' | 'accessibility' | 'trend';
}

// Stage 3
export interface CompetitorAnalysisData {
  competitors: Competitor[];
  featureComparison: FeatureComparison[];
  gaps: GapOpportunity[];
  sentimentData: { name: string; positive: number; neutral: number; negative: number }[];
}

export interface Competitor {
  id: string;
  name: string;
  platform: string;
  uxScore: number;
  downloads: string;
  pros: string[];
  cons: string[];
}

export interface FeatureComparison {
  feature: string;
  [key: string]: string;
}

export interface GapOpportunity {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

// Stage 4
export interface ReviewAnalysisData {
  sentiment: { positive: number; neutral: number; negative: number };
  topComplaints: string[];
  praisedFeatures: string[];
  featureRequests: string[];
  topicClusters: string[];
  reviews: ReviewEntry[];
}

export interface ReviewEntry {
  id: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  rating: number;
}

// Stage 5
export interface InsightMapData {
  nodes: InsightNode[];
  edges: InsightEdge[];
}

export interface InsightNode {
  id: string;
  type: 'review' | 'competitor' | 'user' | 'ai';
  title: string;
  description: string;
  evidenceCount: number;
  confidence: number;
  position: { x: number; y: number };
}

export interface InsightEdge {
  id: string;
  source: string;
  target: string;
}

// Stage 6
export interface PersonaData {
  id: string;
  name: string;
  age: string;
  occupation: string;
  location: string;
  expertise: number; // 0-10 for matrix positioning
  engagement: number; // 0-10 for matrix positioning
  traits: { name: string; value: number }[];
  goals: string[];
  painPoints: string[];
  quote: string;
  avatarColor: string;
}

// Stage 7
export interface JourneyData {
  stages: JourneyStage[];
  emotionCurve: { stage: string; score: number }[];
  coreIssues: string[];
  aiRecommendations: string[];
}

export interface JourneyStage {
  name: string;
  koreanName: string;
  actions: string[];
  pains: string[];
  expectations: string[];
  emotion: number; // -2 to 2
}

// Stage 8
export interface OpportunityData {
  id: string;
  title: string;
  description: string;
  value: number; // 1-10
  effort: number; // 1-10
  quadrant: 'quick-win' | 'strategic' | 'fill-in' | 'low-priority';
}

// Stage 9
export interface UXReportData {
  executiveSummary: string;
  keyInsights: { title: string; description: string; icon: string }[];
  opportunityMapping: { title: string; priority: string; impact: string }[];
  recommendations: { area: string; action: string; timeline: string; priority: string }[];
  nextSteps: { phase: string; items: string[]; timeline: string }[];
}
