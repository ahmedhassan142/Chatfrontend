import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: ['www.vecteezy.com'],
    // or with newer Next.js versions, use:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.vecteezy.com',
        pathname: '/vector-art/**',
      },
    ],
  },
  /* config options here */
   eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
