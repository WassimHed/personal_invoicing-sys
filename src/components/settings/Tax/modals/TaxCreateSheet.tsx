import { WalletCards } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSheet } from '@/components/shared/Sheets';
import { CreateTaxForm } from '../forms/CreateTaxForm';

interface TaxCreateSheet {
  createTax: () => void;
  isCreatePending?: boolean;
  resetTax?: () => void;
}

export const useTaxCreateSheet = ({
  createTax,
  isCreatePending = false,
  resetTax
}: TaxCreateSheet) => {
  const { t: tSettings } = useTranslation('settings');

  const {
    SheetFragment: createTaxSheet,
    openSheet: openCreateTaxSheet,
    closeSheet: closeCreateTaxSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <WalletCards />
        {tSettings('tax.create_prompt')}
      </div>
    ),
    description: tSettings('tax.create_dialog_description'),
    children: <CreateTaxForm createTax={createTax} isCreatePending={isCreatePending} />,
    className: 'min-w-[50vw] flex flex-col flex-1 overflow-hidden',
    onToggle: resetTax
  });

  return { createTaxSheet, openCreateTaxSheet, closeCreateTaxSheet };
};
