import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { usePaymentManager } from '../hooks/usePaymentManager';
import { cn } from '@/lib/utils';
import React from 'react';
import { usePaymentInvoiceManager } from '../hooks/usePaymentInvoiceManager';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { usePaymentGeneralFormStructure } from './usePaymentGeneralFormStructure';
import { Currency, Firm } from '@/types';

interface PaymentGeneralInformationProps {
  className?: string;
  firms: Firm[];
  currencies: Currency[];
  loading?: boolean;
}

export const PaymentGeneralInformation = ({
  className,
  firms,
  currencies,
  loading
}: PaymentGeneralInformationProps) => {
  const paymentManager = usePaymentManager();
  const invoiceManager = usePaymentInvoiceManager();

  const { paymentGeneralFormStructure } = usePaymentGeneralFormStructure({
    paymentManager,
    invoiceManager,
    firms,
    currencies,
    loading
  });

  return (
    <div className={cn(className)}>
      <FormBuilder structure={paymentGeneralFormStructure} />
    </div>
  );
};