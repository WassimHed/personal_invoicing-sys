import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { SequentialPortal } from '@/components/settings/Sequentials/SequentialPortal';

export default function Page() {
  return (
    <SystemSettings>
      <SequentialPortal />
    </SystemSettings>
  );
}
