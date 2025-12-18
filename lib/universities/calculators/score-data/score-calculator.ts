import type { ScoreData } from "@/lib/universities/calculators/score-data/score-schema";

import { SubjectId } from "@/lib/universities/calculators/score-data/score-schema";

import {
  getSubjectsFromGroup,
  subjectGroupIds,
  type SubjectGroupId,
} from "@/lib/universities/convertors/subject-groups";

import {
  getConvertedScore,
  getInRangeVal,
  round2,
} from "@/lib/universities/convertors/score-convertor";

import {
  getBase,
  getCombinedDist,
  getDist,
  type Dist,
} from "@/lib/universities/convertors/exam-distributions";
import { MethodId } from "@/lib/universities/convertors/method";

const CURRENT_YEAR = "2025";

// Kiểu đơn vị lưu trữ kết quả tính toán
export type UnitScoreInfo = {
  mainScore: number; // Điểm số trước khi cộng extra score.
  extraScore: number; // Điểm sẽ được cộng thêm vào main score để thành điểm xét tuyển
};

// Kiểu lưu trữ kết quả tính toán cho từng tổ hợp
// Key 'root' biểu thị đây là điểm thi gốc (outside exam), chưa quy đổi về tổ hợp
// Ngoại trừ thhb, các phương thức khác đều tự hiểu UnitScoreInfo[i] có nghĩa là môn thứ i trong tổ hợp môn là môn chính có hệ số 2
// i = 0 tức là không có môn chính
export type GroupScoreInfo = Map<SubjectGroupId | "root", UnitScoreInfo[]>;

// Kiểu lưu trữ kết quả tính toán cho từng phương thức
export type MainInfo = Map<
  | "thpt"
  | "thhb"
  | "dgsg"
  | "dghn"
  | "vsat"
  | "dgsp"
  | "dgcb"
  | "dgca"
  | "dgtd"
  | "k01"
  | "vnuhcm",
  GroupScoreInfo
>;

// Extra info: Chứa thông tin điểm khuyến khích (kk), điểm ưu tiên (ut), điểm ngoại ngữ sau quy đổi (an)
export type ExtraInfo = Map<"kk" | "ut" | "an" | "ccqt", number>;

// Dữ liệu trả về bao gồm 3 attribute:
// Applied groups: Mảng chứa các tổ hợp môn khả dĩ, sinh ra từ Applied subjects
export type ScoreRes = {
  appliedGroups: SubjectGroupId[];
  extraInfo: ExtraInfo;
  mainInfo: MainInfo;
};

// Helpers

// Lấy extra score
function getExtraScore(
  score: number,
  rawExtraScore: number, // Phần điểm dự định là extra score, sẽ bị giảm bớt dựa trên base, cũng chính là kk + ut
  base: number
) {
  rawExtraScore = Math.min(rawExtraScore, 0.3 * base);

  if (score < 0.75 * base) return rawExtraScore;
  else return ((base - score) / (0.75 * base)) * rawExtraScore;
}

// Wraper tạo ra object UnitScoreInfo
// Cần wrapper vì mainScore phải được tạo ra trước extraScore
function getUnitScoreInfo(
  mainScore: number,
  rawExtraScore: number,
  base: number
): UnitScoreInfo {
  const extraScore = getExtraScore(mainScore, rawExtraScore, base);
  return { mainScore, extraScore };
}

