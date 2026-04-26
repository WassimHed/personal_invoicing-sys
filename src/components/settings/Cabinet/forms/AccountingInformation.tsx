import React from 'react';
import { Activity, CurrencyPayload, ResponseRefParamDto } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCabinetStore } from '@/hooks/stores/useCabinetStore';
import { Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCabinetFormStructure } from '../useCabinetFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';

interface AccountingInformationProps {
  className?: string;
  activities: Activity[];
  currencies: ResponseRefParamDto<CurrencyPayload>[];
  isPending?: boolean;
}

export const AccountingInformation = ({
  className,
  activities = [],
  currencies = [],
  isPending
}: AccountingInformationProps) => {
  const { t: tSettings } = useTranslation('settings');
  const cabinetStore = useCabinetStore();
  const { accountingFormStructure } = useCabinetFormStructure({
    cabinetManager: cabinetStore,
    activities,
    currencies,
    isPending
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Calculator className="size-5" />
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
