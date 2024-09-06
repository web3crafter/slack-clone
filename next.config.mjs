/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "wonderful-lapwing-881.convex.cloud" },
    ],
  },
};

export default nextConfig;
