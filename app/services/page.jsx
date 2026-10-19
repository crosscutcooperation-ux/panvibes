import ServicesExperience from './services-experience';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('Export, Import & Freight Forwarding Services', 'Explore PanVibes Exim export, import, transport, document verification and freight forwarding support for international B2B trade.', '/services');

export default function ServicesPage() {
  return <ServicesExperience />;
}
