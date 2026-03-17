import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { useFirmStore } from '@/hooks/stores/useFirmStore';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useFirmContactFormStructure } from './useFirmContactFormStructure';

interface FirmContactInformationProps {
  className?: string;
  loading?: boolean;
}

const FirmContactInformation: React.FC<FirmContactInformationProps> = ({
  className,
  loading
}) => {
  const { t: tContacts } = useTranslation('contacts');
  const firmStore = useFirmStore();
  const { firmContactFormStructure } = useFirmContactFormStructure({
    firmStore,
    loading
  });

  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <User className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">{tContacts('common.contact_information')}</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormBuilder structure={firmContactFormStructure} />
      </CardContent>
    </Card>
  );
};

FirmContactInformation.displayName = 'FirmContactInformation';
export default FirmContactInformation;