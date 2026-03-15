import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ResearchGen-AI_v5',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
