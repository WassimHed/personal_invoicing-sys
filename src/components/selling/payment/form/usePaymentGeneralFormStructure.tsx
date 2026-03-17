import {
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  SelectFieldProps
} from '@/components/shared/form-builder/types';
import { useTranslation } from 'react-i18next';
import { Currency, Firm, INVOICE_STATUS, PAYMENT_MODE } from '@/types';

interface UsePaymentGeneralFormStructureProps {
  paymentManager: any;
  invoiceManager: any;
  firms: Firm[];
  currencies: Currency[];
  loading?: boolean;
}

export const usePaymentGeneralFormStructure = ({
  paymentManager,
  invoiceManager,
  firms,
  currencies,
  loading
}: UsePaymentGeneralFormStructureProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tCurrency } = useTranslation('currency');

  const dateField: Field<DateFieldProps> = {
    id: 'date',
    label: `${tInvoicing('invoice.attributes.date')} (*)`,
    variant: FieldVariant.DATE,
    placeholder: tCommon('pick_date'),
    props: {
      value: paymentManager?.date || null,
      onDateChange: (value) => paymentManager.set('date', value),
      disabled: loading
    }
  };

  const firmField: Field<SelectFieldProps> = {
    id: 'firm',
    label: `${tCommon('submenu.firms')} (*)`,
    variant: FieldVariant.SELECT,
    placeholder: tInvoicing('invoice.associate_firm'),
    props: {
      value: paymentManager.firmId?.toString(),
      onValueChange: (value) => {
        const firm = firms?.find((firm) => firm.id === parseInt(value));
        paymentManager.set('firmId', firm?.id);
        paymentManager.set('firm', firm);
        paymentManager.set('currencyId', firm?.currency?.id);
        paymentManager.set('currency', firm?.currency);
        invoiceManager.reset();
        firm?.invoices?.forEach((invoice) => {
          if (
            invoice?.status &&
            [INVOICE_STATUS.PartiallyPaid, INVOICE_STATUS.Sent, INVOICE_STATUS.Unpaid].includes(
              invoice?.status
            )
          )
            invoiceManager.add({
              amount: 0,
              invoiceId: invoice.id,
              invoice: invoice
            });
        });
      },
      options:
        firms?.map((firm) => ({
          label: firm.name || '',
          value: firm.id?.toString() || ''
        })) || [],
      disabled: loading
    }
  };

  const currencyField: Field<SelectFieldProps> = {
    id: 'currency',
    label: tInvoicing('payment.attributes.currency'),
    variant: FieldVariant.SELECT,
    placeholder: tInvoicing('controls.currency_select_placeholder'),
    props: {
      value: paymentManager?.currencyId ? paymentManager?.currencyId?.toString() : undefined,
      onValueChange: (value) => {
        const currency = currencies.find((currency) => currency.id == parseInt(value));
        paymentManager.set('currencyId', currency?.id);
        paymentManager.set('currency', currency);
        invoiceManager.init();
      },
      options:
        currencies?.map((currency: Currency) => ({
          label: `${currency?.code && tCurrency(currency?.code)} (${currency.symbol})`,
          value: currency?.id?.toString() || ''
        })) || [],
      disabled: currencies.length <= 1 || loading
    }
  };

  const convertionRateField: Field<NumberFieldProps> = {
    id: 'convertionRate',
    label: tInvoicing('payment.attributes.convertion_rate'),
    variant: FieldVariant.NUMBER,
    placeholder: '1',
    props: {
      value: paymentManager.convertionRate,
      onChange: (value) => paymentManager.set('convertionRate', value),
      disabled: loading
    }
  };

  const modeField: Field<SelectFieldProps> = {
    id: 'mode',
    label: `${tInvoicing('payment.attributes.mode')} (*)`,
    variant: FieldVariant.SELECT,
    placeholder: tInvoicing('payment.attributes.mode'),
    props: {
      value: paymentManager?.mode || '',
      onValueChange: (value) => paymentManager.set('mode', value),
      options: Object.values(PAYMENT_MODE).map((title) => ({
        label: tInvoicing(title),
        value: title
      })),
      disabled: loading
    }
  };

  const amountField: Field<NumberFieldProps> = {
    id: 'amount',
    label: tInvoicing('payment.attributes.amount'),
    variant: FieldVariant.NUMBER,
    placeholder: '0',
    props: {
      value: paymentManager.amount,
      onChange: (value) => paymentManager.set('amount', value),
      disabled: loading
    }
  };

  const feeField: Field<NumberFieldProps> = {
    id: 'fee',
    label: tInvoicing('payment.attributes.fee'),
    variant: FieldVariant.NUMBER,
    placeholder: '0',
    props: {
      value: paymentManager.fee,
      onChange: (value) => paymentManager.set('fee', value),
      disabled: loading
    }
  };

  const paymentGeneralFormStructure: FormStructure = {
    orientation: 'vertical',
    fieldsets: [
      {
        rows: [
          {
            fields: [dateField, firmField]
          },
          {
            fields: [currencyField, convertionRateField, modeField]
          },
          {
            fields: [amountField, feeField]
          }
        ]
      }
    ]
  };

  return { paymentGeneralFormStructure };
};