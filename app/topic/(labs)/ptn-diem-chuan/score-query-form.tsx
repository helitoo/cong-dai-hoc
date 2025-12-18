"use client";

import { Play } from "lucide-react";

import { useEffect, useState } from "react";

import { CopyButton } from "@/components/toggle-button/copy-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { setScoreQuery, getScoreQuery } from "@/lib/localStorage/score-query";

import { select } from "@/lib/duckdb/duckdb";

import { getCurrHHMM } from "@/app/topic/(labs)//ptn-diem-chuan/getCurrHHMM";
import {
  type ScoreQueryResultProps,
  ScoreQueryResult,
} from "@/app/topic/(labs)//ptn-diem-chuan/score-query-result";

const forbiddenKeywords = [
  "insert",
  "update",
  "delete",
  "drop",
  "alter",
  "create",
  "replace",
  "truncate",
  "merge",
  "attach",
  "detach",
  "vacuum",
];

// Helper
function queryValidator(rawSql: string): {
  ok: boolean;
  sql: string;
  message: string;
} {
  if (!rawSql || typeof rawSql !== "string")
    return { ok: false, sql: "", message: "The query is empty." };

  let sql = rawSql.trim();

  // Ignore comment
  if (/--/.test(sql) || /\/\*[\s\S]*?\*\//.test(sql))
    return {
      ok: false,
      sql: "",
      message: "Comments are not allowed in the query.",
    };

  // Ignore case-insensitive
  const forbiddenRegex = new RegExp(
    `\\b(${forbiddenKeywords.join("|")})\\b`,
    "i"
  );
  if (forbiddenRegex.test(sql))
    return { ok: false, sql: "", message: "Only SELECT queries are allowed." };

  if (!/^(select|with)\b/i.test(sql))
    return {
      ok: false,
      sql: "",
      message: "Query must start with SELECT or WITH.",
    };

  // Ignore multiple query
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (statements.length !== 1) {
    return {
      ok: false,
      sql: "",
      message: "Only a single query is allowed.",
    };
  }

  return { ok: true, sql, message: "Query verified." };
}

// Main component
export default function ScoreQueryForm() {
  // State handlers
  const [data, setData] = useState<ScoreQueryResultProps | null>(null);
  const [query, setQuery] = useState("");
  const [consoleMsg, setConsoleMsg] = useState("");

  useEffect(() => setConsoleMsg(`[${getCurrHHMM()}] Accessed the Lab.`), []);

  // Load query from local storage
  useEffect(() => setQuery(getScoreQuery()), []);

  // Save query before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      setScoreQuery(query);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [query]);

  // Fetch handler

  async function fetch() {
    // Validate query
    const modifiedQuery = queryValidator(query);

    setConsoleMsg(`[${getCurrHHMM()}] ${modifiedQuery.message}`);

    if (!modifiedQuery.ok) return;

    // Fetch

    const data = await select(modifiedQuery.sql);

    setConsoleMsg(`[${getCurrHHMM()}] ${data.message}`);
    setData(data.data);
  }

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Cột SQL */}
        <div className="flex flex-col gap-2">
          <Label>SQL</Label>
          <div className="relative w-full">
            <Textarea
              placeholder={`SELECT * FROM score.parquet...`}
              defaultValue={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10 h-[120px] resize-none overflow-y-auto code-inline font-normal!"
            />

            <div className="flex flex-col absolute top-1 right-1">
              <CopyButton content={query} />

              <Button variant="ghost" size="icon" onClick={fetch}>
                <Play className="button-icon text-sky-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Cột Console */}
        <div className="flex flex-col gap-2">
          <Label>Console</Label>
          <Textarea
            readOnly
            defaultValue={consoleMsg}
            className="pr-10 h-[120px] resize-none overflow-y-auto bg-black text-white font-[Consolas,monospace]"
          />
        </div>
      </div>

      <div className="mt-10">
        <ScoreQueryResult data={data} />
      </div>
    </div>
  );
}
