import React from 'react';
import { ActivityPortal } from '@/components/settings/Activity/ActivityPortal';
import { SystemSettings } from '@/components/settings/SystemSettings';

export default function Page() {
  return (
    <SystemSettings>
      <ActivityPortal />
    </SystemSettings>
  );
}
