import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_URL:
      process.env.VERCEL_ENV === "local"
        ? `http://localhost:3000`
        : `https://${process.env.VERCEL_URL}`,
  },
};

export default nextConfig;
