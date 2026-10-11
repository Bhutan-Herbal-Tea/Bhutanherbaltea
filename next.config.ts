import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Footer copyright year, fixed per build so every page stays fully static.
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
  // cacheComponents (scaffold default) is off: the site is fully static, and with it on,
  // unknown /teas/<slug> pages streamed the 404 content with an HTTP 200 status.
  // Tea pages renamed to the client's product names (2026-10-11); keep old shared links working.
  async redirects() {
    return [
      { source: "/teas/peppermint", destination: "/teas/mint", permanent: true },
      { source: "/teas/sea-buckthorn", destination: "/teas/himalayan-sea-berry", permanent: true },
    ];
  },
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
