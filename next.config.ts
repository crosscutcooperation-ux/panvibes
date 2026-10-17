import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['127.0.0.1', ...Object.values(networkInterfaces()).flatMap(addresses =>
    addresses?.filter(address => address.family === 'IPv4' && !address.internal).map(address => address.address) ?? []
  )],
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
