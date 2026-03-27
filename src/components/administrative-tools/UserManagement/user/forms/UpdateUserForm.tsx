import React from 'react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { Role } from '@/types/role';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useUserFormStructure } from './useUserFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/shared/Spinner';
import { useTranslation } from 'react-i18next';

interface UpdateUserFormProps {
  className?: string;
  roles?: Role[];
  updateUser: () => void;
  isUpdatePending: boolean;
}

export const UpdateUserForm = ({
  className,
  roles,
  updateUser,
  isUpdatePending
}: UpdateUserFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const store = useUserStore();
  const [showPasswordInputs, setShowPasswordInputs] = React.useState(false);

  const handleShowPasswordInputs = (checked: CheckedState) => {
    const isChecked = checked as boolean;
    const value = isChecked ? '' : undefined;
    setShowPasswordInputs(isChecked);
    store.set('password', value);
    store.set('confirmPassword', value);
  };

  const { userFormStructure } = useUserFormStructure({
    store,
    roles,
    forceShowPasswordInputs: false,
    showPasswordInputs,
    handleShowPasswordInputs
  });

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <FormBuilder className="flex flex-col flex-1 overflow-auto p-2" structure={userFormStructure} />
      <Separator className="mb-4 mt-2" />
      <div className="flex flex-row justify-end gap-2">
        <Button onClick={updateUser} disabled={isUpdatePending}>
          {tCommon('commands.save')}
          <Spinner show={isUpdatePending} />
        </Button>
        <Button variant="outline" onClick={() => store.reset()}>
          {tCommon('commands.reset')}
        </Button>
      </div>
    </div>
  );
};
