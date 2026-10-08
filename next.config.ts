import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Footer copyright year, fixed per build (Cache Components forbids new Date() while prerendering).
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
