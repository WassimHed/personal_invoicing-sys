import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { PaymentConditionPortal } from '@/components/settings/PaymentCondition/PaymentConditionPortal';

export default function Page() {
  return (
    <SystemSettings>
      <PaymentConditionPortal />
    </SystemSettings>
  );
}