// Trả về điểm số theo 1 tổ hợp môn
// Không áp dụng extra score
// Áp dụng quy đổi ngoại ngữ
function getGroupScore(
  subjectGroupId: SubjectGroupId,
  scores:
    | Map<SubjectId, number | number[]>
    | Record<SubjectId, number | number[]>,
  nn: number = 0,
  index: number | undefined = undefined,
  coefs: Partial<Record<SubjectId, number>> | undefined = undefined
) {
  let res = 0;

  const subjects = getSubjectsFromGroup(subjectGroupId) as [
    SubjectId,
    SubjectId,
    SubjectId
  ];

  const isMap = scores instanceof Map;

  // Thao tác trung gian khiến việc xử lý map (đối với score res) và record (đối với schema) là như nhau
  const getValue = (subject: SubjectId): number | number[] | undefined => {
    return isMap
      ? (scores as Map<SubjectId, number | number[]>).get(subject)
      : (scores as Record<SubjectId, number | number[]>)[subject];
  };

  subjects.forEach((subject) => {
    const raw = getValue(subject);

    // Lấy điểm 1 môn

    let score: number = 0;

    if (Array.isArray(raw)) score = raw[index ?? 0] ?? 0;
    else if (typeof raw === "number") score = raw;

    if (subject === "an" && nn > score) score = nn;

    // Lấy hệ số
    const coef = coefs?.[subject] ?? 1;

    res += score * coef;
  });

  return res;
}

// Lấy điểm sau khi quy đổi điểm thi các kỳ thi riêng khác thang 30 về thang 30 theo phổ thpt
function getConvertedScoreFromOutsideExam(
  rootExam: MethodId,
  rootScore: number,
  thptSubjectGroup: SubjectGroupId,
  year: string,
  rootBase: number = getBase(rootExam)
) {
  const defaultDist: Dist = {
    freq: [0, 1, 6, 0],
    base: rootBase,
    min: 0,
    max: rootBase,
  };

  const examDist = getDist(rootExam, "al", year) ?? defaultDist;

  const thptDist =
    getCombinedDist(
      getSubjectsFromGroup(thptSubjectGroup).map(
        (subj) => getDist("thpt", subj, year) ?? defaultDist
      )
    ) ?? defaultDist;

  return getConvertedScore(rootScore, examDist, thptDist).score;
}

// Sinh ra applied subject groups dựa vào applied subjects
function getAppliedGroups(scoreData: ScoreData) {
  const res: SubjectGroupId[] = [];

  // Không xét 2 tổ hợp đầu là A000 và A001
  subjectGroupIds.slice(2).forEach((group) => {
    let groupSubjects = getSubjectsFromGroup(group);

    if (
      groupSubjects.every((subj) =>
        scoreData.appliedSubjects.includes(subj as SubjectId)
      )
    )
      res.push(group);
  });

  return res;
}

// Lấy điểm khuyến khích
// Điểm khuyến khích không được quá 10% thang điểm, hàm này trả về điểm khuyến khích thang 3
function getKKScore(scoreData: ScoreData, ccqtScore: number) {
  let kkScore = 0;

  // Dựa trên thành tích cá nhân (lấy thành tích cao nhất)
  const kkScores = [
    [1, 1.25, 1.5, 1.75],
    [2, 2.25, 2.5, 2.75],
    [3, 3, 3, 3],
  ];

  scoreData.achievements
    .filter((val) => val.prize && val.type)
    .forEach(
      (val) => (kkScore = Math.max(kkScore, kkScores[val.type!][val.prize!]))
    );

  // Dựa trên chứng chỉ quốc tế (lấy chứng chỉ lớn nhất)

  kkScore = Math.max(kkScore, round2((ccqtScore / 30) * 3));

  return kkScore;
}

// Lấy điểm ưu tiên
function getUtScore(scoreData: ScoreData) {
  let utScore = 0;

  if (scoreData.priority.dt)
    if (scoreData.priority.dt <= 4) utScore += 2;
    else utScore += 1;

  if (scoreData.priority.kv)
    switch (scoreData.priority.kv) {
      case 1:
        utScore += 0.25;
        break;
      case 2:
        utScore += 0.5;
        break;
      default:
        utScore += 0.75;
    }

  return utScore;
}

