"use client";

import { round2 } from "@/lib/universities/convertors/score-convertor";

import type { MajorQueries } from "@/lib/universities/calculators/major-finder/major-queries-schema";
import type { ScoreRes } from "@/lib/universities/calculators/score-data/score-calculator";

import { select } from "@/lib/duckdb/duckdb";

// Xây dựng where Stm (không bao gồm từ WHERE) từ các điều kiện con
export function getWhereStm(
  Stms: (string | undefined | null)[],
  delimeter = "AND"
): string {
  const valid = Stms.map((s) => s?.trim()).filter(
    (s): s is string => !!s && s.length > 0
  );

  if (!valid.length) return "";

  return valid.map((s) => `(${s})`).join(` ${delimeter} `);
}

// Xây dựng Stm từ hld recommeded majors và queries major
// Chỉ xét các ngành từ trung bình trở lên
function getIndustryL1Stm(
  hldRcmMajors: Map<string, number> | undefined,
  queryMajors: string[]
) {
  // console.log("hldRcmMajor", hldRcmMajors, "queryMajors", queryMajors);

  let hldMajor: string[] = [];

  if (hldRcmMajors && hldRcmMajors.size) {
    const scores = Array.from(hldRcmMajors.values());
    const avgScore = scores.reduce((prev, curr) => prev + curr) / scores.length;

    const hldRcmMajor = Array.from(hldRcmMajors.entries()).filter(
      ([, score]) => score >= avgScore
    );

    hldMajor = hldRcmMajor.map(([str, _]) => str);
  }

  const finalRcmMajors = [...hldMajor, ...queryMajors];

  return finalRcmMajors.length
    ? `industry_l1_id IN (${finalRcmMajors.map((id) => `'${id}'`).join(", ")})`
    : "";
}

// Xây dựng Stm từ major queries
function getStmFromMajorQueries(majorQueries: MajorQueries) {
  const schoolIdStm = majorQueries.schoolIds.length
    ? `school_id IN (${majorQueries.schoolIds
        .map((id) => `'${id}'`)
        .join(", ")})`
    : "";

  const schoolTypeStm = majorQueries.schoolTypes.length
    ? `school_public IN (${majorQueries.schoolTypes
        .map((type) => (type === "public" ? 1 : 0))
        .join(", ")})`
    : "";

  const schoolRegionStm = majorQueries.schoolRegions.length
    ? `school_region IN (${majorQueries.schoolRegions
        .map((region) => `'${region}'`)
        .join(", ")})`
    : "";

  // Không xử lý industryL1 và đã xử lý ở rcmMajor rồi

  const industryL3IdStm = majorQueries.industryL3Ids.length
    ? `concat(industry_l1_id, industry_l2_id, industry_l3_id) IN (${majorQueries.industryL3Ids
        .map((id) => `'${id}'`)
        .join(", ")})`
    : "";

  const minScoreStm = `converted_score >= ${majorQueries.minScore}`;

  return getWhereStm(
    [
      getWhereStm([schoolIdStm, schoolTypeStm, schoolRegionStm], "AND"),
      industryL3IdStm,
      minScoreStm,
    ],
    "AND"
  );
}

// Xây dựng stm từ thông tin điểm
function getStmFromScoreRes(
  scoreRes: ScoreRes | undefined,
  scoreMargin: number
) {
  if (!scoreRes) return "";

  const ccqtStm = `method_id != 'ccqt' OR converted_score <= ${scoreRes.extraInfo.get(
    "ccqt"
  )}`;

  const scoresStm = Array.from(scoreRes.mainInfo.entries())
    .filter(
      ([methodId, groupInfo]) => methodId != "vnuhcm" && methodId != "k01"
    )
    .flatMap(([methodId, groupInfo]) =>
      Array.from(groupInfo.entries()).map(([groupId, scores]) => {
        const maxScore =
          round2(scores[0].mainScore + scores[0].extraScore) + scoreMargin;

        if (methodId === "dgsg" || methodId === "dghn" || methodId === "dgtd")
          return `(method_id != '${methodId}' OR converted_score <= ${maxScore})`;

        return `(
          (method_id != '${methodId}'
          OR subject_group_id NOT IN ('${groupId}', 'A000'))
          OR converted_score <= ${maxScore}
        )`;
      })
    )
    .join(" AND ");

  return getWhereStm([ccqtStm, scoresStm], "AND");
}

export type ReturnedMajor = {
  schoolId: string;
  schoolName: string;
  majorInfo: {
    majorId: string;
    majorName: string;
    methodId: string;
    subjectGroupIds: string[];
    year: string;
    score: string;
    note: string;
  }[];
};

export async function findMajor(
  majorQueries: MajorQueries,
  hldRcmMajors: Map<string, number> | undefined,
  scoreRes: ScoreRes | undefined
): Promise<ReturnedMajor[] | null> {
  const whereStm = getWhereStm(
    [
      getIndustryL1Stm(hldRcmMajors, majorQueries.industryL1Ids),
      getStmFromMajorQueries(majorQueries),
      getStmFromScoreRes(scoreRes, majorQueries.scoreMargin),
    ],
    "AND"
  );

  // console.log("MAJOR QUERIES", majorQueries, "HLD RCM MAJORS", hldRcmMajors);
  console.log(whereStm);

  const sqlStm = `WITH major_grouped AS (
      SELECT
        school_id,
        school_name,
        major_id,
        major_name,
        method_id,
        year,
        score,
        note,
        converted_score,
        list_distinct(list(subject_group_id)) AS subjectGroupIds
      FROM score.parquet
      ${whereStm ? `WHERE ${whereStm} AND year = 2025` : "WHERE year = 2025"}
      GROUP BY
        school_id,
        school_name,
        major_id,
        major_name,
        method_id,
        year,
        score,
        note,
        converted_score,
        industry_l1_id,
        industry_l2_id,
        industry_l3_id
    )

    SELECT
      school_id AS schoolId,
      school_name AS schoolName,
      list(
        struct_pack(
          majorId := major_id,
          majorName := major_name,
          methodId := method_id,
          subjectGroupIds := subjectGroupIds,
          year := year,
          score := score,
          note := note
        )
        ORDER BY converted_score DESC
      ) AS majorInfo

    FROM major_grouped
    GROUP BY school_id, school_name
    LIMIT ${majorQueries.numberOfReturnedValue}`;

  // console.log(sqlStm);

  const res = await select<ReturnedMajor>(sqlStm);

  return res.data;
}
