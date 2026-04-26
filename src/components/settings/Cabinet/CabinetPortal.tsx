import React from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { Cabinet } from '@/types';
import { toast } from 'sonner';
import { Spinner } from '@/components/shared';
import { cn } from '@/lib/utils';
import { useCabinetStore } from '@/hooks/stores/useCabinetStore';
import useCabinet from '@/hooks/content/useCabinet';
import { useActivities } from '@/hooks/content/core/useActivities';
import { useCountries } from '@/hooks/content/core/useCountries';
import { useCurrencies } from '@/hooks/content/core/useCurrencies';
import { useTranslation } from 'react-i18next';
import useInitializedState from '@/hooks/use-initialized-state';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { GeneralInformation } from './forms/GeneralInformation';
import { UploadedInformation } from './forms/UploadedInformation';
import { AccountingInformation } from './forms/AccountingInformation';
import { cabinetSchema } from '@/types/validations/cabinet.validation';

interface CabinetPortalProps {
  className?: string;
}

export const CabinetPortal: React.FC<CabinetPortalProps> = ({ className }) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { setRoutes, clearRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.account') },
      { title: tCommon('settings.account.my_cabinet') }
    ]);
    return () => clearRoutes?.();
  }, [router.locale]);

  const { cabinet, isFetchCabinetPending, error, refetchCabinet } = useCabinet();
  const { activities, isFetchActivitiesPending } = useActivities();
  const { currencies, isCurrenciesPending } = useCurrencies();
  const { countries, isFetchCountriesPending } = useCountries();

  const cabinetStore = useCabinetStore();

  const { mutate: updateCabinet, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: Cabinet) => api.cabinet.update(data),
    onSuccess: () => {
      toast.success('Cabinet modifiée avec succès');
      refetchCabinet();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la modification du cabinet');
    }
  });

  const loading =
    isFetchCabinetPending ||
    isCurrenciesPending ||
    isFetchActivitiesPending ||
    isFetchCountriesPending ||
    isUpdatePending;

  const stableCabinet = React.useMemo(
    () => cabinet ?? ({} as Partial<Cabinet>),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cabinet?.id, cabinet?.updatedAt]
  );

  const { isDisabled, globalReset } = useInitializedState({
    data: stableCabinet,
    getCurrentData: () => cabinetStore.getCabinet(),
    setFormData: (data: Partial<Cabinet>) => cabinetStore.setCabinet(data),
    resetData: () => cabinetStore.reset(),
    loading
  });

  const handleSubmit = () => {
    const data = cabinetStore.getCabinet();
    
    // Zod Validation
    const result = cabinetSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    updateCabinet(data as Cabinet);
  };

  if (error) return <div className="p-4 text-destructive">Error: {error.message}</div>;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden p-1', className)}>
      <div className="flex-1 overflow-y-auto space-y-5 pb-20">
        <div className="flex flex-col 2xl:flex-row gap-5">
          <GeneralInformation
            className="w-full 2xl:w-3/4"
            countries={countries}
            isPending={loading}
          />
          <UploadedInformation className="w-full 2xl:w-1/4" />
        </div>
        <AccountingInformation
          isPending={loading}
          activities={activities}
          currencies={currencies}
        />
      </div>

      <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-background/80 backdrop-blur-sm border-t p-4 flex gap-4 justify-end z-10">
        <Button variant="secondary" onClick={globalReset} disabled={isDisabled || isUpdatePending}>
          {tCommon('commands.reset')}
        </Button>
        <Button onClick={handleSubmit} disabled={isDisabled || isUpdatePending}>
          <Spinner className="mr-2" size="small" show={isUpdatePending} />
          {tCommon('commands.save')}
        </Button>
      </div>
    </div>
  );
};

export default CabinetPortal;
