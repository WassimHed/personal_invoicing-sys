import React from 'react';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useBankAccountFormStructure } from './useBankAccountFormStructure';

interface BankAccountFormFieldsProps {
  className?: string;
  mainByDefault?: boolean;
}

export const BankAccountFormFields: React.FC<BankAccountFormFieldsProps> = ({
  className,
  mainByDefault
}) => {
  const { bankAccountFormStructure } = useBankAccountFormStructure(mainByDefault);

  return (
    <div className={className}>
      <FormBuilder structure={bankAccountFormStructure} />
    </div>
  );
};

