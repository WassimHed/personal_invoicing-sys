import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useDialog } from '@/components/shared/Dialogs';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { Check, Info, X } from 'lucide-react';

interface ActivityDeleteDialogProps {
  label?: string;
  deleteActivity?: () => void;
  isDeletionPending?: boolean;
  reset?: () => void;
}

export const useActivityDeleteDialog = ({
  label,
  deleteActivity,
  isDeletionPending,
  reset
}: ActivityDeleteDialogProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const {
    DialogFragment: deleteActivityDialog,
    openDialog: openDeleteActivityDialog,
    closeDialog: closeDeleteActivityDialog
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <X className="text-red-500" />
        <span className="font-semibold">{tSettings('activity.dialogs.delete.title')}</span>
      </div>
    ),
    description: (
      <div className="flex gap-4 items-center py-2 text-left">
        <Info className="w-10 h-10 text-red-500 shrink-0" />
        <span className="text-sm text-muted-foreground leading-tight">
          <Trans
            t={tSettings}
            i18nKey="activity.dialogs.delete.description"
            values={{ label }}
            components={{ label: <span className="font-bold text-foreground" /> }}
          />
        </span>
      </div>
    ),
    children: (
      <div className="flex gap-2 justify-end mt-4">
        <Button
          variant="destructive"
          className="flex gap-2"
          onClick={() => {
            deleteActivity?.();
            closeDeleteActivityDialog();
          }}>
          <Check className="w-4 h-4" />
          {tCommon('commands.delete')}
          <Spinner show={isDeletionPending} />
        </Button>
        <Button
          variant="secondary"
          className="flex gap-2"
          onClick={() => {
            reset?.();
            closeDeleteActivityDialog();
          }}>
          <X className="w-4 h-4" />
          {tCommon('answer.no')}
        </Button>
      </div>
    ),
    className: 'w-[450px]',
    onToggle: reset
  });

  return {
    deleteActivityDialog,
    openDeleteActivityDialog,
    closeDeleteActivityDialog
  };
};
