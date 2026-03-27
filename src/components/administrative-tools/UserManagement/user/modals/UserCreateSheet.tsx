import { User } from 'lucide-react';
import { useSheet } from '@/components/shared/Sheets';
import { useRoles } from '@/hooks/content/useRoles';
import { useTranslation } from 'react-i18next';
import { CreateUserForm } from '../forms/CreateUserForm';

interface UserCreateSheet {
  createUser?: () => void;
  isCreatePending?: boolean;
  resetUser?: () => void;
}

export const useUserCreateSheet = ({ createUser, isCreatePending, resetUser }: UserCreateSheet) => {
  const { t: tSettings } = useTranslation('settings');
  const { roles } = useRoles();

  const {
    SheetFragment: createUserSheet,
    openSheet: openCreateUserSheet,
    closeSheet: closeCreateUserSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <User />
        {tSettings('users.new')}
      </div>
    ),
    description: tSettings('users.hints.create_dialog_hint'),
    children: (
      <CreateUserForm
        className="my-4"
        roles={roles}
        createUser={() => createUser?.()}
        isCreatePending={isCreatePending ?? false}
      />
    ),
    className: 'sm:min-w-[40vw]',
    onToggle: resetUser
  });

  return {
    createUserSheet,
    openCreateUserSheet,
    closeCreateUserSheet
  };
};
