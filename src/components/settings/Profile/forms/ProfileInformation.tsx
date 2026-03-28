import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactRound } from 'lucide-react';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useTranslation } from 'react-i18next';
import { useProfileFormStructure } from '../useProfileFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';

interface ProfileInformationProps {
  className?: string;
  isPending?: boolean;
}

export const ProfileInformation: React.FC<ProfileInformationProps> = ({
  className,
  isPending
}) => {
  const userStore = useUserStore();
  const { t: tSettings } = useTranslation('settings');
  const { profileFormStructure } = useProfileFormStructure({
    userManager: userStore,
    isPending
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <ContactRound className="size-5" />
            {tSettings('profile.profile_information', { defaultValue: 'Profile Information' })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormBuilder structure={profileFormStructure} />
      </CardContent>
    </Card>
  );
};
