import type { AnalysisModel } from "../../api/models/AnalysisModel";

function money(value: number): string {
  return `${value.toFixed(2)} RON`;
}

export interface Suggestion {
  productId: number;
  name: string;
  price: number;
  priceLabel: string;
  quantity: number;
  reason: string;
  savings: number | null;
  savingsLabel: string | null;
}

export interface Analysis {
  summary: string;
  suggestions: Suggestion[];
}

export function toAnalysis(dto: AnalysisModel): Analysis {
  return {
    summary: dto.summary,
    suggestions: dto.suggestions.map((suggestion) => ({
      productId: suggestion.productId,
      name: suggestion.name,
      price: suggestion.price,
      priceLabel: money(suggestion.price),
      quantity: suggestion.quantity,
      reason: suggestion.reason,
      savings: suggestion.savings,
      savingsLabel:
        suggestion.savings !== null ? money(suggestion.savings) : null,
    })),
  };
}
