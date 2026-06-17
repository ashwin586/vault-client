import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    domains: ["www.google.com"],
  },
  async redirects() {
    return [
      {
        source: "/profile/managepasswords",
        destination: "/vault",
        permanent: true,
      },
      {
        source: "/profile/manageaccount",
        destination: "/settings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
