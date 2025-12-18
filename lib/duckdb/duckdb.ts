import * as duckdb from "@duckdb/duckdb-wasm";

// Webpack style
const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: "/duckdb/duckdb-mvp.wasm",
    mainWorker: "/duckdb/duckdb-browser-mvp.worker.js",
  },
  eh: {
    mainModule: "/duckdb/duckdb-eh.wasm",
    mainWorker: "/duckdb/duckdb-browser-eh.worker.js",
  },
};

let dbInstance: duckdb.AsyncDuckDB | null = null;
let connInstance: duckdb.AsyncDuckDBConnection | null = null;

// Duckdb Instantiation (one time in runtime)
export async function getDuckDB(): Promise<duckdb.AsyncDuckDB> {
  if (dbInstance) return dbInstance;

  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);

  const worker = new Worker(bundle.mainWorker!);
  // const logger = new duckdb.ConsoleLogger();
  const logger = {
    log: () => {},
    trace: () => {},
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  };
  const db = new duckdb.AsyncDuckDB(logger, worker);

  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  dbInstance = db;
  return db;
}

// Connect to database (one time in runtime)
export async function getConnection(): Promise<duckdb.AsyncDuckDBConnection> {
  if (connInstance) return connInstance;

  const db = await getDuckDB();
  const conn = await db.connect();

  await db.registerFileURL(
    "score.parquet",
    "/data/score.parquet",
    duckdb.DuckDBDataProtocol.HTTP,
    false
  );

  connInstance = conn;
  return conn;
}

// Select handler
export type SelectScoreResult<T = any> = {
  data: T[] | null;
  message: string;
};

// Helper
function fixBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "bigint") return Number(obj);

  if (Array.isArray(obj)) return obj.map(fixBigInt);

  if (typeof obj === "object") {
    const out: any = {};
    for (const k in obj) out[k] = fixBigInt(obj[k]);
    return out;
  }

  return obj;
}

// data: [
//   { col1: value1, col2: value2, ... },
//   { col1: value1, col2: value2, ... },
//   ...
// ],

function normalizeArrowValue(value: any): any {
  if (value == null) return value;

  // Primitive
  if (typeof value !== "object" || value instanceof Date) {
    return value;
  }

  // Arrow LIST (có get + length)
  if (typeof value.get === "function" && typeof value.length === "number") {
    const arr = [];
    for (let i = 0; i < value.length; i++) {
      arr.push(normalizeArrowValue(value.get(i)));
    }
    return arr;
  }

  // Arrow STRUCT (có toJSON nhưng toJSON chưa deep)
  if (typeof value.toJSON === "function") {
    const json = value.toJSON();
    return normalizeArrowValue(json);
  }

  // Plain object (recursion)
  if (Array.isArray(value)) {
    return value.map(normalizeArrowValue);
  }

  const result: any = {};
  for (const [k, v] of Object.entries(value)) {
    result[k] = normalizeArrowValue(v);
  }
  return result;
}

export async function select<T = any>(
  sql: string
): Promise<SelectScoreResult<T>> {
  try {
    const conn = await getConnection();

    const rows = (await conn.query(sql)).toArray().map((r) => {
      const raw = r.toJSON();
      const normalized = normalizeArrowValue(raw);
      return fixBigInt(normalized) as T;
    });

    return {
      data: rows,
      message: `${rows.length} rows returned.`,
    };
  } catch (err) {
    return {
      data: null,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
