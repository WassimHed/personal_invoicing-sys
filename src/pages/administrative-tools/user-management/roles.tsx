import { RolePortal } from '@/components/administrative-tools/UserManagement/role/RolePortal';
import UserManagementSettings from '@/components/administrative-tools/UserManagementSettings';
import React from 'react';

export default function Page() {
  return (
    <UserManagementSettings>
      <RolePortal />
    </UserManagementSettings>
  );
}