function getCcqtScore(scoreData: ScoreData) {
  let ccqtScore = 0;

  scoreData.certifications.forEach((cerf) => {
    let cerfScore = 0;

    switch (cerf.type) {
      case "sat":
        cerfScore = (cerf.score / 1600) * 30;
        break;
      case "act":
        cerfScore = (cerf.score / 36) * 30;
        break;
      case "alevel":
        cerfScore = (cerf.score / 6) * 30;
        break;
      case "ib":
        cerfScore = (cerf.score / 45) * 30;
        break;
    }

    ccqtScore = Math.max(ccqtScore, round2(cerfScore));
  });

  return ccqtScore;
}

// Lấy điểm quy đổi ngoại ngữ
function getConvertedAnScore(ielts: number) {
  if (ielts >= 7.5) return 10;
  else if (ielts >= 6.5) return 9.5;
  else if (ielts >= 6) return 9;
  else if (ielts >= 5.5) return 8.5;
  else if (ielts >= 5) return 8;
  else return 0;
}

// Hoàn thiện điểm thpt và thhb (nội suy các ô falsy)
function completeThhbThptScores(
  scoreData: ScoreData,
  convertedAnScore: number
) {
  // Bảng nội suy điểm, có các quy tắc sau:
  // Điểm học kỳ 2 sẽ bằng học kỳ 1
  // Index 0: Điểm mặc định HK1 lớp 10
  // Index 1: Hệ số a, b khi quy đổi điểm từ lớp 10 sang 11
  // Index 2: Hệ số a, b khi quy đổi điểm từ lớp 11 sang 12
  // Index 3: Hệ số a, b khi quy đổi điểm từ lớp 12 sang thpt
  const convertCoefs = new Map<SubjectId, any[]>([
    ["to", [6.7, [1.028, -0.99], [1.09, -1.0], [4.2, -24.78]]],
    ["nv", [6.93, [1.017, -0.83], [1.018, -0.74], [2.5, -10.5]]],
    ["vl", [7.05, [1.026, -0.64], [1.106, -0.67], [5.24, -30.87]]],
    ["hh", [7.08, [1.025, -0.56], [1.07, -0.99], [5.48, -27.45]]],
    ["sh", [7.28, [1.064, -0.39], [1.053, -0.37], [4.69, -24.23]]],
    ["ls", [7.37, [1.038, -0.41], [1.039, -0.45], [4.41, -26.04]]],
    ["dl", [7.12, [1.036, -0.39], [1.05, -0.57], [4.47, -25.96]]],
    ["gd", [7.45, [1.078, -1.29], [1.026, -0.01], [2.97, -15.2]]],
    ["th", [7.62, [1.038, -1.09], [1.063, -0.92], [3.89, -19.66]]],
    ["c1", [7.8, [1.026, -0.42], [1.045, -1.06], [3.61, -18.58]]],
    ["c2", [7.74, [1.033, -0.55], [1.026, -0.56], [2.97, -13.17]]],
    ["an", [6.55, [1.058, -1.26], [1.065, -1.23], [3.63, -18.15]]],
  ]);

  // Helper trả về điểm số khi cho biết index của bảng quy đổi (coef)
  const getScoreFromCoefs = (
    score: number,
    subject: SubjectId,
    coefIndex: 0 | 1 | 2 | 3
  ) => {
    let coefs = (convertCoefs.get(subject) ?? [])[coefIndex];

    return getInRangeVal(round2(coefs[0] * score + coefs[1]), 0, 10);
  };

  // Helper tính điểm trung bình 1 năm học, gồm hk1 và hk2
  const getFullYearScore = (hk1Score: number, hk2Score: number) =>
    round2((hk1Score + 2 * hk2Score) / 3);

  // Xử lý chính
  for (const [subj, scores] of Object.entries(scoreData.thhb) as [
    SubjectId,
    number[]
  ][]) {
    if (!scoreData.appliedSubjects.includes(subj)) continue;

    // HK1 lop 10
    if (!scores[0]) scores[0] = (convertCoefs.get(subj) ?? [])[0] ?? 0;
    // HK2 lop 10
    if (!scores[1]) scores[1] = scores[0];

    // HK1 lop 11
    if (!scores[2])
      scores[2] = getScoreFromCoefs(
        getFullYearScore(scores[0], scores[1]),
        subj,
        1
      );
    // HK2 lop 11
    if (!scores[3]) scores[3] = scores[2];

    // HK1 lop 12
    if (!scores[4])
      scores[4] = getScoreFromCoefs(
        getFullYearScore(scores[2], scores[3]),
        subj,
        2
      );
    // HK2 lop 12
    if (!scores[5]) scores[5] = scores[4];

    // thpt
    if (!scoreData.thpt[subj]) {
      scoreData.thpt[subj] = getScoreFromCoefs(
        (getFullYearScore(scores[0], scores[1]) +
          getFullYearScore(scores[2], scores[3]) +
          getFullYearScore(scores[4], scores[5])) /
          3,
        subj,
        3
      );
    }
  }

  // Áp dụng điểm ngoại ngữ quy đổi
  if (scoreData.appliedSubjects.includes("an")) {
    scoreData.thhb.an = scoreData.thhb.an.map((score) =>
      score && convertedAnScore > score ? convertedAnScore : score
    ) as [number, number, number, number, number, number];

    if (convertedAnScore > (scoreData.thpt.an ?? 0))
      scoreData.thpt.an = convertedAnScore;
  }
}

