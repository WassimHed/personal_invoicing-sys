import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { TaxWithholdingPortal } from '@/components/settings/TaxWithholding/TaxWithholdingPortal';

export default function Page() {
  return (
    <SystemSettings>
      <TaxWithholdingPortal />
    </SystemSettings>
  );
}
