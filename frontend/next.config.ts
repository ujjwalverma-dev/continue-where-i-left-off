import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The Express API source remains shared with the local backend entrypoint.
  // Trace from the repository root so Vercel includes that source when this
  // frontend directory is selected as the deployment Root Directory.
  outputFileTracingRoot: path.join(__dirname, ".."),
  async rewrites() {
    return [
      {
        // Preserve the existing standalone backend health-check URL while the
        // API itself is hosted by this Next.js deployment.
        source: "/health",
        destination: "/api/__health",
      },
    ];
  },
};

export default nextConfig;
