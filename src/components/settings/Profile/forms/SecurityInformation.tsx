import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound } from 'lucide-react';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useTranslation } from 'react-i18next';
import { useProfileFormStructure } from '../useProfileFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';

interface SecurityInformationProps {
  className?: string;
  isPending?: boolean;
}

export const SecurityInformation: React.FC<SecurityInformationProps> = ({
  className,
  isPending
}) => {
  const userStore = useUserStore();
  const { t: tSettings } = useTranslation('settings');
  const { securityFormStructure } = useProfileFormStructure({
    userManager: userStore,
    isPending
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <KeyRound className="size-5" />
            {tSettings('profile.security_information', { defaultValue: 'Security & Password' })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormBuilder structure={securityFormStructure} />
      </CardContent>
    </Card>
  );
};
