import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.ignoreWarnings = [
        ...(config.ignoreWarnings ?? []),
        {
          module: /duckdb-wasm/,
          message: /topLevelAwait/,
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
