import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  SelectFieldProps,
  SelectOption,
  SwitchFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { TaxStore } from '@/hooks/stores/useTaxStore';

interface useCreateTaxFormStructureProps {
  store: TaxStore;
  currencies: SelectOption[];
}

export const useCreateTaxFormStructure = ({
  store,
  currencies
}: useCreateTaxFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: 'label',
    label: 'Label',
    description: 'Enter a unique name for the tax (e.g., VAT, FODEC)',
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. FODEC',
    error: store.createDtoErrors?.label?.[0],
    props: {
      value: store.createDto.label,
      onChange: (value) => {
        store.setNested('createDto.label', value);
        store.setNested('createDtoErrors.label', []);
      }
    }
  };

  const valueField: Field<NumberFieldProps> = {
    id: 'value',
    label: 'Value',
    description: 'Enter the value of the tax (e.g., 10 for 10%)',
    required: true,
    variant: FieldVariant.NUMBER,
    placeholder: 'Ex. 10',
    error: store.createDtoErrors?.value?.[0],
    props: {
      value: store.createDto.value,
      onChange: (value) => {
        store.setNested('createDto.value', value);
        store.setNested('createDtoErrors.value', []);
      }
    }
  };

  const typeField: Field<SelectFieldProps> = {
    id: 'isRate',
    label: 'Type',
    description: 'Select the type of tax (percentage or amount)',
    required: true,
    variant: FieldVariant.SELECT,
    placeholder: 'Select type',
    error: store.createDtoErrors?.isRate?.[0],
    props: {
      options: [
        { label: 'Percentage (%)', value: 'true' },
        { label: 'Amount ($)', value: 'false' }
      ],
      value: store.createDto.isRate?.toString() || 'true',
      onValueChange: (value) => {
        store.setNested('createDto.isRate', value === 'true');
        store.setNested('createDtoErrors.isRate', []);
      }
    }
  };

  const isSpecialField: Field<SwitchFieldProps> = {
    id: 'isSpecial',
    label: 'Special Tax',
    description:
      'Une taxe spéciale est appliquée sur le montant après que les taxes normales ont déjà été calculées.',
    variant: FieldVariant.SWITCH,
    props: {
      checked: store.createDto.isSpecial || false,
      onCheckedChange: (checked) => {
        store.setNested('createDto.isSpecial', checked);
      }
    }
  };

  const currencyField: Field<SelectFieldProps> = {
    id: 'currencyId',
    label: 'Currency',
    description: 'Choose the currency of the tax',
    required: false,
    variant: FieldVariant.SELECT,
    placeholder: 'Select currency',
    error: store.createDtoErrors?.currencyId?.[0],
    props: {
      options: currencies,
      value: store.createDto.currencyId?.toString() || undefined,
      onValueChange: (value) => {
        store.setNested('createDto.currencyId', value ? Number(value) : null);
        store.setNested('createDtoErrors.currencyId', []);
      }
    }
  };

  const structure: FormStructure = {
    title: 'Create Tax',
    orientation: 'horizontal',
    fieldsets: [
      {
        title: 'Tax Information',
        rows: [
          { fields: [labelField] },
          { fields: [valueField, typeField] },
          { fields: [isSpecialField] },
          { fields: [currencyField] }
        ]
      }
    ]
  };

  return { structure };
};

