/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['utfs.io', 'uploadthing.com'], // ✅ add your allowed domains here
  },
};

module.exports = nextConfig;