"use client";

const STORAGE_KEY = "hld-data";

export function setHldData(content: string) {
  localStorage.setItem(STORAGE_KEY, content);
}

export function getHldData(): string | undefined {
  let data = localStorage.getItem(STORAGE_KEY);

  return data ?? undefined;
}
