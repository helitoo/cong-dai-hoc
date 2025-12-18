const subjectIds = [
  "--",
  "al",
  "ot",
  "to",
  "nv",
  "vl",
  "hh",
  "sh",
  "dl",
  "ls",
  "gd",
  "c1",
  "c2",
  "th",
  "nn",
  "an",
  "ng",
  "ph",
  "tq",
  "nh",
  "ha",
  "du",
  "ve",
  "am",
  "bd",
  "qp",
  "td",
  "nk",
  "cn",
  "bc",
];

export type SubjectId = (typeof subjectIds)[number];

//
export function castToSubjectId(subjectId: any): SubjectId {
  if (subjectIds.includes(subjectId)) return subjectId;
  else return "--";
}

//

import { getExactData } from "@/lib/universities/general-helpers/get-exact-data";
import { JsonTable } from "@/public/data/json-table-model";

const subjectTable = await new JsonTable().load("subjects");

export function getSubjectName(
  subjectId: SubjectId,
  isGetLongForm: boolean = false
) {
  if (isGetLongForm)
    return subjectTable.getValByField(subjectId, "id", ["name"]);

  switch (subjectId) {
    case "al":
      return "Tổng hợp";
    case "an":
      return "Anh";
    case "nv":
      return "Văn";
    case "to":
      return "Toán";
    case "vl":
      return "Lý";
    case "hh":
      return "Hóa";
    case "dl":
      return "Địa";
    case "ls":
      return "Sử";
    case "sh":
      return "Sinh";
    case "th":
      return "Tin";
    case "gd":
      return "GDKTPL";
    case "c1":
      return "CNCN";
    case "c2":
      return "CNNN";
    case "cn":
      return "CN";
    default:
      return "Khác";
  }
}

export function getExactSubjectFromName(subjectName: string) {
  return getExactData(
    subjectName,
    subjectTable.getFields(["name"]),
    subjectTable.getFields(["id"])
  );
}
