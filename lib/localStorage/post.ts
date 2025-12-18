"use client";

const STORAGE_KEY = "post";

export function setPost(content: string) {
  localStorage.setItem(STORAGE_KEY, content);
}

export function getPost() {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}
