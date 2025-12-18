import { JsonTable } from "@/public/data/json-table-model";

const industryL1Ids = [
  "714",
  "721",
  "722",
  "731",
  "732",
  "734",
  "738",
  "742",
  "744",
  "746",
  "748",
  "751",
  "752",
  "754",
  "758",
  "762",
  "764",
  "772",
  "776",
  "781",
  "784",
  "785",
  "786",
  "790",
] as const;

export type IndustryL1Id = (typeof industryL1Ids)[number];

export const industryL1Table = await new JsonTable().load("industry-l1");

//
export function getIndustryL1Name(industryL1Id: IndustryL1Id) {
  return industryL1Table.getValByField(industryL1Id, "id", ["name"]);
}

// Get exact field

import { getExactData } from "@/lib/universities/general-helpers/get-exact-data";

export function getExactIndustry1FromName(industryL1Name: string) {
  return getExactData(
    industryL1Name,
    industryL1Table.getFields(["name"]),
    industryL1Table.getFields(["id"])
  );
}
