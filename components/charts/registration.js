"use client";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement, // doughnut
  BarElement, // bar
  LineElement, // line
  PointElement, // line
  CategoryScale, // bar + line
  LinearScale, // bar + line
  Tooltip,
  Legend,
  Title,
  Filler
);
