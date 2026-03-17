import React from 'react';
import { Activity, Currency } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCabinetManager } from '@/components/settings/Cabinet/hooks/useCabinetManager';
import { Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCabinetFormStructure } from './useCabinetFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';

interface AccountingInformationProps {
  className?: string;
  activities: Activity[];
  currencies: Currency[];
  isPending?: boolean;
}

export const AccountingInformation = ({
  className,
  activities = [],
  currencies = [],
  isPending
}: AccountingInformationProps) => {
  const { t: tSettings } = useTranslation('settings');
  const cabinetManager = useCabinetManager();
  const { accountingFormStructure } = useCabinetFormStructure({
    cabinetManager,
    activities,
    currencies,
    isPending
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Calculator />
            {tSettings('cabinet.financial_information')}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormBuilder structure={accountingFormStructure} />
      </CardContent>
    </Card>
  );
};