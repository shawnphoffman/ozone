/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ozone.shawnhoffman.dev/',
        port: '',
        pathname: '/**',
      },
    ],
  },
}
