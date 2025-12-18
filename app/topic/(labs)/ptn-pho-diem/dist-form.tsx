"use client";

import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { getColorDistinctWith } from "@/components/charts/chart-colors";

import { LineChart, type LineDataset } from "@/components/charts/line-chart";

import {
  generatePointsFromDist,
  type Dist,
} from "@/lib/universities/convertors/exam-distributions";

import CombinedDistForm from "@/app/topic/ptn-pho-diem/combined-dist-form";
import ExamDistForm from "@/app/topic/ptn-pho-diem/exam-dist-form";
import DistStatisticsTable from "@/app/topic/ptn-pho-diem/dist-statistics-table";

// Main component function
export default function DistForm() {
  const [dists, setDists] = useState<
    Map<string, { dist: Dist; dataset: LineDataset }>
  >(new Map());

  const [quantityScale, setQuantityScale] = useState<boolean>(true);
  const [scoreScale, setScoreScale] = useState<boolean>(true);

  // Update dists.data
  useEffect(() => {
    setDists((prev) => {
      const next = new Map(prev);

      for (const [query, entry] of prev.entries()) {
        const dist = entry.dist;

        const newPoints = generatePointsFromDist(
          dist,
          quantityScale ? 10 : null,
          scoreScale ? 10 : null
        );

        next.set(query, {
          ...entry,
          dataset: {
            ...entry.dataset,
            points: newPoints,
          },
        });
      }

      return next;
    });
  }, [quantityScale, scoreScale]);

  function addDist(dist: Dist, label: string) {
    const points = generatePointsFromDist(
      dist,
      quantityScale ? 10 : null,
      scoreScale ? 10 : null
    );
    const color = getColorDistinctWith(
      Array.from(dists.values()).map((v) => v.dataset.color),
      0.1
    );

    setDists((prev) => {
      const newMap = new Map(prev);
      newMap.set(label, { dist, dataset: { label, points, color } });
      return newMap;
    });
  }

  // Return value
  return (
    <div className="flex flex-col space-y-5">
      <ExamDistForm addDist={addDist} />
      <CombinedDistForm addDist={addDist} />

      <div className="flex items-center justify-center gap-5">
        <div className="flex items-center gap-5">
          <Switch
            id="scale-quantity"
            checked={quantityScale}
            onCheckedChange={setQuantityScale}
          />
          <Label htmlFor="scale-quantity">
            Quy số lượng thí sinh về 10 (tt)
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="scale-score"
            checked={scoreScale}
            onCheckedChange={setScoreScale}
          />
          <Label htmlFor="scale-score">Quy thang điểm về 10 (tt)</Label>
        </div>
      </div>

      <div className="h-[400px]">
        <LineChart
          datasets={Array.from(dists.values()).map((v) => v.dataset)}
          xLabel={`Mốc điểm ${scoreScale ? "(đã quy về thang 10)" : ""}`}
          yLabel={`Số thí sinh ${quantityScale ? "(đã quy về 10)" : ""}`}
        />
      </div>

      <DistStatisticsTable
        labels={Array.from(dists.keys())}
        dists={Array.from(dists.values()).map((v) => v.dist)}
        colors={Array.from(dists.values()).map((v) => v.dataset.color.border)}
      />
    </div>
  );
}
