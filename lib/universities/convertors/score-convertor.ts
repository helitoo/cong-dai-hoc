import type { Dist } from "@/lib/universities/convertors/exam-distributions";

export function round2(value: number, appreciate: number = 2): number {
  const base = Math.pow(10, appreciate);
  value = Math.round(value * base) / base;

  return value;
}

export function getInRangeVal(value: number, min: number, max: number) {
  if (value < min) value = min;
  else if (value > max) value = max;
  return value;
}

export function getInterpolate(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number
) {
  if (x1 === x2) return y2;

  return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
}

export function getBinSize(min: number, max: number, distSize: number) {
  return (max - min) / (distSize - 1);
}

export function getScore(
  index: number,
  min: number,
  max: number,
  distSize: number
) {
  return min + index * getBinSize(min, max, distSize);
}

export function getIndex(
  score: number,
  min: number,
  max: number,
  binCount: number
) {
  return Math.round(((score - min) / (max - min)) * (binCount - 1));
}

export function getCumlative(arr: number[]) {
  const ans = new Array(arr.length);

  ans[0] = arr[0];

  for (let i = 1; i < arr.length; i++) ans[i] = ans[i - 1] + arr[i];

  return ans;
}

export function getPercentile(value: number, dist: Dist) {
  const cumdist = getCumlative(dist.freq);

  for (let i = 1; i < dist.freq.length; i++) {
    const score1 = getScore(i - 1, dist.min, dist.max, dist.freq.length);
    const score2 = getScore(i, dist.min, dist.max, dist.freq.length);

    if (score1 <= value && value <= score2) {
      const quan1 = cumdist[i - 1];
      const quan2 = cumdist[i];

      return (
        getInterpolate(score1, quan1, score2, quan2, value) /
        cumdist[cumdist.length - 1]
      );
    }
  }

  if (value < dist.min) return 0;
  else return 1;
}

export function getScoreAtPercentile(per: number, dist: Dist) {
  if (per < 0) return dist.min;
  else if (per > 1) return dist.max;

  const cumdist = getCumlative(dist.freq);

  for (let i = 1; i < dist.freq.length; i++) {
    const per1 = cumdist[i - 1] / cumdist[cumdist.length - 1];
    const per2 = cumdist[i] / cumdist[cumdist.length - 1];

    if (per1 <= per && per <= per2) {
      const score1 = getScore(i - 1, dist.min, dist.max, dist.freq.length);
      const score2 = getScore(i, dist.min, dist.max, dist.freq.length);

      return getInterpolate(per1, score1, per2, score2, per);
    }
  }

  return dist.max;
}

export function getConvertedScore(
  firstScore: number,
  firstDist: Dist,
  secDist: Dist
): { score: number; percentile: number } {
  const percentile = getPercentile(firstScore, firstDist);
  const score = getScoreAtPercentile(percentile, secDist);
  return { score, percentile };
}
