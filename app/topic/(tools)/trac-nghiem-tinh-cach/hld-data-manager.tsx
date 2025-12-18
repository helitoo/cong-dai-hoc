"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import DataManager from "@/components/data-manager";
import { useLoading } from "@/components/loading";
import showToast from "@/components/toastify-wrapper";

import { getHldData, setHldData } from "@/lib/localStorage/hld-data";
import { HldQuestions } from "@/lib/universities/calculators/holland-data/hld-questions";

export default function HldDataManager({
  form,
}: {
  form: UseFormReturn<HldQuestions>;
}) {
  // Loading init
  const { showLoading, hideLoading } = useLoading();

  // Encoding data to string
  function getEncodedData() {
    const scores = form
      .getValues("hldQuestions")
      .map((opn) => opn.freqNodes.map((freq) => freq.score));

    return JSON.stringify(scores);
  }

  // Get encoded data from string
  function decodeEncodedData(encoded: string) {
    const decoded = JSON.parse(encoded) as number[][] | undefined;

    if (!decoded) {
      showToast({ type: "error", message: "LỖI dữ liệu!" });
      return;
    }

    decoded.forEach((scoreList, i) => {
      scoreList.forEach((score, j) => {
        form.setValue(
          `hldQuestions.${i}.freqNodes.${j}.score`,
          score as -1 | 0 | 1
        );
      });
    });
  }

  // Update data string to page
  function setDataToPage(encoded: string) {
    if (!encoded) return;

    showLoading();
    decodeEncodedData(encoded);
    hideLoading();
  }

  useEffect(() => {
    const hldData = getHldData();
    if (hldData) decodeEncodedData(hldData);
  }, []);

  // Reset data on page
  function resetDataOnPage() {
    showLoading();

    const currValues = form.getValues("hldQuestions");

    const newValues = currValues.map((opnNode) => ({
      ...opnNode,
      freqNodes: opnNode.freqNodes.map((freq) => ({
        ...freq,
        score: 0 as -1 | 0 | 1,
      })),
    }));

    form.setValue("hldQuestions", newValues);

    hideLoading();
  }

  return (
    <DataManager
      getEncodedData={getEncodedData}
      setDataToPage={setDataToPage}
      resetDataOnPage={resetDataOnPage}
      setDataToBrowser={setHldData}
    />
  );
}
