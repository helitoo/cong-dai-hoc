const fs = require("fs");
const path = require("path");

function extractFieldFromJson(jsonPath, field, delimiter = ",") {
  const fullPath = path.resolve(jsonPath);
  const raw = fs.readFileSync(fullPath, "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of objects.");
  }

  const values = data
    .map((item) => {
      const v = item[field];
      if (v === undefined) return undefined;
      return typeof v === "string" ? `"${v}"` : v;
    })
    .filter((v) => v !== undefined);

  return values.join(delimiter);
}

const result = extractFieldFromJson(
  "D:/project/cong-dai-hoc/public/data/subject-groups.json",
  "id",
  ","
);

console.log(result);
