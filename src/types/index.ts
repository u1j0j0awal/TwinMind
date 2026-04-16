export interface AppSettings {
  groqApiKey: string;
  liveSuggestionPrompt: string;
  detailedAnswerPrompt: string;
  chatPrompt: string;
  liveContextWindow: number; // tokens
  detailedContextWindow: number; // tokens
  refreshInterval: number; // ms
}

export interface TranscriptChunk {
  id: string;
  text: string;
  timestamp: number;
}

export interface Suggestion {
  id: string;
  batchId: string;
  title: string;
  preview: string;
  fullContent?: string;
  timestamp: number;
  type: 'question' | 'talking_point' | 'fact_check' | 'clarification' | 'answer';
}

export interface SuggestionBatch {
  id: string;
  timestamp: number;
  suggestions: Suggestion[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  source?: 'suggestion' | 'direct';
}

export interface SessionExport {
  transcript: TranscriptChunk[];
  suggestionBatches: SuggestionBatch[];
  chatHistory: ChatMessage[];
  startTime: number;
  endTime: number;
}
