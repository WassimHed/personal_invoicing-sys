import React from 'react';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { usePaymentConditionFormStructure } from './usePaymentConditionFormStructure';

interface PaymentConditionFormProps {
  className?: string;
}

export const PaymentConditionForm: React.FC<PaymentConditionFormProps> = ({ className }) => {
  const { paymentConditionFormStructure } = usePaymentConditionFormStructure();

  return (
    <div className={className}>
      <FormBuilder structure={paymentConditionFormStructure} />
    </div>
  );
};