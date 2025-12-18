import { JsonTable } from "@/public/data/json-table-model";
import { getExactData } from "@/lib/universities/general-helpers/get-exact-data";

const schoolTable = await new JsonTable().load("schools");

export function getSchoolName(schoolId: string) {
  return schoolTable.getValByField(schoolId, "id", ["name"]);
}

export function getExactSchoolFromName(schoolName: string) {
  if (schoolName.length <= 6)
    return getExactData(
      schoolName,
      schoolTable.getFields(["short_name"]),
      schoolTable.getFields(["id"])
    );
  else
    return getExactData(
      schoolName,
      schoolTable.getFields(["name"]),
      schoolTable.getFields(["id"])
    );
}