// Phương thức thhb
// Chỉ lấy điểm thi thhb, không có môn chính nhưng cần tính 6 hk, 5 hk, 3 hk, 3 năm, 2 năm, 2 năm 1 hk, 1 năm
function calcThhb(
  scoreData: ScoreData,
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number
) {
  // Bổ sung điểm 6 hk, 5 hk, 3 hk, 3 năm, 2 năm, 2 năm 1 hk, 1 năm

  const rawRes = new Map<
    SubjectId,
    [number, number, number, number, number, number, number]
  >([]);

  for (const [subj, scores] of Object.entries(scoreData.thhb) as [
    SubjectId,
    number[]
  ][]) {
    if (!scoreData.appliedSubjects.includes(subj)) continue;

    rawRes.set(subj, [0, 0, 0, 0, 0, 0, 0]);

    // 6 học kỳ
    rawRes.get(subj)![0] =
      (scores[0] + scores[1] + scores[2] + scores[3] + scores[4] + scores[5]) /
      6;

    // 5 học kỳ
    rawRes.get(subj)![1] =
      (scores[0] + scores[1] + scores[2] + scores[3] + scores[4]) / 5;

    // 3 học kỳ
    rawRes.get(subj)![2] = (scores[2] + scores[3] + scores[4]) / 3;

    // 3 năm
    rawRes.get(subj)![3] =
      (round2((scores[0] + 2 * scores[1]) / 3) +
        round2((scores[2] + 2 * scores[3]) / 3) +
        round2((scores[4] + 2 * scores[5]) / 3)) /
      3;

    // 2 năm
    rawRes.get(subj)![4] =
      (round2((scores[0] + 2 * scores[1]) / 3) +
        round2((scores[2] + 2 * scores[3]) / 3)) /
      2;

    // 2 năm 1 học kỳ
    rawRes.get(subj)![5] =
      (round2((scores[0] + 2 * scores[1]) / 3) +
        round2((scores[2] + 2 * scores[3]) / 3) +
        scores[4]) /
      3;

    // 1 năm
    rawRes.get(subj)![6] = round2((scores[4] + 2 * scores[5]) / 3);
  }

  // Xử lý chính

  const res: GroupScoreInfo = new Map();

  // Bổ sung điểm 6 hk, 5 hk, 3 hk, 3 năm, 2 năm, 2 năm 1 hk, 1 năm
  appliedGroups.forEach((group) => {
    res.set(group, [
      // 6 hk
      getUnitScoreInfo(getGroupScore(group, rawRes, 0), rawExtraScore, 30),
      // 5 hk
      getUnitScoreInfo(getGroupScore(group, rawRes, 1), rawExtraScore, 30),
      // 3 hk
      getUnitScoreInfo(getGroupScore(group, rawRes, 2), rawExtraScore, 30),
      // 3 n
      getUnitScoreInfo(getGroupScore(group, rawRes, 3), rawExtraScore, 30),
      // 2 n
      getUnitScoreInfo(getGroupScore(group, rawRes, 4), rawExtraScore, 30),
      // 2 n 1 hk
      getUnitScoreInfo(getGroupScore(group, rawRes, 5), rawExtraScore, 30),
      // 1 n
      getUnitScoreInfo(getGroupScore(group, rawRes, 6), rawExtraScore, 30),
    ]);
  });

  return res;
}

