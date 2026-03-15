import { z } from "zod";

export const MealEntrySchema = z.object({
  name: z.string().min(1).max(200),
  quantity: z.number().positive().max(10000),
  unit: z.enum([
    "g",
    "ml",
    "kg",
    "l",
    "stück",
    "portion",
    "scheibe",
    "scoop",
    "el",
    "tl",
    "tasse",
    "becher",
  ]),
});

export const LogMealSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  entries: z.array(MealEntrySchema).min(1).max(20),
  originalText: z.string().optional(),
});

export const DeleteEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
  entryName: z.string().min(1).optional(),
});

export const SearchFoodQuerySchema = z.object({
  query: z.string().min(1).max(200),
  limit: z.coerce.number().int().positive().max(20).default(5),
});

export const DaySummaryQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});
