export interface ReviewScores {
  logic: number;
  content: number;
  structure: number;
  feasibility: number;
  scientific: number;
}

export enum CommentSeverity {
  CRITICAL = 'critical',
  MINOR = 'minor',
  GOOD = 'good'
}

export interface ReviewComment {
  original_text_context: string;
  critique: string;
  suggestion: string;
  severity: CommentSeverity;
}

export interface ReviewResponse {
  summary: string;
  scores: ReviewScores;
  comments: ReviewComment[];
}

export enum AppState {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
