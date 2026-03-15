import { YazioFoodItem, YazioDiaryEntry } from "./types";

const MOCK_FOODS: YazioFoodItem[] = [
  {
    id: "mock-1",
    name: "Skyr Natur",
    brand: "Arla",
    nutrients_per_100: { calories: 63, protein: 11, carbs: 4, fat: 0.2 },
    serving_sizes: [{ id: "s1", name: "Becher", amount_in_g: 450 }],
  },
  {
    id: "mock-2",
    name: "Haferflocken Kernig",
    brand: "Kölln",
    nutrients_per_100: { calories: 372, protein: 13.5, carbs: 58.7, fat: 7 },
  },
  {
    id: "mock-3",
    name: "Vollmilch 3,5%",
    brand: "Weihenstephan",
    nutrients_per_100: { calories: 64, protein: 3.3, carbs: 4.8, fat: 3.5 },
  },
  {
    id: "mock-4",
    name: "Banane",
    nutrients_per_100: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
    serving_sizes: [{ id: "s2", name: "Stück (mittel)", amount_in_g: 120 }],
  },
  {
    id: "mock-5",
    name: "Hähnchenbrust",
    nutrients_per_100: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  },
  {
    id: "mock-6",
    name: "Reis Basmati gekocht",
    nutrients_per_100: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
  },
  {
    id: "mock-7",
    name: "Brokkoli",
    nutrients_per_100: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  },
  {
    id: "mock-8",
    name: "Olivenöl",
    nutrients_per_100: { calories: 884, protein: 0, carbs: 0, fat: 100 },
    serving_sizes: [{ id: "s3", name: "EL", amount_in_g: 14 }],
  },
  {
    id: "mock-9",
    name: "Ei (Größe M)",
    nutrients_per_100: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    serving_sizes: [{ id: "s4", name: "Stück", amount_in_g: 60 }],
  },
  {
    id: "mock-10",
    name: "Vollkornbrot",
    nutrients_per_100: { calories: 213, protein: 7, carbs: 41, fat: 1.2 },
    serving_sizes: [{ id: "s5", name: "Scheibe", amount_in_g: 50 }],
  },
  {
    id: "mock-11",
    name: "Lachs",
    nutrients_per_100: { calories: 208, protein: 20, carbs: 0, fat: 13 },
  },
  {
    id: "mock-12",
    name: "Avocado",
    nutrients_per_100: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
    serving_sizes: [{ id: "s6", name: "Stück", amount_in_g: 200 }],
  },
  {
    id: "mock-13",
    name: "Magerquark",
    brand: "REWE Beste Wahl",
    nutrients_per_100: { calories: 67, protein: 12, carbs: 4, fat: 0.3 },
    serving_sizes: [{ id: "s7", name: "Becher", amount_in_g: 500 }],
  },
  {
    id: "mock-14",
    name: "Whey Protein Vanille",
    brand: "ESN",
    nutrients_per_100: { calories: 390, protein: 80, carbs: 5.6, fat: 5 },
    serving_sizes: [{ id: "s8", name: "Scoop", amount_in_g: 30 }],
  },
  {
    id: "mock-15",
    name: "Kidneybohnen",
    nutrients_per_100: { calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5 },
  },
  {
    id: "mock-16",
    name: "Süßkartoffel",
    nutrients_per_100: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  },
  {
    id: "mock-17",
    name: "Erdnussbutter",
    brand: "Seitenbacher",
    nutrients_per_100: { calories: 588, protein: 25, carbs: 20, fat: 50 },
    serving_sizes: [{ id: "s9", name: "EL", amount_in_g: 15 }],
  },
  {
    id: "mock-18",
    name: "Thunfisch in eigenem Saft",
    brand: "Saupiquet",
    nutrients_per_100: { calories: 103, protein: 24, carbs: 0, fat: 0.8 },
  },
  {
    id: "mock-19",
    name: "Apfel",
    nutrients_per_100: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    serving_sizes: [{ id: "s10", name: "Stück (mittel)", amount_in_g: 180 }],
  },
  {
    id: "mock-20",
    name: "Gouda",
    nutrients_per_100: { calories: 356, protein: 25, carbs: 0, fat: 27 },
    serving_sizes: [{ id: "s11", name: "Scheibe", amount_in_g: 30 }],
  },
];

// In-memory diary for mock mode
const mockDiary: Map<string, YazioDiaryEntry[]> = new Map();
let entryCounter = 0;

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  return t.includes(q) || q.includes(t);
}

export function mockSearchFood(
  query: string,
  limit: number
): YazioFoodItem[] {
  const results = MOCK_FOODS.filter(
    (f) =>
      fuzzyMatch(query, f.name) ||
      (f.brand && fuzzyMatch(query, f.brand))
  );
  return results.slice(0, limit);
}

export function mockAddDiaryEntry(
  foodId: string,
  mealType: string,
  date: string,
  amountInGrams: number
): YazioDiaryEntry | null {
  const food = MOCK_FOODS.find((f) => f.id === foodId);
  if (!food) return null;

  const factor = amountInGrams / 100;
  const entry: YazioDiaryEntry = {
    id: `diary-${++entryCounter}`,
    food_id: food.id,
    food_name: food.name,
    meal_type: mealType,
    date,
    amount: amountInGrams,
    nutrients: {
      calories: Math.round(food.nutrients_per_100.calories * factor),
      protein: Math.round(food.nutrients_per_100.protein * factor * 10) / 10,
      carbs: Math.round(food.nutrients_per_100.carbs * factor * 10) / 10,
      fat: Math.round(food.nutrients_per_100.fat * factor * 10) / 10,
    },
  };

  const key = date;
  const entries = mockDiary.get(key) || [];
  entries.push(entry);
  mockDiary.set(key, entries);

  return entry;
}

export function mockGetDiary(date: string): YazioDiaryEntry[] {
  return mockDiary.get(date) || [];
}

export function mockDeleteEntry(
  date: string,
  mealType?: string,
  entryName?: string
): YazioDiaryEntry | null {
  const entries = mockDiary.get(date);
  if (!entries || entries.length === 0) return null;

  let idx = -1;
  if (entryName && mealType) {
    idx = entries.findIndex(
      (e) =>
        e.meal_type === mealType &&
        e.food_name.toLowerCase().includes(entryName.toLowerCase())
    );
  } else if (mealType) {
    // Delete last entry of that meal type
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].meal_type === mealType) {
        idx = i;
        break;
      }
    }
  } else if (entryName) {
    idx = entries.findIndex((e) =>
      e.food_name.toLowerCase().includes(entryName.toLowerCase())
    );
  } else {
    // Delete last entry of the day
    idx = entries.length - 1;
  }

  if (idx === -1) return null;

  const [deleted] = entries.splice(idx, 1);
  mockDiary.set(date, entries);
  return deleted;
}
