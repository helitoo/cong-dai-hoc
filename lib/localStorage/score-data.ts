"use client";

const STORAGE_KEY = "score-data";

export function setScoreData(content: string) {
  localStorage.setItem(STORAGE_KEY, content);
}

export function getScoreData(): string | undefined {
  let data = localStorage.getItem(STORAGE_KEY);

  if (!data) return undefined;

  return localStorage.getItem(STORAGE_KEY) as string;
}
