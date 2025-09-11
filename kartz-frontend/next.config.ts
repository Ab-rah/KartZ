/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "13.60.211.173"], // ✅ Allow local and EC2 image URLs
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint during build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors during build
  },
};

module.exports = nextConfig;
