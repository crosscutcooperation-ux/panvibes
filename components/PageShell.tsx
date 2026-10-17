import type { ReactNode } from 'react';
import Footer from './Footer';
import SiteMotion from './SiteMotion';

export default function PageShell({ children }: { children: ReactNode }) {
  return <SiteMotion><div className="inner-page">{children}<Footer/></div></SiteMotion>;
}