// Phương thức thpt
// Chỉ lấy điểm thi thpt, mỗi tổ hợp có thể có môn chính
function calcThpt(
  scoreData: ScoreData,
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number
) {
  const res: GroupScoreInfo = new Map();

  appliedGroups.forEach((group) => {
    res.set(group, []);

    // Không áp hệ số

    res
      .get(group)
      ?.push(
        getUnitScoreInfo(
          getGroupScore(group, scoreData.thpt),
          rawExtraScore,
          30
        )
      );

    // Áp hệ số cho môn chính

    const subjects = getSubjectsFromGroup(group);

    subjects.forEach((subject) => {
      res.get(group)?.push(
        getUnitScoreInfo(
          getGroupScore(group, scoreData.thpt, 0, undefined, {
            [subject]: 2,
          } as Record<SubjectId, number>),
          rawExtraScore,
          30
        )
      );
    });
  });

  return res;
}

// Phương thức dgsp
// Chỉ lấy điểm thi dgsp, mỗi tổ hợp có thể có môn chính
function calcDgsp(
  scoreData: ScoreData,
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number
) {
  const res: GroupScoreInfo = new Map();

  appliedGroups.forEach((group) => {
    const subjects = getSubjectsFromGroup(group) as [
      SubjectId,
      SubjectId,
      SubjectId
    ];

    if (subjects.map((subj) => scoreData.dgsp[subj]).every(Boolean)) {
      res.set(group, []);

      // Không áp hệ số

      res
        .get(group)
        ?.push(
          getUnitScoreInfo(
            getGroupScore(group, scoreData.dgsp),
            rawExtraScore,
            30
          )
        );

      // Áp hệ số cho môn chính

      subjects.forEach((subject, index) => {
        res.get(group)?.push(
          getUnitScoreInfo(
            getGroupScore(group, scoreData.dgsp, 0, undefined, {
              [subject]: 2,
            } as Record<SubjectId, number>),
            rawExtraScore,
            30
          )
        );
      });
    }
  });

  return res;
}

// Phương thức dgsg
// Bao gồm điểm gốc và điểm quy đổi sang các tổ hợp môn thpt
function calcDghn(
  scoreData: ScoreData,
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number
) {
  const res: GroupScoreInfo = new Map();

  if (!scoreData.dghn) return res;

  res.set("root", [getUnitScoreInfo(scoreData.dghn, rawExtraScore, 150)]);

  const dghnGroups: SubjectGroupId[] = ["G001", "G056", "G165", "G034", "G010"];

  dghnGroups.forEach((group) => {
    if (appliedGroups.includes(group)) {
      res.set(group, [
        getUnitScoreInfo(
          getConvertedScoreFromOutsideExam(
            "dghn",
            scoreData.dghn,
            group,
            CURRENT_YEAR
          ),
          rawExtraScore,
          30
        ),
      ]);
    }
  });

  return res;
}

