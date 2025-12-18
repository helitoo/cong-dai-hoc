"use client";

import type { Metadata } from "@/lib/types/profile/profile";

const STORAGE_KEY = "metadata";

export const defaultMetadata: Metadata = {
  id: "",
  avatar: { message: "", variant: "marble" },
};

// Set data to local storage
export function setMetadata(data: Metadata) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Get data from local storage
export function getMetadata(): Metadata {
  const item = localStorage.getItem(STORAGE_KEY);
  if (!item) return defaultMetadata;

  try {
    return JSON.parse(item) as Metadata;
  } catch {
    return defaultMetadata;
  }
}
