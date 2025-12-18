"use client";

import { Clipboard, Check, WandSparkles } from "lucide-react";

import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";

import ToggleButton from "@/components/toggle-button/toggle-button";
import { Button } from "@/components/ui/button";

import Quote from "@/components/quote";

import {
  type ChartColors,
  getRandColorArr,
} from "@/components/charts/chart-colors";
import { BarChart, type BarChartProps } from "@/components/charts/bar-charts";
import {
  DoughnutChart,
  type DoughnutChartProps,
} from "@/components/charts/doughnut-chart";

import { HldQuestions } from "@/lib/universities/calculators/holland-data/hld-questions";
import {
  getHldName,
  getHldRes,
  getIndustry1FromHld,
} from "@/lib/universities/calculators/holland-data/hld-calculator";
import { getIndustryL1Name } from "@/lib/universities/convertors/industry-l1";

// Supporting component
function HldResChart({
  form,
  rerender,
}: {
  form: UseFormReturn<HldQuestions>;
  rerender: boolean;
}) {
  // State init

  const [hldChart, setHldChart] = useState<DoughnutChartProps>({
    title: "Phân bố các nhóm tính cách",
    labels: [],
    values: [],
    colors: [],
  });

  const [rcmIndustryL1Chart, setrcmIndustryL1Chart] = useState<BarChartProps>({
    title: "Mức độ phù hợp với các nhóm ngành",
    labels: [],
    values: [],
    colors: [],
  });

  const [hldColors, setHldColors] = useState<ChartColors>([]);
  const [rcmColors, setRcmColors] = useState<ChartColors>([]);

  // Init colors, one time
  useEffect(() => {
    setHldColors(getRandColorArr(6));
    setRcmColors(getRandColorArr(23));
  }, []);

  // All inits, except colors
  useEffect(() => {
    const scores = form
      .getValues("hldQuestions")
      .map((opn) => opn.freqNodes.map((freq) => freq.score));

    const hldRes = getHldRes(scores);
    const rcmIndustry = getIndustry1FromHld(hldRes);

    setHldChart({
      title: "Phân bố các nhóm tính cách",
      labels: Array.from(hldRes.keys()).map(getHldName),
      values: Array.from(hldRes.values()),
      colors: hldColors,
    });

    setrcmIndustryL1Chart({
      title: "Mức độ phù hợp với các nhóm ngành",
      labels: Array.from(rcmIndustry.keys()).map(getIndustryL1Name),
      values: Array.from(rcmIndustry.values()),
      colors: rcmColors,
    });
  }, [rerender, hldColors, rcmColors]);

  async function copyRes() {
    function formatChartForUser(chart: {
      title: string;
      labels: string[];
      values: number[];
    }): string {
      const lines = [
        `${chart.title.toUpperCase()}:`,
        ...chart.labels.map((label, i) => `- ${label}: ${chart.values[i]}(đ).`),
      ];

      return lines.join("\n");
    }

    const charts = [hldChart, rcmIndustryL1Chart];
    const formatted = `${charts
      .map(formatChartForUser)
      .join("\n\n")}\n\n Tạo bởi CỔNG ĐẠI HỌC`;

    await navigator.clipboard.writeText(formatted);
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-8">
      {/* Doughnut chart */}
      <div className="min-w-[90vw] md:w-1/2 h-80 md:h-96">
        <DoughnutChart
          title={hldChart.title}
          labels={hldChart.labels}
          values={hldChart.values}
          colors={hldChart.colors}
        />
      </div>

      {/* Bar chart */}
      <div
        className="min-w-[70vw] max-w[80vw] md:w-1/2"
        style={{
          height: `${Math.max(rcmIndustryL1Chart.labels.length * 20, 400)}px`,
        }}
      >
        <BarChart
          title={rcmIndustryL1Chart.title}
          labels={rcmIndustryL1Chart.labels}
          values={rcmIndustryL1Chart.values}
          colors={rcmIndustryL1Chart.colors}
        />
      </div>

      <Quote type="tip">
        Các mốc điểm như trên không được quy đổi mà giữ nguyên, nên có thể so
        sánh mức độ phù hợp giữa các lần kiểm tra với nhau.
      </Quote>

      <ToggleButton
        variant="outline"
        className="w-fit p-1 px-2"
        notExeIcon={
          <>
            <Clipboard className="button-icon" /> Sao chép kết quả
          </>
        }
        exeIcon={
          <>
            <Check className="button-icon text-green-500" /> Đã sao chép
          </>
        }
        onClick={copyRes}
      />
    </div>
  );
}

// Main component
export default function HldRes({
  form,
}: {
  form: UseFormReturn<HldQuestions>;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [rerender, setRerender] = useState(false);

  function viewResButtonHandler() {
    setRerender((prev) => !prev);
    setSubmitted(true);
  }

  return (
    <div className="mt-5 flex flex-col items-center justify-center">
      <Button
        className="submit-button w-fit mx-auto flex items-center justify-center"
        onClick={viewResButtonHandler}
      >
        <WandSparkles className="button-icon" /> Xem {submitted ? "lại" : ""}{" "}
        kết quả
      </Button>

      {submitted ? <HldResChart form={form} rerender={rerender} /> : <></>}
    </div>
  );
}
