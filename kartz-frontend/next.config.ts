module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost', '13.60.211.173'],
  },
  experimental: {
    esmExternals: true,
  },
};
