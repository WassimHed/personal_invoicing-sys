import { BookUser } from 'lucide-react';
import { useSheet } from '@/components/shared/Sheets';
import { CreateRoleForm } from '../forms/CreateRoleForm';
import { usePermissions } from '@/hooks/content/usePermissions';
import { useTranslation } from 'react-i18next';

interface RoleCreateSheet {
  createRole?: () => void;
  isCreatePending?: boolean;
  resetRole?: () => void;
}

export const useRoleCreateSheet = ({ createRole, isCreatePending, resetRole }: RoleCreateSheet) => {
  const { t: tSettings } = useTranslation('settings');
  const { permissions } = usePermissions();

  const {
    SheetFragment: createRoleSheet,
    openSheet: openCreateRoleSheet,
    closeSheet: closeCreateRoleSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        {tSettings('roles.new')}
      </div>
    ),
    description: tSettings('roles.hints.create_dialog_hint'),
    children: (
      <CreateRoleForm
        className="my-4"
        permissions={permissions}
        createRole={() => createRole?.()}
        isCreatePending={isCreatePending ?? false}
      />
    ),
    canScroll: true,
    className: 'sm:min-w-[40vw]',
    onToggle: resetRole
  });

  return {
    createRoleSheet,
    openCreateRoleSheet,
    closeCreateRoleSheet
  };
};
