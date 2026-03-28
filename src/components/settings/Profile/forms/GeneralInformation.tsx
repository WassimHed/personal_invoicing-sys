import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useTranslation } from 'react-i18next';
import { useProfileFormStructure } from '../useProfileFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';

interface GeneralInformationProps {
  className?: string;
  isPending?: boolean;
}

export const GeneralInformation: React.FC<GeneralInformationProps> = ({
  className,
  isPending
}) => {
  const userStore = useUserStore();
  const { t: tSettings } = useTranslation('settings');
  const { generalFormStructure } = useProfileFormStructure({
    userManager: userStore,
    isPending
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <UserCircle className="size-5" />
            {tSettings('profile.general_information', { defaultValue: 'General Information' })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormBuilder structure={generalFormStructure} />
      </CardContent>
    </Card>
  );
};
