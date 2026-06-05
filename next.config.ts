import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "user-images.githubusercontent.com" },
      { hostname: "github.com" },
      { hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
