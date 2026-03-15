import { MealType, LoggedEntry, Nutrients, FoodSearchResult } from "./meals";

// Request types
export interface LogMealRequest {
  date: string;
  mealType: MealType;
  entries: { name: string; quantity: number; unit: string }[];
  originalText?: string;
}

export interface DeleteEntryRequest {
  date: string;
  mealType?: MealType;
  entryName?: string;
}

// Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LogMealResponseData {
  entries: LoggedEntry[];
  totals: Nutrients;
}

export interface DaySummaryResponseData {
  date: string;
  meals: Record<MealType, LoggedEntry[]>;
  totals: Nutrients;
}

export interface DeleteEntryResponseData {
  deleted: {
    name: string;
    mealType: MealType;
    calories: number;
  };
}

export interface SearchFoodResponseData {
  results: FoodSearchResult[];
}
