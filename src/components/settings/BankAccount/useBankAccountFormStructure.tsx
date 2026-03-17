import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SwitchFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { useBankAccountManager } from './hooks/useBankAccountManager';
import { useTranslation } from 'react-i18next';
import useCurrency from '@/hooks/content/useCurrency';

export const useBankAccountFormStructure = (mainByDefault?: boolean) => {
  const { t: tCurrency } = useTranslation('currency');
  const { t: tSettings } = useTranslation('settings');

  const bankAccountManager = useBankAccountManager();
  const { currencies } = useCurrency();

  const nameField: Field<TextFieldProps> = {
    id: 'bank-account-name',
    label: tSettings('bank_account.attributes.name'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. Al Baraka',
    props: {
      value: bankAccountManager?.name,
      onChange: (e: string) => bankAccountManager.set('name', e)
    }
  };

  const bicField: Field<TextFieldProps> = {
    id: 'bank-account-bic',
    label: tSettings('bank_account.attributes.bic'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. BSTUTNTT',
    props: {
      value: bankAccountManager?.bic,
      onChange: (e: string) => bankAccountManager.set('bic', e)
    }
  };

  const currencyField: Field<SelectFieldProps> = {
    id: 'bank-account-currency',
    label: tSettings('bank_account.attributes.currency'),
    required: true,
    variant: FieldVariant.SELECT,
    props: {
      value: bankAccountManager?.currency?.id?.toString() || undefined,
      onValueChange: (e: string) => bankAccountManager.set('currency', { id: parseInt(e) }),
      options: currencies?.map((currency) => ({
        label: `${currency?.code ? tCurrency(currency?.code) : ''} (${currency.symbol})`,
        value: currency?.id?.toString() || ''
      }))
    }
  };

  const ribField: Field<TextFieldProps> = {
    id: 'bank-account-rib',
    label: tSettings('bank_account.attributes.rib'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. 1234 5678 9012 3456 7890',
    props: {
      value: bankAccountManager?.rib,
      onChange: (e: string) => bankAccountManager.set('rib', e)
    }
  };

  const ibanField: Field<TextFieldProps> = {
    id: 'bank-account-iban',
    label: tSettings('bank_account.attributes.iban'),
    required: true,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. TN59 1234 5678 9012 3456 7890',
    props: {
      value: bankAccountManager?.iban,
      onChange: (e: string) => bankAccountManager.set('iban', e)
    }
  };

  const isMainField: Field<SwitchFieldProps> = {
    id: 'bank-account-is-main',
    label: tSettings('bank_account.attributes.isMain'),
    variant: FieldVariant.SWITCH,
    hidden: mainByDefault,
    props: {
      checked: bankAccountManager?.isMain,
      onCheckedChange: (e: boolean) => bankAccountManager.set('isMain', e)
    }
  };

  const bankAccountFormStructure: FormStructure = {
    title: tSettings('bank_account.singular'),
    orientation: 'vertical',
    fieldsets: [
      {
        rows: [
          {
            fields: [nameField]
          },
          {
            fields: [bicField]
          },
          {
            fields: [currencyField]
          },
          {
            fields: [ribField]
          },
          {
            fields: [ibanField]
          },
          {
            fields: [isMainField]
          }
        ]
      }
    ]
  };

  return { bankAccountFormStructure };
};