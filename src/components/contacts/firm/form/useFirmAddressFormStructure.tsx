import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  TextFieldProps,
  NumberFieldProps,
  CustomFieldProps
} from '@/components/shared/form-builder/types';
import { useTranslation } from 'react-i18next';
import { Address, Country } from '@/types';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import React from 'react';

interface UseFirmAddressFormStructureProps {
  address?: Address;
  setAddressField?: (fieldName: string, value: any) => void;
  otherAddressLabel?: string;
  countries?: Country[];
  handleCopyAddress: () => void;
  disabled?: boolean;
}

export const useFirmAddressFormStructure = ({
  address,
  setAddressField,
  otherAddressLabel,
  countries = [],
  handleCopyAddress,
  disabled
}: UseFirmAddressFormStructureProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tCountry } = useTranslation('country');
  const { t: tContacts } = useTranslation('contacts');

  const copyField: Field<CustomFieldProps> = {
    id: 'copy-address',
    variant: FieldVariant.CUSTOM,
    props: {
      children: (
        <Label
          className="flex items-center gap-2 underline my-2 justify-end cursor-pointer"
          onClick={handleCopyAddress}
        >
          <Copy className="h-4 w-4" />
          {tCommon('commands.copy')} {tContacts(otherAddressLabel || '')}
        </Label>
      ) as any
    }
  };

  const addressLine1Field: Field<TextFieldProps> = {
    id: 'address',
    label: `${tContacts('common.address.address')} (*)`,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. 188 Avenue 14 Janvier',
    props: {
      value: address?.address,
      onChange: (value) => setAddressField?.('address', value),
      disabled
    }
  };

  const addressLine2Field: Field<TextFieldProps> = {
    id: 'address2',
    label: tContacts('common.address.address2'),
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. 188 Avenue 14 Janvier',
    props: {
      value: address?.address2,
      onChange: (value) => setAddressField?.('address2', value),
      disabled
    }
  };

  const regionField: Field<TextFieldProps> = {
    id: 'region',
    label: `${tContacts('common.address.region')} (*)`,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. Bizerte',
    props: {
      value: address?.region,
      onChange: (value) => setAddressField?.('region', value),
      disabled
    }
  };

  const zipCodeField: Field<NumberFieldProps> = {
    id: 'zipcode',
    label: `${tContacts('common.address.zip_code')} (*)`,
    variant: FieldVariant.NUMBER,
    placeholder: 'Ex. 7000',
    props: {
      value: address?.zipcode ? Number(address.zipcode) : undefined,
      onChange: (value) => setAddressField?.('zipcode', value),
      disabled
    }
  };

  const countryField: Field<SelectFieldProps> = {
    id: 'countryId',
    label: tContacts('common.address.country'),
    variant: FieldVariant.SELECT,
    placeholder: tContacts('common.address.country'),
    props: {
      value: address?.countryId?.toString(),
      onValueChange: (value) => setAddressField?.('countryId', parseInt(value)),
      options: countries.map((country) => ({
        label: country?.alpha2Code ? tCountry(country.alpha2Code) : country.name,
        value: country.id.toString()
      })),
      disabled
    }
  };

  const firmAddressFormStructure: FormStructure = {
    orientation: 'vertical',
    fieldsets: [
      {
        rows: [
          {
            fields: [copyField]
          },
          {
            fields: [addressLine1Field]
          },
          {
            fields: [addressLine2Field]
          },
          {
            fields: [regionField, zipCodeField]
          },
          {
            fields: [countryField]
          }
        ]
      }
    ]
  };

  return { firmAddressFormStructure };
};