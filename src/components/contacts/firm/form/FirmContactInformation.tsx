import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Address, Country } from '@/types';
import { useFirmAddressFormStructure } from './useFirmAddressFormStructure';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';

interface FirmAddressInformationProps {
  className?: string;
  address?: Address;
  setAddressField?: (fieldName: string, value: any) => void;
  addressLabel?: string;
  otherAddressLabel?: string;
  icon?: React.ReactNode;
  countries?: Country[];
  handleCopyAddress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const FirmAddressInformation = React.memo<FirmAddressInformationProps>(
  ({
    className,
    address,
    setAddressField,
    addressLabel,
    otherAddressLabel,
    icon,
    countries,
    handleCopyAddress,
    disabled
  }) => {
    const { t: tContacts } = useTranslation('contacts');
    const { firmAddressFormStructure } = useFirmAddressFormStructure({
      address,
      setAddressField,
      otherAddressLabel,
      countries,
      handleCopyAddress,
      disabled
    });

    return (
      <Card className={className}>
        <CardHeader className="p-5">
          <CardTitle className="border-b pb-2">
            <div className="flex items-center">
              {icon}
              <Label className="text-sm font-semibold">{tContacts(addressLabel || '')}</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormBuilder structure={firmAddressFormStructure} />
        </CardContent>
      </Card>
    );
  }
);

FirmAddressInformation.displayName = 'FirmAddressInformation';
export default FirmAddressInformation;