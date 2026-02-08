import { NextResponse } from "next/server";

/**
 * GET /api/version
 * Returns build and deployment information
 */
export async function GET() {
  return NextResponse.json({
    gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || "unknown",
    gitBranch: process.env.VERCEL_GIT_COMMIT_REF || "unknown",
    buildId: process.env.VERCEL_DEPLOYMENT_ID || "local",
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    region: process.env.VERCEL_REGION || "local",
    url: process.env.VERCEL_URL || process.env.APP_URL || "localhost:3001",
  });
}
