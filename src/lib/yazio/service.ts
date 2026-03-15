import { MealEntry, MealType, LoggedEntry, Nutrients, FoodSearchResult } from "@/lib/types/meals";
import { getConfig } from "@/config";
import * as yazioClient from "./client";
import * as mock from "./mock";

function useMock(): boolean {
  return getConfig().useMockYazio;
}

/** Convert unit-based quantities to grams for YAZIO API */
function toGrams(quantity: number, unit: string): number {
  const conversions: Record<string, number> = {
    g: 1,
    ml: 1,
    kg: 1000,
    l: 1000,
    stück: 100,    // default ~100g per piece
    portion: 200,
    scheibe: 30,
    scoop: 30,
    el: 15,
    tl: 5,
    tasse: 250,
    becher: 150,
  };
  return quantity * (conversions[unit] || 1);
}

export async function searchFood(
  query: string,
  limit: number = 5
): Promise<FoodSearchResult[]> {
  if (useMock()) {
    const items = mock.mockSearchFood(query, limit);
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      calories: item.nutrients_per_100.calories,
      protein: item.nutrients_per_100.protein,
      carbs: item.nutrients_per_100.carbs,
      fat: item.nutrients_per_100.fat,
      servingSize: item.serving_sizes?.[0]?.amount_in_g,
      servingUnit: item.serving_sizes?.[0]?.name,
    }));
  }

  const items = await yazioClient.searchFood(query, limit);
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    calories: item.nutrients_per_100.calories,
    protein: item.nutrients_per_100.protein,
    carbs: item.nutrients_per_100.carbs,
    fat: item.nutrients_per_100.fat,
    servingSize: item.serving_sizes?.[0]?.amount_in_g,
    servingUnit: item.serving_sizes?.[0]?.name,
  }));
}

export async function logMeal(
  date: string,
  mealType: MealType,
  entries: MealEntry[]
): Promise<{ entries: LoggedEntry[]; totals: Nutrients }> {
  const loggedEntries: LoggedEntry[] = [];

  for (const entry of entries) {
    const amountInGrams = toGrams(entry.quantity, entry.unit);

    // Search for food
    const searchResults = await searchFood(entry.name, 1);
    if (searchResults.length === 0) {
      throw new Error(`Food not found: ${entry.name}`);
    }

    const matched = searchResults[0];
    const factor = amountInGrams / 100;

    if (useMock()) {
      mock.mockAddDiaryEntry(matched.id, mealType, date, amountInGrams);
    } else {
      await yazioClient.addDiaryEntry({
        food_id: matched.id,
        meal_type: mealType,
        date,
        amount: amountInGrams,
      });
    }

    loggedEntries.push({
      name: entry.name,
      matchedProduct: matched.brand
        ? `${matched.name} (${matched.brand})`
        : matched.name,
      quantity: entry.quantity,
      unit: entry.unit,
      calories: Math.round(matched.calories * factor),
      protein: Math.round(matched.protein * factor * 10) / 10,
      carbs: Math.round(matched.carbs * factor * 10) / 10,
      fat: Math.round(matched.fat * factor * 10) / 10,
    });
  }

  const totals = loggedEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: Math.round((acc.protein + e.protein) * 10) / 10,
      carbs: Math.round((acc.carbs + e.carbs) * 10) / 10,
      fat: Math.round((acc.fat + e.fat) * 10) / 10,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return { entries: loggedEntries, totals };
}

export async function getDaySummary(date: string): Promise<{
  date: string;
  meals: Record<MealType, LoggedEntry[]>;
  totals: Nutrients;
}> {
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
  const meals: Record<MealType, LoggedEntry[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  };

  const diaryEntries = useMock()
    ? mock.mockGetDiary(date)
    : await yazioClient.getDiary(date);

  for (const entry of diaryEntries) {
    const mt = entry.meal_type as MealType;
    if (mealTypes.includes(mt)) {
      meals[mt].push({
        name: entry.food_name,
        matchedProduct: entry.food_name,
        quantity: entry.amount,
        unit: "g",
        calories: entry.nutrients.calories,
        protein: entry.nutrients.protein,
        carbs: entry.nutrients.carbs,
        fat: entry.nutrients.fat,
      });
    }
  }

  const allEntries = Object.values(meals).flat();
  const totals = allEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: Math.round((acc.protein + e.protein) * 10) / 10,
      carbs: Math.round((acc.carbs + e.carbs) * 10) / 10,
      fat: Math.round((acc.fat + e.fat) * 10) / 10,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return { date, meals, totals };
}

export async function deleteEntry(
  date: string,
  mealType?: MealType,
  entryName?: string
): Promise<{ name: string; mealType: MealType; calories: number } | null> {
  if (useMock()) {
    const deleted = mock.mockDeleteEntry(date, mealType, entryName);
    if (!deleted) return null;
    return {
      name: deleted.food_name,
      mealType: deleted.meal_type as MealType,
      calories: deleted.nutrients.calories,
    };
  }

  // For real YAZIO: get diary, find matching entry, delete by ID
  const entries = await yazioClient.getDiary(date);
  let target = entries[entries.length - 1]; // default: last entry

  if (entryName && mealType) {
    target =
      entries.find(
        (e) =>
          e.meal_type === mealType &&
          e.food_name.toLowerCase().includes(entryName.toLowerCase())
      ) || target;
  } else if (mealType) {
    const ofType = entries.filter((e) => e.meal_type === mealType);
    target = ofType[ofType.length - 1] || target;
  } else if (entryName) {
    target =
      entries.find((e) =>
        e.food_name.toLowerCase().includes(entryName.toLowerCase())
      ) || target;
  }

  if (!target) return null;

  await yazioClient.deleteDiaryEntry(target.id);
  return {
    name: target.food_name,
    mealType: target.meal_type as MealType,
    calories: target.nutrients.calories,
  };
}
