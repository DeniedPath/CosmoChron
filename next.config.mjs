import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure module aliases
  experimental: {
    turbo: {
      resolveAlias: {
        '@': path.resolve(process.cwd(), './src'),
      }
    }
  }
};

export default nextConfig;
