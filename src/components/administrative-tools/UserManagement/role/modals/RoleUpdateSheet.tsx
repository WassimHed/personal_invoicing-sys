import { BookUser } from 'lucide-react';
import { useSheet } from '@/components/shared/Sheets';
import { UpdateRoleForm } from '../forms/UpdateRoleForm';
import { usePermissions } from '@/hooks/content/usePermissions';
import { useTranslation } from 'react-i18next';

interface RoleUpdateSheet {
  updateRole?: () => void;
  isUpdatePending?: boolean;
  resetRole?: () => void;
}

export const useRoleUpdateSheet = ({ updateRole, isUpdatePending, resetRole }: RoleUpdateSheet) => {
  const { t: tSettings } = useTranslation('settings');
  const { permissions } = usePermissions();

  const {
    SheetFragment: updateRoleSheet,
    openSheet: openUpdateRoleSheet,
    closeSheet: closeUpdateRoleSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        {tSettings('roles.update')}
      </div>
    ),
    description: tSettings('roles.hints.update_dialog_hint'),
    children: (
      <UpdateRoleForm
        className="my-4"
        permissions={permissions}
        updateRole={() => updateRole?.()}
        isUpdatePending={isUpdatePending ?? false}
      />
    ),
    canScroll: true,
    className: 'sm:min-w-[40vw]',
    onToggle: resetRole
  });

  return {
    updateRoleSheet,
    openUpdateRoleSheet,
    closeUpdateRoleSheet
  };
};
