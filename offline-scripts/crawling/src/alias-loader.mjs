// src/alias-loader.mjs
import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";

const ROOT = "D:/project/cong-dai-hoc";

const ALIAS = {
  "@": ROOT,
  "@/lib": `${ROOT}/lib`,
  "@/public": `${ROOT}/public`,
};

function resolveWithFallback(realPath) {
  if (fs.existsSync(realPath)) return realPath;
  if (fs.existsSync(realPath + ".ts")) return realPath + ".ts";
  if (fs.existsSync(realPath + ".js")) return realPath + ".js";
  if (fs.existsSync(realPath + ".json")) return realPath + ".json";
  if (fs.existsSync(path.join(realPath, "index.ts")))
    return path.join(realPath, "index.ts");
  return null;
}

export async function resolve(specifier, context, defaultResolve) {
  // Alias
  for (const key of Object.keys(ALIAS)) {
    if (specifier === key || specifier.startsWith(key + "/")) {
      const sub = specifier.slice(key.length);
      const realPath = path.join(ALIAS[key], sub);
      const resolved = resolveWithFallback(realPath);
      if (resolved) {
        return defaultResolve(pathToFileURL(resolved).href, context);
      }
    }
  }

  // Relative
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const parent = fileURLToPath(context.parentURL);
    const realPath = path.resolve(path.dirname(parent), specifier);
    const resolved = resolveWithFallback(realPath);
    if (resolved) {
      return defaultResolve(pathToFileURL(resolved).href, context);
    }
  }

  return defaultResolve(specifier, context);
}

export async function load(url, context, defaultLoad) {
  if (url.endsWith(".json")) {
    const filePath = fileURLToPath(url);
    const json = fs.readFileSync(filePath, "utf8");

    return {
      format: "module",
      source: `export default ${json};`,
      shortCircuit: true,
    };
  }

  return defaultLoad(url, context);
}
