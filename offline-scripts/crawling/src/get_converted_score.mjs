// ================================
// score_convert_offline.mjs
// ================================

// Node core
import fs from "fs";
import csv from "csv-parser";
import { Parser } from "json2csv";

// ================================
// IMPORT ABSOLUTE PATH (TS gốc)
// ================================

// exam-distributions.ts
import {
  getDist,
  getCombinedDist,
} from "file:///D:/project/cong-dai-hoc/lib/universities/convertors/exam-distributions.ts";

// score-convertor.ts
import {
  getConvertedScore,
  round2,
} from "file:///D:/project/cong-dai-hoc/lib/universities/convertors/score-convertor.ts";

// ================================
// CONST
// ================================

// node --experimental-loader ./src/alias-loader.mjs ./src/get_converted_score.mjs

const CURR_YEAR = "2025";

const INPUT_CSV =
  "D:\\project\\cong-dai-hoc\\offline-scripts\\crawling\\crawled_data\\score.csv";

const OUTPUT_CSV =
  "D:\\project\\cong-dai-hoc\\offline-scripts\\crawling\\cleaned_data\\score.csv";

// ================================
// LOAD DISTRIBUTIONS (OFFLINE)
// ================================

const thpt_dist = getCombinedDist(
  [
    getDist("thpt", "to", CURR_YEAR),
    getDist("thpt", "nv", CURR_YEAR),
    getDist("thpt", "an", CURR_YEAR),
  ],
  [1, 1, 1]
);

// ĐGNL
const dgsg_dist = getDist("dgsg", "al", CURR_YEAR);
const dghn_dist = getDist("dghn", "al", CURR_YEAR);
const dgtd_dist = getDist("dgtd", "al", CURR_YEAR);

if (!thpt_dist) throw new Error("THPT dist not available");

// ================================
// READ CSV
// ================================

const results = [];

fs.createReadStream(INPUT_CSV)
  .pipe(csv())
  .on("data", (row) => {
    results.push(row);
  })
  .on("end", () => {
    const convertMethods = ["dgsg", "dghn", "dgtd"];

    for (const row of results) {
      const method = row.method_id;
      const convertedScore = parseFloat(row.converted_score);

      if (convertMethods.includes(method) && convertedScore > 30.5) {
        let dist = null;

        switch (method) {
          case "dgsg":
            dist = dgsg_dist;
            break;
          case "dghn":
            dist = dghn_dist;
            break;
          case "dgtd":
            dist = dgtd_dist;
            break;
        }

        if (!dist) continue;

        const { score } = getConvertedScore(convertedScore, dist, thpt_dist);

        row.converted_score = round2(score, 2);

        console.log(
          `DONE ${row.school_id} ${convertedScore} ${row.method_id} to ${row.converted_score}`
        );
      }
    }

    const fields = Object.keys(results[0]);
    const parser = new Parser({ fields });
    const csvOutput = parser.parse(results);

    fs.writeFileSync(OUTPUT_CSV, csvOutput.replace(/^\uFEFF/, ""), {
      encoding: "utf8",
    });

    console.log("DONE EXPORT CSV");
  });
