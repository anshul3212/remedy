import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: ["*"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "heyrmdy-dev.s3.us-east-2.amazonaws.com",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
} satisfies NextConfig;

export default nextConfig;
