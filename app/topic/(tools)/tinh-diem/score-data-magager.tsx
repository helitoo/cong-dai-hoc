"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import showToast from "@/components/toastify-wrapper";

import DataManager from "@/components/data-manager";

import { getScoreData, setScoreData } from "@/lib/localStorage/score-data";

import {
  type ScoreData,
  scoreSchema,
} from "@/lib/universities/calculators/score-data/score-schema";

import { DEFAULT_SCORE_FORM_VALUES } from "@/app/topic/(tools)/tinh-diem/page";

export default function ScoreDataManager({
  form,
}: {
  form: UseFormReturn<ScoreData>;
}) {
  // Encoding data to string
  function getEncodedData() {
    const normalized = scoreSchema.parse(form.getValues());
    return JSON.stringify(normalized);
  }
  // Get encoded data from string
  function decodeEncodedData(encoded: string) {
    const raw = JSON.parse(encoded);
    form.reset(scoreSchema.parse(raw));
  }

  // Update data string to page
  function setDataToPage(encoded: string) {
    if (!encoded) return;

    try {
      decodeEncodedData(encoded);
    } catch (err) {
      showToast({ type: "error", message: "LỖI dữ liệu!" });
    }
  }

  useEffect(() => {
    const data = getScoreData();
    if (data) decodeEncodedData(data);
  }, []);

  // Reset data on page
  function resetDataOnPage() {
    form.reset(scoreSchema.parse(DEFAULT_SCORE_FORM_VALUES));
  }

  return (
    <DataManager
      getEncodedData={getEncodedData}
      setDataToPage={setDataToPage}
      resetDataOnPage={resetDataOnPage}
      setDataToBrowser={setScoreData}
    />
  );
}
