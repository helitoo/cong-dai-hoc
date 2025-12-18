import { DuckDBConnection } from "@duckdb/node-api";

async function csvToParquet(csvPath, parquetPath) {
  const connection = await DuckDBConnection.create();

  const result = await connection.run(`
    COPY (
      SELECT *
      FROM read_csv_auto('${csvPath}')
    )
    TO '${parquetPath}'
    (FORMAT 'parquet');
  `);

  console.log(result);
}

csvToParquet(
  "D:/project/cong-dai-hoc/offline-scripts/score.csv",
  "D:/project/cong-dai-hoc/public/data/score.parquet"
);

console.log("Done!");
