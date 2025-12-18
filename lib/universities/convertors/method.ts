const methodIds = [
  "htpv",
  "uttt",
  "xtkh",
  "dgtd",
  "dgsg",
  "dghn",
  "dgcb",
  "dgsp",
  "dgca",
  "vsat",
  "thpt",
  "thhb",
  "ccqt",
] as const;

export type MethodId = (typeof methodIds)[number];

//
export function getMethodName(methodId: string) {
  switch (methodId) {
    case "thpt":
      return "TN";
    case "thhb":
      return "HB";
    case "dghn":
      return "HSA";
    case "dgsg":
      return "V-ACT";
    case "vsat":
      return "V-SAT";
    case "dgca":
      return "CAND";
    case "dgsp":
      return "SPT";
    case "dgcb":
      return "H-SCA";
    case "dgtd":
      return "TSA";
    case "ccqt":
      return "CCQT";
    default:
      return "Khác";
  }
}

import { getExactData } from "@/lib/universities/general-helpers/get-exact-data";

export function getExactMethodFromName(methodName: string) {
  return getExactData(
    methodName,
    [
      "Tốt Nghiệp THPTQG",
      "Học bạ THPT",
      "Đánh giá năng lực ĐHQG-HN (ĐGNL-ĐHQG-HN HSA)",
      "Đánh giá năng lực ĐHQG-HCM (ĐGNL-ĐHQG-HCM V-ACT)",
      "V-SAT",
      "Đánh giá năng lực Công an nhân dân (ĐGNL CAND)",
      "Đánh giá năng lực trường Đại học sư phạm Hà Nội (ĐGNL HNUE)",
      "Đánh giá năng lực chuyên biệt trường Đại học sư phạm TP.HCM (ĐGNLCB HCMUE)",
      "Đánh giá tư duy Đại học bách khoa Hà Nội (TSA HUST)",
      "Chứng chỉ quốc tế",
    ],
    [
      "thpt",
      "thhb",
      "dghn",
      "dgsg",
      "vsat",
      "dgca",
      "dgsp",
      "dgcb",
      "dgtd",
      "ccqt",
    ]
  );
}
