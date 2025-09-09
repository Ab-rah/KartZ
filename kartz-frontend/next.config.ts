/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"], // ✅ Allow Django media URLs
  },
};

module.exports = nextConfig;
