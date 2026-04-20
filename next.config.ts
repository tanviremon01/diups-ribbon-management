/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // এরর থাকলেও সাইট লাইভ হবে
  },
  eslint: {
    ignoreDuringBuilds: true, // ESLint এরর ইগনোর করবে
  },
};

export default nextConfig;