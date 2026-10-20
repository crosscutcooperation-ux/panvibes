/** Shipping coverage confirmed by the owner on 18 October 2026. */
export const shippingMarkets = [
  { name: 'India', latitude: 19, longitude: 73, schemaType: 'Country' },
  { name: 'UK', latitude: 54, longitude: -2, schemaType: 'Country' },
  { name: 'USA', latitude: 39, longitude: -98, schemaType: 'Country' },
  { name: 'Europe', latitude: 52, longitude: 19, schemaType: 'Place' },
  { name: 'UAE', latitude: 24.4, longitude: 54.4, schemaType: 'Country' },
] as const;

export const shippingMarketList = shippingMarkets.map(market => market.name).join(' / ');
// An enquiry option, rather than a promise of delivery beyond confirmed markets.
export const otherEnquiryDestination = 'Any other';
export function normalizeEnquiryDestination(value: string): string {
  return value.trim().toLowerCase() === otherEnquiryDestination.toLowerCase() ? otherEnquiryDestination : normalizeShippingMarket(value);
}
export const shippingCoverage = 'We ship only to India, the UK, the USA, Europe and the UAE.';
export const shippingAreaSchema = shippingMarkets.map(market => ({ '@type': market.schemaType, name: market.name === 'UK' ? 'United Kingdom' : market.name === 'USA' ? 'United States' : market.name === 'UAE' ? 'United Arab Emirates' : market.name }));

export function normalizeShippingMarket(value: string): string {
  const aliases: Record<string, string> = { india: 'India', ind: 'India', in: 'India', uk: 'UK', gb: 'UK', 'united kingdom': 'UK', usa: 'USA', us: 'USA', 'united states': 'USA', 'united states of america': 'USA', europe: 'Europe', eu: 'Europe', uae: 'UAE', ae: 'UAE', 'united arab emirates': 'UAE' };
  return aliases[value.trim().toLowerCase()] || '';
}
