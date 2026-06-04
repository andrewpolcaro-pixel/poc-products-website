import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wordpress-1633433-6466395.cloudwaysapps.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
