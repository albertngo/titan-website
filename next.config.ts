import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The live WordPress URLs all end in "/"; keeping them identical keeps search rankings.
  trailingSlash: true,
};

export default nextConfig;
