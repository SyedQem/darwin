import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sjfwqrfrxcmmcgibqmsl.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
