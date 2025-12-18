import type { MethodId } from "@/lib/universities/convertors/method";
import { getInterpolate } from "@/lib/universities/convertors/score-convertor";
import type { SubjectId } from "@/lib/universities/convertors/subjects";
import { JsonTable } from "@/public/data/json-table-model";

import {
  getScore,
  round2,
} from "@/lib/universities/convertors/score-convertor";

type ExamDistribution = {
  id: string;
  base: number;
  min: number;
  max: number;
  freq: number[];
};

const examDistributionTable = await new JsonTable<ExamDistribution>().load(
  "exam-distributions"
);

export type Dist = Omit<ExamDistribution, "id">;

export function getDist(
  methodId: MethodId,
  subjectId: SubjectId,
  year: string
): Dist | undefined {
  const fetchResult = examDistributionTable.getValByField(
    `${methodId}-${subjectId}-${year}`,
    "id",
    ["base", "min", "max", "freq"]
  ) as (number | number[])[] | undefined;

  if (!fetchResult) return fetchResult;
  else
    return {
      base: fetchResult[0] as number,
      min: fetchResult[1] as number,
      max: fetchResult[2] as number,
      freq: fetchResult[3] as number[],
    };
}

export function getBase(methodId: MethodId) {
  switch (methodId) {
    case "dgtd":
      return 100;
    case "dghn":
      return 150;
    case "dgsg":
      return 1200;
    case "vsat":
      return 450;
    default:
      return 30;
  }
}

export function generatePointsFromDist(
  dist: Dist,
  scaleQuantityTo: number | null = null,
  scaleScoreTo: number | null = null
) {
  const { base, min, max, freq } = dist;
  // Scale quantity

  let scaledFreq = [...freq];

  if (scaleQuantityTo !== null) {
    const max = Math.max(...scaledFreq);
    scaledFreq = scaledFreq.map((f) => round2((f / max) * scaleQuantityTo));
  }

  // Extract points

  const points: { x: number; y: number }[] = [];

  for (let j = 0; j < scaledFreq.length; j++) {
    let score = getScore(j, min, max, scaledFreq.length);

    if (scaleScoreTo !== null) score = round2((score / base) * scaleScoreTo);

    const y = scaledFreq[j];

    points.push({ x: score, y });
  }

  return points;
}

export function calcMean(dist: Dist): number {
  let totalCount = 0;
  let totalValue = 0;

  for (let i = 0; i < dist.freq.length; i++) {
    const score = getScore(i, dist.min, dist.max, dist.freq.length);
    const f = dist.freq[i];

    totalCount += f;
    totalValue += score * f;
  }

  if (totalCount === 0) return 0;
  return totalValue / totalCount;
}

export function calcMedian(dist: Dist): number {
  let totalCount = 0;
  for (const f of dist.freq) totalCount += f;
  if (totalCount === 0) return 0;

  const mid = totalCount / 2;
  let cumulative = 0;

  for (let i = 0; i < dist.freq.length; i++) {
    cumulative += dist.freq[i];
    if (cumulative >= mid) {
      return getScore(i, dist.min, dist.max, dist.freq.length);
    }
  }

  return dist.min;
}

export function calcStdDev(dist: Dist): number {
  const mean = calcMean(dist);
  let totalCount = 0;
  let sumSquares = 0;

  for (let i = 0; i < dist.freq.length; i++) {
    const score = getScore(i, dist.min, dist.max, dist.freq.length);
    const f = dist.freq[i];

    totalCount += f;
    sumSquares += f * Math.pow(score - mean, 2);
  }

  if (totalCount === 0) return 0;
  return Math.sqrt(sumSquares / totalCount);
}

// ----------------- scaleFreqSize -----------------
function scaleFreqSize(dist: Dist, targetSize: number): Dist {
  const size = dist.freq.length;

  // Không cần thay đổi
  if (size === targetSize) return dist;

  const newFreq = new Array(targetSize).fill(0);

  if (targetSize < size) {
    const ratio = size / targetSize;
    for (let i = 0; i < targetSize; i++) {
      const start = Math.floor(i * ratio);
      const end = Math.floor((i + 1) * ratio);
      let sum = 0;
      for (let j = start; j < end; j++) sum += dist.freq[j];
      newFreq[i] = sum;
    }
  } else {
    const step = (size - 1) / (targetSize - 1);
    for (let i = 0; i < targetSize; i++) {
      const x = i * step;
      const x1 = Math.floor(x);
      const x2 = Math.min(size - 1, x1 + 1);
      if (x1 === x2) newFreq[i] = dist.freq[x1];
      else {
        newFreq[i] = getInterpolate(x1, dist.freq[x1], x2, dist.freq[x2], x);
      }
    }
  }

  return {
    base: dist.base,
    min: dist.min,
    max: dist.max,
    freq: newFreq,
  };
}

// ----------------- scaleScore -----------------
function scaleScore(dist: Dist, coef: number): Dist {
  if (coef === 1) return dist;

  return {
    base: round2(dist.base * coef),
    min: round2(dist.min * coef),
    max: round2(dist.max * coef),
    freq: dist.freq.slice(),
  };
}

// Tích chập 2 mảng
function convolve(a: number[], b: number[]): number[] {
  const n = a.length;
  const m = b.length;
  const result = new Array(n + m - 1).fill(0);

  for (let i = 0; i < n; i++) {
    const ai = a[i];
    if (ai === 0) continue;

    for (let j = 0; j < m; j++) {
      if (b[j] !== 0) result[i + j] += ai * b[j];
    }
  }

  return result;
}

// Lấy hàm phân phối chuẩn
function getNormalFreq(freq: number[]) {
  if (!freq.length) return [];

  const total = freq.reduce((sum, v) => sum + v, 0);
  if (total === 0) return freq.map(() => 0);

  return freq.map((v) => v / total);
}

// Tích chập phổ điểm
export function getCombinedDist(
  dists: Dist[],
  coefs?: number[]
): Dist | undefined {
  if (!dists.length) return undefined;

  // Chuẩn hoá hệ số
  if (!coefs) coefs = new Array(dists.length).fill(1);

  if (coefs.length < dists.length) {
    const missing = dists.length - coefs.length;
    coefs = [...coefs, ...new Array(missing).fill(1)];
  }
  if (coefs.length > dists.length) {
    coefs = coefs.slice(0, dists.length);
  }

  // Chuẩn hoá tất cả phổ con
  const targetFreqSize = Math.min(...dists.map((d) => d.freq.length));
  const normalized = dists.map((dist, i) =>
    scaleScore(scaleFreqSize(dist, targetFreqSize), coefs![i])
  );

  // 4. Tính base/min/max kết quả
  const finalBase = normalized.reduce((s, d) => s + d.base, 0);
  const finalMin = normalized.reduce((s, d) => s + d.min, 0);
  const finalMax = normalized.reduce((s, d) => s + d.max, 0);

  // 6. Tích chập tất cả phổ
  let finalFreq = normalized[0].freq.slice();

  for (let i = 1; i < normalized.length; i++)
    finalFreq = convolve(finalFreq, normalized[i].freq);

  // Hiệu chỉnh phổ kết quả

  finalFreq = getNormalFreq(finalFreq);

  const targetFreqSum = Math.min(
    ...dists.map((d) => d.freq.reduce((a, b) => a + b, 0))
  );
  finalFreq = finalFreq.map((f) => Math.round(f * targetFreqSum));

  const combinedDist: Dist = {
    base: finalBase,
    min: finalMin,
    max: finalMax,
    freq: finalFreq,
  };

  return scaleFreqSize(combinedDist, targetFreqSize);
}
