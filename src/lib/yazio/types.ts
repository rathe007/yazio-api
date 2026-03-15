// Types representing YAZIO API responses (reverse-engineered)

export interface YazioFoodItem {
  id: string;
  name: string;
  brand?: string;
  nutrients_per_100: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  serving_sizes?: {
    id: string;
    name: string;
    amount_in_g: number;
  }[];
}

export interface YazioSearchResponse {
  items: YazioFoodItem[];
}

export interface YazioDiaryEntry {
  id: string;
  food_id: string;
  food_name: string;
  meal_type: string;
  date: string;
  amount: number;
  serving_id?: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface YazioDiaryResponse {
  entries: YazioDiaryEntry[];
}

export interface YazioAddEntryRequest {
  food_id: string;
  meal_type: string;
  date: string;
  amount: number;
  serving_id?: string;
}
