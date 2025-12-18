import { JsonTable } from "@/public/data/json-table-model";

import { getExactData } from "@/lib/universities/general-helpers/get-exact-data";

export const industryL3Table = await new JsonTable().load("industry-l3");

export function getExactIndustry3FromName(industryL3Name: string) {
  return getExactData(
    industryL3Name,
    industryL3Table.getFields(["name"]),
    industryL3Table.getFields(["id"])
  );
}
