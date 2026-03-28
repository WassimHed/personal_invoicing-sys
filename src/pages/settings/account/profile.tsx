import React from 'react';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import ProfilePortal from '@/components/settings/Profile/ProfilePortal';

export default function Page() {
  return (
    <InformationalSettings>
      <ProfilePortal />
    </InformationalSettings>
  );
}
