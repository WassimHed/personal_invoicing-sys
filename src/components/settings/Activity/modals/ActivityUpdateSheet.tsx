import React from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import { useSheet } from '@/components/shared/Sheets';
import { useTranslation } from 'react-i18next';
import { ActivityForm } from '../forms/ActivityForm';

interface ActivityUpdateSheetProps {
  updateActivity: () => void;
  isUpdatePending?: boolean;
  resetActivity?: () => void;
}

export const useActivityUpdateSheet = ({
  updateActivity,
  isUpdatePending = false,
  resetActivity
}: ActivityUpdateSheetProps) => {
  const { t } = useTranslation('settings');

  const {
    SheetFragment: updateActivitySheet,
    openSheet: openUpdateActivitySheet,
    closeSheet: closeUpdateActivitySheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BriefcaseBusiness />
        {t('activity.dialogs.update.title')}
      </div>
    ),
    description: t('activity.dialogs.update.description'),
    children: (
      <ActivityForm
        className="flex flex-col flex-1 overflow-hidden"
        onSave={updateActivity}
        onReset={resetActivity}
        isPending={isUpdatePending}
      />
    ),
    className: 'min-w-[450px] flex flex-col flex-1 overflow-hidden',
    onToggle: resetActivity
  });

  return {
    updateActivitySheet,
    openUpdateActivitySheet,
    closeUpdateActivitySheet
  };
};
