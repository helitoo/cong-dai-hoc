"use client";

const STORAGE_KEY = "score-query";

export function setScoreQuery(content: string) {
  localStorage.setItem(STORAGE_KEY, content);
}

export function getScoreQuery() {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}
