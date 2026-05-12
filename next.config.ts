import type { NextConfig } from "next";

console.log("NPM LIFECYCLE EVENT:", process.env.npm_lifecycle_event);

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