// Phương thức dgsg
// Bao gồm điểm gốc và điểm quy đổi sang các tổ hợp môn thpt
function calcDgsg(
  scoreData: ScoreData,
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number
) {
  const res: GroupScoreInfo = new Map();

  // Lấy điểm thi gốc
  const rootMainScore = Object.values(scoreData.dgsg).reduce(
    (a, b) => a + (b ?? 0),
    0
  );

  if (!rootMainScore) return res;

  res.set("root", [getUnitScoreInfo(rootMainScore, rawExtraScore, 1200)]);

  // Quy đổi điểm thi sang thpt

  const dgsgGroups: SubjectGroupId[] = ["G001", "G056", "G165", "G034", "G010"];

  dgsgGroups.forEach((group) => {
    if (appliedGroups.includes(group)) {
      res.set(group, [
        getUnitScoreInfo(
          getConvertedScoreFromOutsideExam(
            "dgsg",
            rootMainScore,
            group,
            CURRENT_YEAR
          ),
          rawExtraScore,
          30
        ),
      ]);
    }
  });

  return res;
}

// Phương thức dgcb
// Ở mỗi tổ hợp môn, có 1 môn lấy điểm thi dgcb, 2 môn kia lấy điểm 6 học kỳ
function calcDgcb(
  scoreData: ScoreData,
  thhbScores: GroupScoreInfo, // Không thể dùng scoreData.thhb vì cần lấy điểm 6hk
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number
) {
  const res: GroupScoreInfo = new Map();

  appliedGroups.forEach((group) => {
    const subjects = getSubjectsFromGroup(group) as [
      SubjectId,
      SubjectId,
      SubjectId
    ];

    subjects.forEach((subject, index) => {
      if ((scoreData.dgcb as any)[subject]) {
        const dgcbScore = (scoreData.dgcb as any)[subjects[index]];

        const thhbScore =
          thhbScores.get(group)![0].mainScore -
          scoreData.thhb[subject].reduce((prev, curr) => prev + curr) / 6;

        res.set(group, [
          getUnitScoreInfo(dgcbScore + thhbScore, rawExtraScore, 30),
        ]);
      }
    });
  });

  return res;
}

// Phương thức vsat
// Bao gồm điểm gốc
function calcVsat(
  scoreData: ScoreData,
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number
) {
  const res: GroupScoreInfo = new Map();

  appliedGroups.forEach((group) => {
    const subjects = getSubjectsFromGroup(group) as [
      SubjectId,
      SubjectId,
      SubjectId
    ];

    if (
      subjects
        .map((subject) => (scoreData.vsat as any)[subject] ?? 0)
        .every(Boolean)
    ) {
      res.set(group, [
        getUnitScoreInfo(
          getGroupScore(group, scoreData.vsat as Record<SubjectId, number>),
          rawExtraScore,
          450
        ),
      ]);
    }
  });

  return res;
}

// Phương thức dgca
// Là điểm bài thi dgca kết hợp có trọng số với các tổ hợp môn thpt
function calcDgca(
  scoreData: ScoreData,
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number,
  ielts: number
) {
  const res: GroupScoreInfo = new Map();

  // Lấy điểm thi gốc
  const dgcaScore = Math.max(
    ...Object.values(scoreData.dgca).map((v) => v ?? 0)
  );

  if (!dgcaScore) return res;

  // Điểm quy đổi ngoại ngữ riêng cho dgca

  let nn = 0;

  if (ielts >= 4 && ielts <= 4.5) nn = 7.5;
  else if (ielts >= 5 && ielts <= 5.5) nn = 8;
  else if (ielts >= 6 && ielts <= 6.5) nn = 9;
  else if (ielts >= 7 && ielts <= 7.5) nn = 9.5;
  else if (ielts >= 8) nn = 10;

  // Xử lý chính

  const dgcaSubjectGroups: SubjectGroupId[] = [
    "G001",
    "G010",
    "G011",
    "G027",
    "G165",
    "G028",
    "G034",
    "G019",
    "G040",
    "G045",
    "G052",
    "G054",
    "G031",
    "G032",
    "G033",
  ];

  dgcaSubjectGroups.forEach((group) => {
    if (appliedGroups.includes(group)) {
      let thptScore = getGroupScore(group, scoreData.thpt, nn);

      res.set(group, [
        getUnitScoreInfo(thptScore * 0.4 + dgcaScore * 0.18, rawExtraScore, 30),
      ]);
    }
  });

  return res;
}

