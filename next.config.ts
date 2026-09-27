import type { NextConfig } from "next";

const base = process.env.PAGES_BASE_PATH || "";
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: base,
  images: { unoptimized: true },
};
export default nextConfig;
