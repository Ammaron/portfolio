import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove the i18n config - it's for pages directory only
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;