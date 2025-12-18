import type { MainInfo } from "@/lib/universities/calculators/score-data/score-calculator";
import { round2 } from "@/lib/universities/convertors/score-convertor";
import type { SubjectGroupId } from "@/lib/universities/convertors/subject-groups";

// Sắp xếp các group Info giảm dần
export function getDescMainInfoByGroup(mainInfo: MainInfo) {
  for (const [, groupInfo] of mainInfo) {
    const sorted = [...groupInfo.entries()].sort(
      (a, b) => b[1][0].mainScore - a[1][0].mainScore
    );

    groupInfo.clear();
    for (const [k2, v] of sorted) groupInfo.set(k2, v);
  }

  return mainInfo;
}

// Thống kê điểm các tổ hợp môn
export function getGroupStatistics(mainInfo: MainInfo) {
  const temp = new Map<SubjectGroupId, { sum: number; count: number }>();

  for (const [, groupInfo] of mainInfo) {
    for (const [group, scores] of groupInfo) {
      if (group !== "root" && scores[0].mainScore <= 31) {
        const stat = temp.get(group) ?? { sum: 0, count: 0 };
        stat.sum += scores[0].mainScore;
        stat.count++;
        temp.set(group, stat);
      }
    }
  }

  const rawRes = new Map<SubjectGroupId, number>();
  for (const [group, { sum, count }] of temp) {
    rawRes.set(group, round2(sum / count));
  }

  const res = new Map(
    [...rawRes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  );

  return res;
}
