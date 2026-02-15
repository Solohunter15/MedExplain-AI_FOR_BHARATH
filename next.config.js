/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    KIMI_AI_API_KEY: process.env.KIMI_AI_API_KEY,
    POLYGON_RPC_URL: process.env.POLYGON_RPC_URL,
    ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,
  },
  i18n: {
    locales: ['en', 'ml', 'hi'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig