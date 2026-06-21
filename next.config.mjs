/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 複数lockfile検出による誤ったworkspace root推定を避ける
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
