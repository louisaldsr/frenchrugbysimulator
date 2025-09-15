import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      loader: "csv-loader",
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      },
    });
    return config;
  },
  env: {
    NEXT_PUBLIC_URL:
      process.env.VERCEL_ENV === "local"
        ? `http://localhost:3000`
        : `https://${process.env.VERCEL_URL}`,
  },
};

export default nextConfig;
