import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { DefaultConditionPortal } from '@/components/settings/DefaultCondition/DefaultConditionPortal';

export default function Page() {
  return (
    <SystemSettings>
      <DefaultConditionPortal />
    </SystemSettings>
  );
}
