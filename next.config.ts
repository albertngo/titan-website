import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Every URL ends in a slash (the WordPress site's convention, kept so the 106 legacy
  // slugs redirect nowhere; titan-agents-repo/platform-settings/content-engine.json ->
  // website.trailing_slash).
  trailingSlash: true,
};

export default nextConfig;
