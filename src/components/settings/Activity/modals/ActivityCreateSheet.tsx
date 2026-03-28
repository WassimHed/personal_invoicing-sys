import React from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import { useSheet } from '@/components/shared/Sheets';
import { useTranslation } from 'react-i18next';
import { ActivityForm } from '../forms/ActivityForm';

interface ActivityCreateSheetProps {
  createActivity: () => void;
  isCreatePending?: boolean;
  resetActivity?: () => void;
}

export const useActivityCreateSheet = ({
  createActivity,
  isCreatePending = false,
  resetActivity
}: ActivityCreateSheetProps) => {
  const { t } = useTranslation('settings');

  const {
    SheetFragment: createActivitySheet,
    openSheet: openCreateActivitySheet,
    closeSheet: closeCreateActivitySheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BriefcaseBusiness />
        {t('activity.dialogs.create.title')}
      </div>
    ),
    description: t('activity.dialogs.create.description'),
    children: (
      <ActivityForm
        className="flex flex-col flex-1 overflow-hidden"
        onSave={createActivity}
        onReset={resetActivity}
        isPending={isCreatePending}
      />
    ),
    className: 'min-w-[450px] flex flex-col flex-1 overflow-hidden',
    onToggle: resetActivity
  });

  return {
    createActivitySheet,
    openCreateActivitySheet,
    closeCreateActivitySheet
  };
};
