import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface BankAccountDeleteDialogProps {
  representation?: string;
  deleteBankAccount?: () => void;
  isDeletionPending?: boolean;
  reset?: () => void;
}

export const useBankAccountDeleteDialog = ({
  representation,
  deleteBankAccount,
  isDeletionPending,
  reset
}: BankAccountDeleteDialogProps) => {
  const { t } = useTranslation('settings');

  const {
    DialogFragment: deleteBankAccountDialog,
    openDialog: openDeleteBankAccountDialog,
    closeDialog: closeDeleteBankAccountDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t('bank_account.dialogs.delete.title')} <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: t('bank_account.dialogs.delete.description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteBankAccount?.();
              closeDeleteBankAccountDialog();
            }}>
            {t('bank_account.dialogs.delete.confirm')}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              reset?.();
              closeDeleteBankAccountDialog();
            }}>
            {t('bank_account.dialogs.delete.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: reset
  });

  return {
    deleteBankAccountDialog,
    openDeleteBankAccountDialog,
    closeDeleteBankAccountDialog
  };
};