export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type Unit =
  | "g"
  | "ml"
  | "kg"
  | "l"
  | "stück"
  | "portion"
  | "scheibe"
  | "scoop"
  | "el"
  | "tl"
  | "tasse"
  | "becher";

export interface MealEntry {
  name: string;
  quantity: number;
  unit: Unit;
}

export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface LoggedEntry extends Nutrients {
  name: string;
  matchedProduct: string;
  quantity: number;
  unit: Unit;
}

export interface FoodSearchResult extends Nutrients {
  id: string;
  name: string;
  brand?: string;
  servingSize?: number;
  servingUnit?: string;
}
