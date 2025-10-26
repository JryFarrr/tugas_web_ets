import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const baseRemotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https",
    hostname: "i.pravatar.cc",
  },
];

const remotePatterns: RemotePattern[] = supabaseHost
  ? [
      ...baseRemotePatterns,
      {
        protocol: "https",
        hostname: supabaseHost,
      },
    ]
  : baseRemotePatterns;

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
