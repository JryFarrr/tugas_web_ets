import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const baseRemotePatterns = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https",
    hostname: "i.pravatar.cc",
  },
] as Array<NonNullable<NextConfig["images"]>["remotePatterns"][number]>;

const remotePatterns = supabaseHost
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
