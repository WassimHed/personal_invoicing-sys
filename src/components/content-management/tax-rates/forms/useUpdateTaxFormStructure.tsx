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

interface useUpdateTaxFormStructureProps {
  store: TaxStore;
  currencies: SelectOption[];
}

export const useUpdateTaxFormStructure = ({
  store,
  currencies
}: useUpdateTaxFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: 'label',
    label: 'Label',
    description: 'Enter a unique name for the tax (e.g., VAT, FODEC)',
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. FODEC',
    error: store.updateDtoErrors?.label?.[0],
    props: {
      value: store.updateDto?.label || '',
      onChange: (value) => {
        store.setNested('updateDto.label', value);
        store.setNested('updateDtoErrors.label', []);
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
    error: store.updateDtoErrors?.value?.[0],
    props: {
      value: store.updateDto?.value || 0,
      onChange: (value) => {
        store.setNested('updateDto.value', value);
        store.setNested('updateDtoErrors.value', []);
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
    error: store.updateDtoErrors?.isRate?.[0],
    props: {
      options: [
        { label: 'Percentage (%)', value: 'true' },
        { label: 'Amount ($)', value: 'false' }
      ],
      value: store.updateDto?.isRate?.toString() || 'true',
      onValueChange: (value) => {
        store.setNested('updateDto.isRate', value === 'true');
        store.setNested('updateDtoErrors.isRate', []);
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
      checked: store.updateDto?.isSpecial ?? false,
      onCheckedChange: (checked) => {
        store.setNested('updateDto.isSpecial', checked);
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
    error: store.updateDtoErrors?.currencyId?.[0],
    props: {
      options: currencies,
      value: store.updateDto?.currencyId?.toString() || undefined,
      onValueChange: (value) => {
        store.setNested('updateDto.currencyId', value ? Number(value) : null);
        store.setNested('updateDtoErrors.currencyId', []);
      }
    }
  };

  const structure: FormStructure = {
    title: 'Update Tax',
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

