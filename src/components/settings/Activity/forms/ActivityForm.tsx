import React from 'react';
import { cn } from '@/lib/utils';
import { useActivityFormStructure } from './useActivityFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/shared/Spinner';
import { useTranslation } from 'react-i18next';

interface ActivityFormProps {
  className?: string;
  onSave?: () => void;
  onReset?: () => void;
  isPending?: boolean;
}

export const ActivityForm = ({ className, onSave, onReset, isPending }: ActivityFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { activityFormStructure } = useActivityFormStructure();

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden p-4', className)}>
      <FormBuilder
        className="flex flex-col flex-1 overflow-auto"
        structure={activityFormStructure}
      />
      <Separator className="my-4" />
      <div className="flex flex-row justify-end gap-2">
        <Button onClick={onSave} disabled={isPending}>
          {tCommon('commands.save')}
          <Spinner show={isPending} />
        </Button>
        <Button variant={'outline'} onClick={onReset}>
          {tCommon('commands.reset')}
        </Button>
      </div>
    </div>
  );
};