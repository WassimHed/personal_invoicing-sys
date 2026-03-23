import { WalletCards } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSheet } from '@/components/shared/Sheets';
import { UpdateTaxForm } from '../forms/UpdateTaxForm';

interface TaxUpdateSheet {
  updateTax: () => void;
  isUpdatePending?: boolean;
  resetTax?: () => void;
}

export const useTaxUpdateSheet = ({
  updateTax,
  isUpdatePending = false,
  resetTax
}: TaxUpdateSheet) => {
  const { t: tSettings } = useTranslation('settings');

  const {
    SheetFragment: updateTaxSheet,
    openSheet: openUpdateTaxSheet,
    closeSheet: closeUpdateTaxSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <WalletCards />
        {tSettings('tax.update_prompt')}
      </div>
    ),
    description: tSettings('tax.update_dialog_description'),
    children: <UpdateTaxForm updateTax={updateTax} isUpdatePending={isUpdatePending} />,
    className: 'min-w-[50vw] flex flex-col flex-1 overflow-hidden',
    onToggle: resetTax
  });

  return { updateTaxSheet, openUpdateTaxSheet, closeUpdateTaxSheet };
};
