import React from 'react';
import { QuotationPortal } from '@/components/selling/quotation/QuotationPortal';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-8">
      <QuotationPortal className="p-5 my-10" />
    </div>
  );
}