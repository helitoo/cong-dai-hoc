import {
  allAvailableSubjects,
  type ScoreData,
} from "@/lib/universities/calculators/score-data/score-schema";

export const DEFAULT_SCORE_FORM_VALUES: ScoreData = {
  appliedSubjects: ["to", "nv", "an", "ls"],
  thhb: Object.fromEntries(
    allAvailableSubjects.map((subject) => [subject, [0, 0, 0, 0, 0, 0]])
  ) as Record<
    | "to"
    | "vl"
    | "hh"
    | "sh"
    | "nv"
    | "an"
    | "ls"
    | "dl"
    | "gd"
    | "th"
    | "c1"
    | "c2",
    [number, number, number, number, number, number]
  >,
  thpt: Object.fromEntries(
    allAvailableSubjects.map((subject) => [subject, 0])
  ) as Record<
    | "to"
    | "vl"
    | "hh"
    | "sh"
    | "nv"
    | "an"
    | "ls"
    | "dl"
    | "gd"
    | "th"
    | "c1"
    | "c2",
    number
  >,

  dgtd: 0,
  dghn: 0,

  dgsg: {
    to: 0,
    nv: 0,
    an: 0,
    kh: 0,
  },

  dgsp: Object.fromEntries(
    allAvailableSubjects.map((subject) => [subject, 0])
  ) as Record<
    | "to"
    | "vl"
    | "hh"
    | "sh"
    | "nv"
    | "an"
    | "ls"
    | "dl"
    | "gd"
    | "th"
    | "c1"
    | "c2",
    number
  >,

  dgcb: {
    to: 0,
    vl: 0,
    hh: 0,
    sh: 0,
    nv: 0,
    an: 0,
  },

  vsat: {
    to: 0,
    vl: 0,
    hh: 0,
    sh: 0,
    nv: 0,
    an: 0,
    ls: 0,
    dl: 0,
  },

  dgca: {
    vl: 0,
    hh: 0,
    sh: 0,
    dl: 0,
  },

  priority: {
    dt: 0,
    kv: 0,
  },

  achievements: [],
  certifications: [],
};
