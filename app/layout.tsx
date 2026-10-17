import type { Metadata, Viewport } from "next";
import "./design.css";
import "./journey.css";
import "./brand.css";
import "./footer.css";
import "./home-video.css";
import "./interaction.css";
import "./globe.css";
import "./navigation.css";
import "./mobile.css";
import "./mobile-motion.css";
import Navbar from '@/components/Navbar';
import RouteLoader from '@/components/RouteLoader';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a3866',
};

export const metadata: Metadata = {
  title: "PanVibes Exim | Global Export Import Organization",
  description:
    "PanVibes Exim — international export-import, transport, document verification, and freight forwarding. Your Vision, Our Expert Execution.",
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><Navbar/><RouteLoader/>{children}</body>
    </html>
  );
}
