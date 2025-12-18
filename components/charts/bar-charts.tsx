import type { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

import type { ChartColors } from "@/components/charts/chart-colors";
import "@/components/charts/registration";

const DEFAULT_BORDER = "#0ea5e9";
const DEFAULT_BACKGROUND = "rgba(14,165,233,0.1)";
const BAR_HEIGHT = 34;

export type BarChartProps = {
  title: string;
  labels: string[];
  values: number[];
  colors?: ChartColors | undefined;
};

export function BarChart({
  title,
  labels,
  values,
  colors = undefined,
}: BarChartProps) {
  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: !colors
          ? DEFAULT_BORDER
          : colors.map((c) => c.background),
        borderColor: !colors ? DEFAULT_BORDER : colors.map((c) => c.border),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,

    indexAxis: "y",

    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: { display: false },
    },

    scales: {
      y: {
        type: "category",
        ticks: {
          autoSkip: false,
        },
      },

      x: { type: "linear" },
    },
  };

  return (
    <div style={{ width: "100%", height: labels.length * BAR_HEIGHT }}>
      <Bar data={data} options={options} />
    </div>
  );
}
