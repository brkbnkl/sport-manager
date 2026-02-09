import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
