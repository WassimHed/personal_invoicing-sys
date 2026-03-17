import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Activity, Currency, PaymentCondition } from '@/types';
import { useFirmStore } from '@/hooks/stores/useFirmStore';
import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useFirmProfessionalFormStructure } from './useFirmProfessionalFormStructure';

interface FirmProfessionalInformationProps {
  className?: string;
  activities?: Activity[];
  currencies?: Currency[];
  paymentConditions?: PaymentCondition[];
  loading?: boolean;
}

const FirmProfessionalInformation: React.FC<FirmProfessionalInformationProps> = ({
  className,
  activities,
  currencies,
  paymentConditions,
  loading
}) => {
  const { t: tContact } = useTranslation('contacts');

  const firmStore = useFirmStore();
  const { firmProfessionalFormStructure } = useFirmProfessionalFormStructure({
    firmStore,
    activities,
    currencies,
    paymentConditions,
    loading
  });

  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <Briefcase className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">{tContact('common.firm_information')}</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormBuilder structure={firmProfessionalFormStructure} />
      </CardContent>
    </Card>
  );
};

export default FirmProfessionalInformation;