export interface SuggestionModel {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  reason: string;
  savings: number | null;
}

export interface AnalysisModel {
  summary: string;
  suggestions: SuggestionModel[];
}
