import React from 'react';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { BankAccountPortal } from '@/components/settings/BankAccount/BankAccountPortal';

export default function Page() {
  return (
    <InformationalSettings>
      <BankAccountPortal />
    </InformationalSettings>
  );
}
