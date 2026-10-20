import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['127.0.0.1', ...Object.values(networkInterfaces()).flatMap(addresses =>
    addresses?.filter(address => address.family === 'IPv4' && !address.internal).map(address => address.address) ?? []
  )],
  output: 'standalone',
  poweredByHeader: false,
  // Bound the server's page cache on small instances. Media is pre-encoded
  // offline and served as static bytes, never transcoded by the Node process.
  cacheMaxMemorySize: 16 * 1024 * 1024,
  async headers() {
    return [{
      source: '/media/home-hero/:asset(hero-web-.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    }];
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
