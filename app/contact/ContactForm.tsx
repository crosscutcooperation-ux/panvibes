'use client';
import { useSearchParams } from 'next/navigation';
import EnquiryForm from '@/components/EnquiryForm';

export default function ContactForm() {
  const params = useSearchParams();
  return <EnquiryForm key={params.toString()} query={params.toString()} />;
}
