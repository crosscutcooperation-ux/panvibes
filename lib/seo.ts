import type { Metadata } from 'next';
import { company } from './site-content';
import { shippingAreaSchema } from './shipping';

export const siteUrl = 'https://panvibes.com';
export const organizationId = `${siteUrl}/#organization`;

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${company.name} | ${title}`;
  return {
    title: { absolute: fullTitle }, description,
    alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'en_IN', siteName: company.name, title: fullTitle, description, url: path,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PanVibes Exim — B2B ingredients and export sourcing from India' }] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: ['/opengraph-image'] },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, i) => ({
    '@type': 'ListItem', position: i + 1, name: item.name, item: `${siteUrl}${item.path}`,
  })) };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(faq => ({
    '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })) };
}

export const organizationSchema = {
  '@context': 'https://schema.org', '@type': 'Organization', '@id': organizationId,
  name: company.name, legalName: company.legalName, url: siteUrl,
  description: 'India-based B2B supplier and exporter of food ingredients, with a separate industrial chemical portfolio.',
  logo: `${siteUrl}/images/panvibes-logo-transparent.png`, email: company.email,
  telephone: company.phones[0],
  areaServed: shippingAreaSchema,
  address: { '@type': 'PostalAddress', streetAddress: 'W-2106, Akshar Business Park, Sector 25, Vashi', addressLocality: 'Navi Mumbai', addressRegion: 'Maharashtra', postalCode: '400703', addressCountry: 'IN' },
  contactPoint: { '@type': 'ContactPoint', contactType: 'Export sales', email: company.email, telephone: company.phones[0], availableLanguage: 'English' },
  sameAs: ['https://www.youtube.com/@panvibes6161'],
  founder: { '@type': 'Person', name: company.founderName },
  subjectOf: { '@type': 'AboutPage', '@id': `${siteUrl}/about#webpage`, url: `${siteUrl}/about` },
};

export const websiteSchema = {
  '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${siteUrl}/#website`,
  name: company.name, alternateName: 'PanVibes', url: siteUrl,
  inLanguage: 'en', publisher: { '@id': organizationId },
  about: { '@id': organizationId },
};

export const companyAboutSchema = {
  '@context': 'https://schema.org', '@type': 'AboutPage', '@id': `${siteUrl}/about#webpage`,
  name: `About ${company.name}`, url: `${siteUrl}/about`,
  isPartOf: { '@id': `${siteUrl}/#website` }, mainEntity: { '@id': organizationId },
};
