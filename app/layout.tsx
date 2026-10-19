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
import SupportWidget from '@/components/SupportWidget';
import StructuredData from '@/components/StructuredData';
import { organizationSchema, siteUrl, pageMetadata } from '@/lib/seo';
import './buyer.css';
import './support.css';
import './typography.css';
import './header-contrast.css';
import './enquiry.css';
import './cursor.css';
import './owner-refinements.css';
import ShipCursor from '@/components/ShipCursor';
import RouteLoader from '@/components/RouteLoader';
import EnquiryProvider from '@/components/EnquiryProvider';
import EnquiryButton from '@/components/EnquiryButton';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a3866',
};

export const metadata: Metadata = {
  ...pageMetadata('B2B Food Ingredient Supplier & Exporter India', 'Source dehydrated vegetables, ginger, turmeric, moringa, makhana and fruit powders from India. B2B ingredient and chemical sourcing with export support.', '/'),
  metadataBase: new URL(siteUrl),
  applicationName: 'PanVibes Exim',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><RouteLoader/><ShipCursor/><EnquiryProvider><StructuredData data={organizationSchema}/><Navbar/>{children}<EnquiryButton className="enquiry-global-button">Enquiry ↗</EnquiryButton><SupportWidget/></EnquiryProvider></body>
    </html>
  );
}
