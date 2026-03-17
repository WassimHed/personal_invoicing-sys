import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { TaxPortal } from '@/components/settings/Tax/TaxPortal';

export default function Page() {
  return (
    <SystemSettings>
      <TaxPortal />
    </SystemSettings>
  );
}
