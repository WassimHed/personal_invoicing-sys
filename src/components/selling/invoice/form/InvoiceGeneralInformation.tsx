import { Firm } from '@/types';
import React from 'react';
import { AddressDetails } from '../../../invoicing/AddressDetails';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useInvoiceManager } from '../hooks/useInvoiceManager';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useInvoiceGeneralFormStructure } from './useInvoiceGeneralFormStructure';

interface InvoiceGeneralInformationProps {
  className?: string;
  firms: Firm[];
  isInvoicingAddressHidden?: boolean;
  isDeliveryAddressHidden?: boolean;
  edit?: boolean;
  loading?: boolean;
}

export const InvoiceGeneralInformation = ({
  className,
  firms,
  isInvoicingAddressHidden,
  isDeliveryAddressHidden,
  edit = true,
  loading
}: InvoiceGeneralInformationProps) => {
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const invoiceManager = useInvoiceManager();

  const { invoiceGeneralFormStructure } = useInvoiceGeneralFormStructure({
    invoiceManager,
    firms,
    isInvoicingAddressHidden,
    isDeliveryAddressHidden,
    loading,
    edit,
    onNewFirmClick: () => router.push('/contacts/new-firm'),
    tCommon
  });

  return (
    <div className={cn(className)}>
      <FormBuilder structure={invoiceGeneralFormStructure} />
    </div>
  );
};