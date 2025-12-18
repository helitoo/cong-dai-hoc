"use client";

import { useState } from "react";

import { select } from "@/lib/duckdb/duckdb";

import MethodSelector from "@/app/topic/ptn-phuong-thuc/method-selector";

import { BarChart } from "@/components/charts/bar-charts";
import showToast from "@/components/toastify-wrapper";
import { useLoading } from "@/components/loading";

import { getMethodName } from "@/lib/universities/convertors/method";
import { getSchoolName } from "@/lib/universities/convertors/schools";
import { round2 } from "@/lib/universities/convertors/score-convertor";
import { getSubjectGroupName } from "@/lib/universities/convertors/subject-groups";

type BarchartDataSet = {
  labels: string[];
  values: number[];
};

export default function MethodQueryForm() {
  const { showLoading, hideLoading } = useLoading();

  const [bestMethodDataset, setBestMethodDataset] = useState<BarchartDataSet>({
    labels: [],
    values: [],
  });
  const [bestSubjectGroupDataset, setBestSubjectGroupDataset] =
    useState<BarchartDataSet>({ labels: [], values: [] });
  const [bestSchoolByScaleDataset, setBestSchoolByScaleDataset] =
    useState<BarchartDataSet>({ labels: [], values: [] });
  const [bestSchoolByFocusingDataset, setBestSchoolByFocusingDataset] =
    useState<BarchartDataSet>({ labels: [], values: [] });
  const [bestSchoolByMedianDataset, setBestSchoolByMedianDataset] =
    useState<BarchartDataSet>({ labels: [], values: [] });
  const [bestSchoolByRankDataset, setBestSchoolByRankDataset] =
    useState<BarchartDataSet>({ labels: [], values: [] });

  async function methodQueryHandler(
    industryL1Id: string,
    industryL3Id: string,
    schoolRegion: string
  ) {
    showLoading();

    let whereStm = "";

    if (industryL3Id === "0000000")
      whereStm += `WHERE (industry_l1_id = '${industryL1Id}') `;
    else
      whereStm += `WHERE (industry_l1_id = '${industryL3Id.slice(
        0,
        3
      )}' AND industry_l2_id = '${industryL3Id.slice(
        3,
        5
      )}' AND industry_l3_id = '${industryL3Id.slice(5, 7)}') `;

    if (schoolRegion === "NR")
      whereStm += "AND (school_region = 'NR' OR school_region = 'HNC') ";
    else if (schoolRegion === "SR")
      whereStm += "AND (school_region = 'SR' OR school_region = 'HCMC') ";
    else if (schoolRegion === "CR") whereStm += "AND (school_region = 'CR') ";

    const [
      bestMethod,
      bestSubjectGroup,
      bestSchoolByScale,
      bestSchoolByFocusing,
      bestSchoolByMedian,
      bestSchoolByRank,
    ] = await Promise.all([
      select(`SELECT method_id id, COUNT(*) quan
        FROM score.parquet
        ${whereStm}
        GROUP BY method_id
        ORDER BY COUNT(*) DESC
        LIMIT 7`),
      select(`SELECT subject_group_id id, COUNT(*) quan
        FROM score.parquet
        ${whereStm}
        GROUP BY subject_group_id
        HAVING LEFT(subject_group_id, 1) = 'G'
        ORDER BY COUNT(*) DESC
        LIMIT 10`),
      select(`SELECT school_id id, COUNT(*) quan
        FROM score.parquet
        ${whereStm}
        GROUP BY school_id
        ORDER BY COUNT(*) DESC
        LIMIT 10`),
      select(`SELECT school_id id, (SUM(CASE WHEN industry_l1_id = '${industryL1Id}' THEN 1 ELSE 0 END) * 1.0) / COUNT(*) AS quan
        FROM score.parquet
        GROUP BY school_id
        ORDER BY quan DESC
        LIMIT 10;`),
      select(`SELECT school_id id, MEDIAN(converted_score) quan
        FROM score.parquet
        ${whereStm} AND (method_id != 'thhb')
        GROUP BY school_id
        ORDER BY MEDIAN(converted_score) DESC
        LIMIT 10`),
      select(`WITH filtered AS (
        SELECT *
        FROM score.parquet
        ${whereStm}
        ),

        -- 1. Trung vị theo trường
        median_tbl AS (
        SELECT
            school_id,
            median(converted_score) AS median_score
        FROM filtered
        GROUP BY school_id
        ),

        -- 2. Mức độ trọng tâm đào tạo
        focus_tbl AS (
        SELECT
            school_id,
            (SUM(CASE WHEN industry_l1_id = '${industryL1Id}' THEN 1 ELSE 0 END) * 1.0)
            / COUNT(*) AS focus_ratio
        FROM score.parquet
        WHERE (method_id != 'thhb')
        GROUP BY school_id
        ),

        -- 3. Quy mô tuyển sinh (tổng số dòng sau filter)
        count_tbl AS (
        SELECT
            school_id,
            COUNT(*) AS total_count
        FROM filtered
        GROUP BY school_id
        ),

        combined AS (
        SELECT
            m.school_id,
            m.median_score,
            f.focus_ratio,
            c.total_count
        FROM median_tbl m
        JOIN focus_tbl f USING (school_id)
        JOIN count_tbl c USING (school_id)
        ),

        -- 4. Chuẩn hóa min-max (DuckDB hỗ trợ window function)
        normalized AS (
        SELECT
            school_id,

            (median_score - MIN(median_score) OVER ())
            / NULLIF(MAX(median_score) OVER () - MIN(median_score) OVER (), 0)
            AS median_norm,

            (focus_ratio - MIN(focus_ratio) OVER ())
            / NULLIF(MAX(focus_ratio) OVER () - MIN(focus_ratio) OVER (), 0)
            AS focus_norm,

            (total_count - MIN(total_count) OVER ())
            / NULLIF(MAX(total_count) OVER () - MIN(total_count) OVER (), 0)
            AS count_norm

        FROM combined
        ),

        final_score AS (
        SELECT
            school_id id,
            0.5 * median_norm +
            0.3 * focus_norm +
            0.2 * count_norm AS quan
        FROM normalized
        )

        SELECT *
        FROM final_score
        ORDER BY quan DESC
        LIMIT 10;`),
    ]);

    if (
      !bestMethod.data ||
      !bestSubjectGroup.data ||
      !bestSchoolByScale.data ||
      !bestSchoolByFocusing.data ||
      !bestSchoolByMedian.data ||
      !bestSchoolByRank.data
    ) {
      showToast({ type: "error", message: "Dữ liệu hiện không có" });
      hideLoading();
      return;
    }

    setBestMethodDataset({
      labels: bestMethod.data.map((v) => getMethodName(v.id)),
      values: bestMethod.data.map((v) => round2(v.quan, 4)),
    });

    setBestSubjectGroupDataset({
      labels: bestSubjectGroup.data.map((v) => getSubjectGroupName(v.id)),
      values: bestSubjectGroup.data.map((v) => round2(v.quan, 4)),
    });

    setBestSchoolByScaleDataset({
      labels: bestSchoolByScale.data.map((v) => getSchoolName(v.id)),
      values: bestSchoolByScale.data.map((v) => round2(v.quan, 4)),
    });

    setBestSchoolByFocusingDataset({
      labels: bestSchoolByFocusing.data.map((v) => getSchoolName(v.id)),
      values: bestSchoolByFocusing.data.map((v) => round2(v.quan, 4)),
    });

    setBestSchoolByMedianDataset({
      labels: bestSchoolByMedian.data.map((v) => getSchoolName(v.id)),
      values: bestSchoolByMedian.data.map((v) => round2(v.quan, 4)),
    });

    setBestSchoolByRankDataset({
      labels: bestSchoolByRank.data.map((v) => getSchoolName(v.id)),
      values: bestSchoolByRank.data.map((v) => round2(v.quan, 4)),
    });

    hideLoading();
  }

  return (
    <div className="flex flex-col gap-3">
      <MethodSelector methodQueryHandler={methodQueryHandler} />

      {!bestMethodDataset.labels.length ||
      !bestSubjectGroupDataset.labels.length ||
      !bestSchoolByScaleDataset.labels.length ||
      !bestSchoolByFocusingDataset.labels.length ||
      !bestSchoolByMedianDataset.labels.length ||
      !bestSchoolByRankDataset.labels.length ? (
        <></>
      ) : (
        <>
          <BarChart
            title="Các phương thức được dùng nhiều nhất (ĐVTS)"
            labels={bestMethodDataset.labels}
            values={bestMethodDataset.values}
          />

          <BarChart
            title="Các tổ hợp được dùng nhiều nhất (ĐVTS)"
            labels={bestSubjectGroupDataset.labels}
            values={bestSubjectGroupDataset.values}
          />

          <BarChart
            title="Các trường tuyển sinh nhiều nhất (ĐVTS)"
            labels={bestSchoolByScaleDataset.labels}
            values={bestSchoolByScaleDataset.values}
          />

          <BarChart
            title="Các trường có mức độ tập trung đào tạo nhất (thang 1)"
            labels={bestSchoolByFocusingDataset.labels}
            values={bestSchoolByFocusingDataset.values}
          />

          <BarChart
            title="Các trường có trung vị điểm chuẩn cao nhất, không tính HB (thang 30)"
            labels={bestSchoolByMedianDataset.labels}
            values={bestSchoolByMedianDataset.values}
          />

          <BarChart
            title="Các trường hàng đầu trong ngành/nhóm ngành này (thang 1)"
            labels={bestSchoolByRankDataset.labels}
            values={bestSchoolByRankDataset.values}
          />
        </>
      )}
    </div>
  );
}
