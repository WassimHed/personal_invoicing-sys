import React from 'react';
import UserManagementSettings from '@/components/administrative-tools/UserManagementSettings';
import { UserPortal } from '@/components/administrative-tools/UserManagement/user/UserPortal';

export default function Page() {
  return (
    <UserManagementSettings>
      <UserPortal />
    </UserManagementSettings>
  );
}
