/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        pathname: '/xezq/**',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig; 