// Phương thức dgtd của hust
// Bao gồm điểm chưa quy đổi (root) và điểm quy đổi sang các tổ hợp môn thpt
function calcDgtd(
  scoreData: ScoreData,
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number,
  ielts: number
) {
  const res: GroupScoreInfo = new Map();

  if (scoreData.dgtd) {
    // Điểm cộng ngoại ngữ dành riêng cho dgtd

    let extraNn = 0;

    if (ielts == 5) extraNn = 1;
    else if (ielts == 5.5) extraNn = 2;
    else if (ielts == 6) extraNn = 3;
    else if (ielts == 6.5) extraNn = 4;
    else if (ielts == 7) extraNn = 5;
    else if (ielts == 7.5) extraNn = 6;
    else if (ielts >= 8) extraNn = 7;

    extraNn *= 3 / 10;

    // Điểm gốc
    res.set("root", [getUnitScoreInfo(scoreData.dgtd, rawExtraScore, 100)]);

    // Quy đổi sang các tổ hợp môn thpt
    appliedGroups.forEach((group) => {
      res.set(group, [
        getUnitScoreInfo(
          getConvertedScoreFromOutsideExam(
            "dgtd",
            scoreData.dgtd,
            group,
            CURRENT_YEAR
          ),
          rawExtraScore,
          30
        ),
      ]);
    });
  }

  return res;
}

// Phương thức k01 của hust
// Là tổng có trọng số 4 môn thpt
function calcK01(
  scoreData: ScoreData,
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number
) {
  const res: GroupScoreInfo = new Map();

  const k00Groups = new Map<SubjectGroupId, Partial<Record<SubjectId, number>>>(
    [
      ["G003", { to: 3, nv: 1, vl: 2 }],
      ["G012", { to: 3, nv: 1, hh: 2 }],
      ["G020", { to: 3, nv: 1, sh: 2 }],
      ["G031", { to: 3, nv: 1, th: 2 }],
    ]
  );

  for (const [group, coef] of k00Groups.entries()) {
    if (appliedGroups.includes(group)) {
      res.set(group, [
        getUnitScoreInfo(
          getGroupScore(group, scoreData.thpt, 0, undefined, coef),
          rawExtraScore,
          30
        ),
      ]);
    }
  }

  return res;
}

// Phương thức tổng hợp của đhqg-hcm (trước là hcmut)
// Là tổng có trọng số các phần thi trong dgsg và thpt, thhb. Điểm dgsg có thể thay bằng thpt
function calcVnuHcm(
  scoreData: ScoreData,
  thhbScores: GroupScoreInfo, // Cần lấy điểm 3 năm nên không thể dùng scoreData.thhb
  appliedGroups: SubjectGroupId[],
  rawExtraScore: number
) {
  const res: GroupScoreInfo = new Map();

  // Helper
  function getVnuScore(
    dgsgScore: number,
    thptScore: number,
    thhbScore: number
  ) {
    return dgsgScore * 0.7 + thptScore * 0.2 + thhbScore * 0.1;
  }

  appliedGroups.forEach((group) => {
    res.set(group, []);

    const thptScore = (getGroupScore(group, scoreData.thpt) / 3) * 10;

    const thhbScore = thhbScores.get(group)![3].mainScore * 10;

    // Không nhân hệ số

    const rootDgsgScore = Math.max(
      thptScore * 0.75,
      Object.values(scoreData.dgsg).reduce(
        (prev, curr) => prev + (curr ?? 0),
        0
      ) / 12
    );

    res
      .get(group)
      ?.push(
        getUnitScoreInfo(
          getVnuScore(rootDgsgScore, thptScore, thhbScore),
          rawExtraScore,
          100
        )
      );

    // Nhân hệ số 2 với từng phần thi trong kỳ thi
    Object.keys(scoreData.dgsg).forEach((major, index) => {
      const dgsgScore = Math.max(
        thptScore * 0.75,
        Object.entries(scoreData.dgsg).reduce(
          (prev, [key, value]) =>
            prev + (key === major ? 2 * (value ?? 0) : value ?? 0),
          0
        ) / 15
      );

      res
        .get(group)
        ?.push(
          getUnitScoreInfo(
            getVnuScore(dgsgScore, thptScore, thhbScore),
            rawExtraScore,
            100
          )
        );
    });
  });

  return res;
}

