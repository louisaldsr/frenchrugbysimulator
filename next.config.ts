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
};

export default nextConfig;
