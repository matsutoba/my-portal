import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dockerイメージに .next/standalone だけをコピーして動かすための出力形式
  output: "standalone",
};

export default nextConfig;
