import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
  RadioFieldProps,
  SelectFieldProps,
  TelFieldProps
} from '@/components/shared/form-builder/types';
import { useTranslation } from 'react-i18next';
import { Activity, Currency, PaymentCondition } from '@/types';

interface UseFirmProfessionalFormStructureProps {
  firmStore: any;
  activities?: Activity[];
  currencies?: Currency[];
  paymentConditions?: PaymentCondition[];
  loading?: boolean;
}

export const useFirmProfessionalFormStructure = ({
  firmStore,
  activities = [],
  currencies = [],
  paymentConditions = [],
  loading
}: UseFirmProfessionalFormStructureProps) => {
  const { t: tContact } = useTranslation('contacts');
  const { t: tCurrency } = useTranslation('currency');

  const typeField: Field<RadioFieldProps> = {
    id: 'isPerson',
    label: `${tContact('firm.attributes.type')} (*)`,
    variant: FieldVariant.RADIO,
    props: {
      value: firmStore.isPerson ? 'particulier' : 'entreprise',
      onValueChange: (value) => {
        firmStore.set('isPerson', value === 'particulier');
        firmStore.set('taxIdNumber', '');
      },
      options: [
        { label: tContact('firm.attributes.entreprise_type'), value: 'entreprise' },
        { label: tContact('firm.attributes.particular_entreprise_type'), value: 'particulier' }
      ],
      disabled: loading
    }
  };

  const taxIdField: Field<TextFieldProps> = {
    id: 'taxIdNumber',
    label: `${tContact('firm.attributes.tax_number')} (*)`,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. 123456789',
    hidden: firmStore.isPerson,
    props: {
      value: firmStore.taxIdNumber,
      onChange: (value) => firmStore.set('taxIdNumber', value),
      disabled: loading
    }
  };

  const enterpriseNameField: Field<TextFieldProps> = {
    id: 'enterpriseName',
    label: `${tContact('firm.attributes.entreprise_name')} (*)`,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. Zedney Creative',
    props: {
      value: firmStore.enterpriseName,
      onChange: (value) => firmStore.set('enterpriseName', value),
      disabled: loading
    }
  };

  const websiteField: Field<TextFieldProps> = {
    id: 'website',
    label: tContact('firm.attributes.website'),
    variant: FieldVariant.URL,
    placeholder: 'Ex. zedneycreative.com',
    props: {
      value: firmStore.website,
      onChange: (value) => firmStore.set('website', value),
      disabled: loading
    }
  };

  const phoneField: Field<TelFieldProps> = {
    id: 'entreprisePhone',
    label: tContact('firm.attributes.phone'),
    variant: FieldVariant.TEL,
    placeholder: 'Ex. +216 72 398 389',
    props: {
      value: firmStore.entreprisePhone,
      onChange: (value) => firmStore.set('entreprisePhone', value),
      disabled: loading
    }
  };

  const activityField: Field<SelectFieldProps> = {
    id: 'activity',
    label: tContact('firm.attributes.activity'),
    variant: FieldVariant.SELECT,
    placeholder: tContact('firm.attributes.activity'),
    props: {
      value: firmStore.activity?.id?.toString() || '',
      onValueChange: (value) => firmStore.set('activity', { id: parseInt(value) } as Activity),
      options: activities.map((activity) => ({
        label: activity.label || '',
        value: activity.id?.toString() || ''
      })),
      disabled: loading
    }
  };

  const currencyField: Field<SelectFieldProps> = {
    id: 'currency',
    label: tContact('firm.attributes.currency'),
    variant: FieldVariant.SELECT,
    placeholder: tContact('firm.attributes.currency'),
    props: {
      value: firmStore.currency?.id?.toString() || '',
      onValueChange: (value) => firmStore.set('currency', { id: parseInt(value) } as Currency),
      options: currencies.map((currency) => ({
        label: currency.code ? `${tCurrency(currency.code)} (${currency.symbol})` : '',
        value: currency.id?.toString() || ''
      })),
      disabled: loading
    }
  };

  const paymentConditionField: Field<SelectFieldProps> = {
    id: 'paymentCondition',
    label: tContact('firm.attributes.payment_conditions'),
    variant: FieldVariant.SELECT,
    placeholder: tContact('firm.attributes.payment_conditions'),
    props: {
      value: firmStore.paymentCondition?.id?.toString() || '',
      onValueChange: (value) =>
        firmStore.set('paymentCondition', { id: parseInt(value) } as PaymentCondition),
      options: paymentConditions.map((condition) => ({
        label: condition.label || '',
        value: condition.id?.toString() || ''
      })),
      disabled: loading
    }
  };

  const firmProfessionalFormStructure: FormStructure = {
    orientation: 'vertical',
    fieldsets: [
      {
        rows: [
          {
            fields: [typeField, taxIdField]
          },
          {
            fields: [enterpriseNameField, websiteField, phoneField]
          },
          {
            fields: [activityField, currencyField]
          },
          {
            fields: [paymentConditionField]
          }
        ]
      }
    ]
  };

  return { firmProfessionalFormStructure };
};