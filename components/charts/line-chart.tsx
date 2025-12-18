import { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

import type { ChartColor } from "@/components/charts/chart-colors";

import "@/components/charts/registration";

export type Poit = {
  x: number;
  y: number;
};

export type LineDataset = {
  label: string;
  points: { x: number; y: number }[];
  color: ChartColor;
};

export type LineChartProps = {
  title?: string;
  datasets: LineDataset[];
  xLabel?: string;
  yLabel?: string;
};

export function LineChart({
  datasets,
  title = "",
  xLabel = "",
  yLabel = "",
}: LineChartProps) {
  const data = {
    datasets: datasets.map((ds) => ({
      label: ds.label,
      data: ds.points,
      borderColor: ds.color.border,
      backgroundColor: ds.color.background,
      parsing: false as false,
      fill: "origin",
      tension: 0,
      pointRadius: 2,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        type: "linear",
        title: { display: xLabel ? true : false, text: xLabel },
      },
      y: {
        title: { display: yLabel ? true : false, text: yLabel },
      },
    },

    plugins: {
      title: {
        display: title ? true : false,
        text: title,
      },
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return <Line data={data} options={options} />;
}
