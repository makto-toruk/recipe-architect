/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  webpack: (config) => {
    config.resolve.alias["@"] = __dirname;
    return config;
  },
};

module.exports = nextConfig;
