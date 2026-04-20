import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useTaxStore } from '@/hooks/stores/useTaxStore';
import useCurrencies from '@/hooks/content/useCurrency';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { updateTaxSchema } from '@/types/validations/tax.validation';
import { useUpdateTaxFormStructure } from './useUpdateTaxFormStructure';

interface UpdateTaxFormProps {
  className?: string;
  updateTax: () => void;
  isUpdatePending: boolean;
}

export const UpdateTaxForm = ({
  className,
  updateTax,
  isUpdatePending
}: UpdateTaxFormProps) => {
  const taxStore = useTaxStore();

  const { currencies, isCurrenciesPending } = useCurrencies();

  const { structure } = useUpdateTaxFormStructure({
    store: taxStore,
    currencies: isCurrenciesPending
      ? []
      : currencies.map((currency) => ({
          label: `${currency.label} (${currency.symbol})`,
          value: currency.id.toString()
        }))
  });

  const handleSubmit = () => {
    const result = updateTaxSchema.safeParse(taxStore.updateDto);
    if (!result.success) {
      taxStore.set('updateDtoErrors', result.error.flatten().fieldErrors);
    } else {
      updateTax();
    }
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <FormBuilder className="flex flex-col flex-1 overflow-auto p-2" structure={structure} />
      <Separator className="mb-4 mt-2" />
      <div className="flex flex-row justify-end gap-2">
        <Button onClick={handleSubmit} disabled={isUpdatePending}>
          Save
        </Button>
        <Button variant={'outline'} onClick={() => taxStore.reset()}>
          Reset
        </Button>
      </div>
    </div>
  );
};

