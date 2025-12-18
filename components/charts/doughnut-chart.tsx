import type { ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "@/components/charts/registration";

import type { ChartColors } from "@/components/charts/chart-colors";

export type DoughnutChartProps = {
  title: string;
  labels: string[];
  values: number[];
  colors: ChartColors;
};

export function DoughnutChart({
  title,
  labels,
  values,
  colors,
}: DoughnutChartProps) {
  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        hoverOffset: 10,
        backgroundColor: colors.map((c) => c.background),
        borderColor: colors.map((c) => c.border),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
