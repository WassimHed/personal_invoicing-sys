import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NotepadText } from 'lucide-react';
import { useFirmStore } from '@/hooks/stores/useFirmStore';
import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useFirmNotesFormStructure } from './useFirmNotesFormStructure';

interface FirmNotesInformationProps {
  className?: string;
  placeholder?: string;
  loading?: boolean;
}

const FirmNotesInformation: React.FC<FirmNotesInformationProps> = ({
  className,
  placeholder = '',
  loading
}) => {
  const { t } = useTranslation('contacts');
  const firmStore = useFirmStore();
  const { firmNotesFormStructure } = useFirmNotesFormStructure({
    firmStore,
    placeholder,
    loading
  });

  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <NotepadText className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">{t('firm.attributes.notes')}</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormBuilder structure={firmNotesFormStructure} />
      </CardContent>
    </Card>
  );
};

export default FirmNotesInformation;