// Main proccessing

export function getScoreRes(scoreData: ScoreData) {
  const res: ScoreRes = {
    appliedGroups: [],
    extraInfo: new Map([
      ["kk", 0],
      ["ut", 0],
      ["an", 0], // converted nn score
      ["ccqt", 0], // Điểm xét tuyển dựa theo ccqt
    ]),
    mainInfo: new Map([
      ["thpt", new Map()],
      ["thhb", new Map()],
      ["dghn", new Map()],
      ["dgsg", new Map()],
      ["vsat", new Map()],
      ["dgsp", new Map()],
      ["dgcb", new Map()],
      ["dgca", new Map()],
      ["dgtd", new Map()],
      ["k01", new Map()],
      ["vnuhcm", new Map()],
    ]),
  };

  const ielts = Math.max(
    0,
    ...scoreData.certifications
      .filter((c) => c.type === "ielts")
      .map((c) => c.score)
  );

  res.appliedGroups = getAppliedGroups(scoreData);

  res.extraInfo.set("ccqt", getCcqtScore(scoreData));

  res.extraInfo.set(
    "kk",
    getKKScore(scoreData, res.extraInfo.get("ccqt") as number)
  );

  res.extraInfo.set("ut", getUtScore(scoreData));

  res.extraInfo.set("an", getConvertedAnScore(ielts));

  const rawExtraScore = res.extraInfo.get("kk")! + res.extraInfo.get("ut")!;

  completeThhbThptScores(scoreData, res.extraInfo.get("an") ?? 0);

  res.mainInfo.set(
    "thhb",
    calcThhb(scoreData, res.appliedGroups, rawExtraScore)
  );

  res.mainInfo.set(
    "thpt",
    calcThpt(scoreData, res.appliedGroups, rawExtraScore)
  );

  res.mainInfo.set(
    "dghn",
    calcDghn(scoreData, res.appliedGroups, rawExtraScore)
  );

  res.mainInfo.set(
    "dgsg",
    calcDgsg(scoreData, res.appliedGroups, rawExtraScore)
  );

  res.mainInfo.set(
    "dgsp",
    calcDgsp(scoreData, res.appliedGroups, rawExtraScore)
  );

  res.mainInfo.set(
    "vsat",
    calcVsat(scoreData, res.appliedGroups, rawExtraScore)
  );

  res.mainInfo.set(
    "dgca",
    calcDgca(scoreData, res.appliedGroups, rawExtraScore, ielts)
  );

  res.mainInfo.set(
    "dgtd",
    calcDgtd(scoreData, res.appliedGroups, rawExtraScore, ielts)
  );

  res.mainInfo.set("k01", calcK01(scoreData, res.appliedGroups, rawExtraScore));

  res.mainInfo.set(
    "dgcb",
    calcDgcb(
      scoreData,
      res.mainInfo.get("thhb")!,
      res.appliedGroups,
      rawExtraScore
    )
  );

  res.mainInfo.set(
    "vnuhcm",
    calcVnuHcm(
      scoreData,
      res.mainInfo.get("thhb")!,
      res.appliedGroups,
      rawExtraScore
    )
  );

  return res;
}
