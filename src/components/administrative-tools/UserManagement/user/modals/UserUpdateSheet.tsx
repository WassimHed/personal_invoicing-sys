import { User } from 'lucide-react';
import { useSheet } from '@/components/shared/Sheets';
import { useRoles } from '@/hooks/content/useRoles';
import { useTranslation } from 'react-i18next';
import { UpdateUserForm } from '../forms/UpdateUserForm';

interface UserUpdateSheet {
  updateUser?: () => void;
  isUpdatePending?: boolean;
  resetUser?: () => void;
}

export const useUserUpdateSheet = ({ updateUser, isUpdatePending, resetUser }: UserUpdateSheet) => {
  const { t: tSettings } = useTranslation('settings');
  const { roles } = useRoles();

  const {
    SheetFragment: updateUserSheet,
    openSheet: openUpdateUserSheet,
    closeSheet: closeUpdateUserSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <User />
        {tSettings('users.update')}
      </div>
    ),
    description: tSettings('users.hints.update_dialog_hint'),
    children: (
      <UpdateUserForm
        className="my-4"
        roles={roles}
        updateUser={() => updateUser?.()}
        isUpdatePending={isUpdatePending ?? false}
      />
    ),
    className: 'sm:min-w-[40vw]',
    onToggle: resetUser
  });

  return {
    updateUserSheet,
    openUpdateUserSheet,
    closeUpdateUserSheet
  };
};
