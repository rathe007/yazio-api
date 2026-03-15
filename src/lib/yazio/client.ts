import { YazioFoodItem, YazioSearchResponse, YazioDiaryEntry, YazioDiaryResponse, YazioAddEntryRequest } from "./types";
import { getConfig } from "@/config";

const YAZIO_BASE_URL = "https://api.yazio.com/v11";
const TIMEOUT_MS = 10000;

async function yazioFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const config = getConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${YAZIO_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.yazioAuthToken}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `YAZIO API error: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function searchFood(
  query: string,
  limit: number = 5
): Promise<YazioFoodItem[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  const data = await yazioFetch<YazioSearchResponse>(
    `/foods/search?${params}`
  );
  return data.items;
}

export async function getDiary(date: string): Promise<YazioDiaryEntry[]> {
  const data = await yazioFetch<YazioDiaryResponse>(
    `/diary?date=${date}`
  );
  return data.entries;
}

export async function addDiaryEntry(
  request: YazioAddEntryRequest
): Promise<YazioDiaryEntry> {
  return yazioFetch<YazioDiaryEntry>("/diary", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function deleteDiaryEntry(entryId: string): Promise<void> {
  await yazioFetch(`/diary/${entryId}`, { method: "DELETE" });
}
