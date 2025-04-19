import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // TypeScript のビルドエラーを無視する
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
