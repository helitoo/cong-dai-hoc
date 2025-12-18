import type {
  HldType,
  OpnNode,
} from "@/lib/universities/calculators/holland-data/hld-questions";
import { IndustryL1Id } from "@/lib/universities/convertors/industry-l1";
import { sortMap } from "@/lib/universities/general-helpers/map-processor";

export function getHldName(hldType: HldType) {
  switch (hldType) {
    case "r":
      return "R - Realistic";
    case "i":
      return "I - Investigative";
    case "a":
      return "A - Artistic";
    case "s":
      return "S - Social";
    case "e":
      return "E - Enterprising";
    default:
      return "C - Conventional";
  }
}

export type HldRes = Map<HldType, number>;

export function getHldRes(hldScores: number[][]): HldRes {
  let res: Map<HldType, number> = new Map([
    ["r", 0],
    ["i", 0],
    ["a", 0],
    ["s", 0],
    ["e", 0],
    ["c", 0],
  ]);

  hldScores.forEach((scores) => {
    Array.from(res.keys()).forEach((key, index) => {
      res.set(key, (res.get(key) ?? 0) + scores[index]);
    });
  });

  // Normalize to >= 0

  const minScore = Math.min(...res.values());

  if (minScore < 0) {
    const delta = -minScore + 1;
    for (const [hldType, score] of res.entries())
      res.set(hldType, score + delta);
  }

  return sortMap(res) as Map<HldType, number>;
}

const hld2Industry1: Map<HldType, IndustryL1Id[]> = new Map([
  [
    "r",
    [
      "748",
      "751",
      "752",
      "754",
      "758",
      "762",
      "764",
      "772",
      "784",
      "785",
      "786",
      "748",
      "751",
      "752",
      "754",
      "758",
      "762", // ưu tiên kỹ thuật, sản xuất, vận tải, nông lâm, sức khỏe
    ],
  ],
  [
    "i",
    [
      "714",
      "731",
      "732",
      "742",
      "744",
      "746",
      "748",
      "751",
      "752",
      "772",
      "785",
      "738",
      "744",
      "746",
      "748", // tăng trọng số cho các ngành KH tự nhiên, Toán & thống kê, Máy tính
    ],
  ],
  [
    "a",
    [
      "721",
      "722",
      "732",
      "758",
      "776",
      "721",
      "722", // lặp lại nghệ thuật, nhân văn
    ],
  ],
  [
    "s",
    [
      "714",
      "731",
      "732",
      "772",
      "776",
      "781",
      "786",
      "772",
      "776", // tăng trọng số cho sức khỏe và dịch vụ xã hội
    ],
  ],
  [
    "e",
    [
      "734",
      "738",
      "751",
      "758",
      "772",
      "781",
      "785",
      "734",
      "738", // tăng trọng số cho kinh doanh & pháp luật
    ],
  ],
  [
    "c",
    [
      "714",
      "732",
      "734",
      "746",
      "751",
      "754",
      "781",
      "784",
      "786",
      "746",
      "751",
      "754", // tăng trọng số cho Toán & kỹ thuật
    ],
  ],
]);

export function getIndustry1FromHld(hldRes: Map<HldType, number>) {
  const res: Map<IndustryL1Id, number> = new Map([
    ["714", 0],
    ["721", 0],
    ["722", 0],
    ["731", 0],
    ["732", 0],
    ["734", 0],
    ["738", 0],
    ["742", 0],
    ["744", 0],
    ["746", 0],
    ["748", 0],
    ["751", 0],
    ["752", 0],
    ["754", 0],
    ["758", 0],
    ["762", 0],
    ["764", 0],
    ["772", 0],
    ["776", 0],
    ["781", 0],
    ["784", 0],
    ["785", 0],
    ["786", 0],
  ]);

  for (const [hldType, score] of hldRes.entries())
    if (score > 0)
      hld2Industry1.get(hldType)?.forEach((industryL1Id) => {
        res.set(industryL1Id, (res.get(industryL1Id) ?? 0) + score);
      });

  return sortMap(res) as Map<IndustryL1Id, number>;
}
