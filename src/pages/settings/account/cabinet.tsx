import React from 'react';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import CabinetPortal from '@/components/settings/Cabinet/CabinetPortal';

export default function Page() {
  return (
    <InformationalSettings>
      <CabinetPortal />
    </InformationalSettings>
  );
}
