import { round2 } from "@/lib/universities/convertors/score-convertor";
import { z } from "zod";

// Helpers

export function scoreValidator(val: any, min = 0, max = 10, isInt = false) {
  let num = Number(val);
  if (isNaN(num)) return 0;

  num = round2(num);

  if (num < min) return 0;
  if (num > max) num = max;

  if (isInt) num = Math.round(num);

  return num;
}

export function base10ScoreValidator(val: any) {
  let num = Number(val);
  if (isNaN(num)) return 0;

  while (num > 10) num /= 10;

  num = round2(num);

  if (num < 0) num = 0;
  if (num > 10) num = 10;

  return num;
}

export function aLevelValidator(val: any) {
  if (typeof val === "string") {
    val = val.toUpperCase().replace(/[^A*BCDE]/g, "");

    switch (val) {
      case "A*":
        return 6;
      case "A":
        return 5;
      case "B":
        return 4;
      case "C":
        return 3;
      case "D":
        return 2;
      case "E":
        return 1;
      default:
        return 0;
    }
  } else {
    let num = scoreValidator(val, 1, 6, true);
    return num;
  }
}

export function ieltsValidator(val: any) {
  let num = Number(val);
  if (isNaN(num)) return 0;

  if (val < 0) val = 0;
  if (val > 9) val = 9;

  val = Math.round(val * 2) / 2;

  return val;
}

export const availableSubjects = {
  khtn: ["to", "vl", "hh", "sh"] as const,
  khxhnv: ["nv", "an", "ls", "dl", "gd"] as const,
  congnghe: ["th", "c1", "c2"] as const,
};

export const allAvailableSubjects = [
  ...availableSubjects.khtn,
  ...availableSubjects.khxhnv,
  ...availableSubjects.congnghe,
] as const;

export type KHTNSubjectId = (typeof availableSubjects.khtn)[number];
export type KHXHNVSubjectId = (typeof availableSubjects.khxhnv)[number];
export type CongNgheSubjectId = (typeof availableSubjects.congnghe)[number];
export type SubjectId = (typeof allAvailableSubjects)[number];

export const hscaSubjects = ["to", "vl", "hh", "sh", "nv", "an"];
export const vsatSubjects = ["to", "vl", "hh", "sh", "nv", "an", "ls", "dl"];
export const candSubjects = ["vl", "hh", "sh", "dl"];

export const scoreSchema = z.object({
  // Chọn môn học
  appliedSubjects: z.array(
    z.enum([
      ...availableSubjects.khtn,
      ...availableSubjects.khxhnv,
      ...availableSubjects.congnghe,
    ])
  ),

  // Học bạ
  thhb: z.record(
    z.enum([
      ...availableSubjects.khtn,
      ...availableSubjects.khxhnv,
      ...availableSubjects.congnghe,
    ]),
    z.tuple([
      z.any().transform((v) => base10ScoreValidator(v)),
      z.any().transform((v) => base10ScoreValidator(v)),
      z.any().transform((v) => base10ScoreValidator(v)),
      z.any().transform((v) => base10ScoreValidator(v)),
      z.any().transform((v) => base10ScoreValidator(v)),
      z.any().transform((v) => base10ScoreValidator(v)),
    ])
  ),

  // TN
  thpt: z.record(
    z.enum([
      ...availableSubjects.khtn,
      ...availableSubjects.khxhnv,
      ...availableSubjects.congnghe,
    ]),
    z.any().transform((v) => base10ScoreValidator(v))
  ),

  // TSA, HSA
  dgtd: z.any().transform((v) => scoreValidator(v, 0, 100, false)),
  dghn: z.any().transform((v) => scoreValidator(v, 0, 150, false)),

  // VACT
  dgsg: z.object({
    nv: z.any().transform((v) => scoreValidator(v, 0, 300, true)),
    an: z.any().transform((v) => scoreValidator(v, 0, 300, true)),
    to: z.any().transform((v) => scoreValidator(v, 0, 300, true)),
    kh: z.any().transform((v) => scoreValidator(v, 0, 300, true)),
  }),

  // SPT
  dgsp: z.record(
    z.enum([
      ...availableSubjects.khtn,
      ...availableSubjects.khxhnv,
      ...availableSubjects.congnghe,
    ]),
    z.any().transform((v) => base10ScoreValidator(v))
  ),

  // HSCA
  dgcb: z.object({
    to: z.any().transform((v) => base10ScoreValidator(v)),
    vl: z.any().transform((v) => base10ScoreValidator(v)),
    hh: z.any().transform((v) => base10ScoreValidator(v)),
    sh: z.any().transform((v) => base10ScoreValidator(v)),
    nv: z.any().transform((v) => base10ScoreValidator(v)),
    an: z.any().transform((v) => base10ScoreValidator(v)),
  }),

  // VSAT
  vsat: z.object({
    to: z.any().transform((v) => scoreValidator(v, 0, 450, true)),
    vl: z.any().transform((v) => scoreValidator(v, 0, 450, true)),
    hh: z.any().transform((v) => scoreValidator(v, 0, 450, true)),
    sh: z.any().transform((v) => scoreValidator(v, 0, 450, true)),
    nv: z.any().transform((v) => scoreValidator(v, 0, 450, true)),
    an: z.any().transform((v) => scoreValidator(v, 0, 450, true)),
    ls: z.any().transform((v) => scoreValidator(v, 0, 450, true)),
    dl: z.any().transform((v) => scoreValidator(v, 0, 450, true)),
  }),

  // CAND
  dgca: z.object({
    vl: z.any().transform((v) => base10ScoreValidator(v)),
    hh: z.any().transform((v) => base10ScoreValidator(v)),
    sh: z.any().transform((v) => base10ScoreValidator(v)),
    dl: z.any().transform((v) => base10ScoreValidator(v)),
  }),

  // Ưu tiên
  priority: z.object({
    dt: z.any().transform((v) => scoreValidator(v, 0, 7, true)),
    kv: z.any().transform((v) => scoreValidator(v, 0, 3, true)),
  }),

  // Thành tích
  achievements: z.array(
    z.object({
      type: z.any().transform((v) => scoreValidator(v, 0, 2, true)),
      prize: z.any().transform((v) => scoreValidator(v, 0, 3, true)),
    })
  ),

  // Chứng chỉ
  certifications: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("sat"),
        score: z.any().transform((v) => scoreValidator(v, 400, 1600, true)),
      }),
      z.object({
        type: z.literal("act"),
        score: z.any().transform((v) => scoreValidator(v, 1, 36, true)),
      }),
      z.object({
        type: z.literal("alevel"),
        score: z.any().transform((v) => aLevelValidator(v)),
      }),
      z.object({
        type: z.literal("ib"),
        score: z.any().transform((v) => scoreValidator(v, 1, 45, true)),
      }),
      z.object({
        type: z.literal("ielts"),
        score: z.any().transform((v) => ieltsValidator(v)),
      }),
    ])
  ),
});

export type ScoreData = z.infer<typeof scoreSchema>;
