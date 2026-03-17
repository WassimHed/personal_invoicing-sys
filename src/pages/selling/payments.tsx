import React from 'react';
import { PaymentPortal } from '@/components/selling/payment/PaymentPortal';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-8">
      <PaymentPortal />
    </div>
  );
}