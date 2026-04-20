import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useCreateTaxFormStructure } from './useCreateTaxFormStructure';
import { useTaxStore } from '@/hooks/stores/useTaxStore';
import useCurrencies from '@/hooks/content/useCurrency';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { createTaxSchema } from '@/types/validations/tax.validation';

interface CreateTaxFormProps {
  className?: string;
  createTax: () => void;
  isCreatePending: boolean;
}

export const CreateTaxForm = ({
  className,
  createTax,
  isCreatePending
}: CreateTaxFormProps) => {
  const taxStore = useTaxStore();

  const { currencies, isCurrenciesPending } = useCurrencies();

  const { structure } = useCreateTaxFormStructure({
    store: taxStore,
    currencies: isCurrenciesPending
      ? []
      : currencies.map((currency) => ({
          label: `${currency.label} (${currency.symbol})`,
          value: currency.id.toString()
        }))
  });

  const handleSubmit = () => {
    const result = createTaxSchema.safeParse(taxStore.createDto);
    if (!result.success) {
      taxStore.set('createDtoErrors', result.error.flatten().fieldErrors);
    } else {
      createTax();
    }
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <FormBuilder className="flex flex-col flex-1 overflow-auto p-2" structure={structure} />
      <Separator className="mb-4 mt-2" />
      <div className="flex flex-row justify-end gap-2">
        <Button onClick={handleSubmit} disabled={isCreatePending}>
          Save
        </Button>
        <Button variant={'outline'} onClick={() => taxStore.reset()}>
          Reset
        </Button>
      </div>
    </div>
  );
};

