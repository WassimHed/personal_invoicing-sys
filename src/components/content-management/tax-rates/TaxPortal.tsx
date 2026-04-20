import React from 'react';
import { api } from '@/api';
import { Tax } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useTaxStore } from '@/hooks/stores/useTaxStore';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { getTaxColumns } from './columns';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { cn } from '@/lib/utils';
import { useTaxDeleteDialog } from './modals/TaxDeleteDialog';
import { useTaxCreateSheet } from './modals/TaxCreateSheet';
import { useTaxUpdateSheet } from './modals/TaxUpdateSheet';
import { TAX_FILTER_ATTRIBUTES } from '@/constants/tax.filter-attributes';

interface TaxMainProps {
  className?: string;
}

export const TaxPortal: React.FC<TaxMainProps> = ({ className }) => {
  //next-router
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { t: tCurrency } = useTranslation('currency');

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (setRoutes) {
      setRoutes?.([

        { title: tCommon('menu.settings') },
        { title: tCommon('submenu.system') },
        { title: tCommon('settings.system.tax') }
      ]);
    }
  }, [router.locale, setRoutes, tCommon]);

  const taxStore = useTaxStore();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'label' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    isPending: isFetchPending,
    data: taxesResp,
    refetch: refetchTaxes
  } = useQuery({
    queryKey: [
      'taxes',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.tax.findPaginated({
        page: debouncedPage,
        limit: debouncedSize,
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'ASC' : 'DESC'}`,
        filter: debouncedSearchTerm
          ? Object.values(TAX_FILTER_ATTRIBUTES)
              .map((key) => `${key}||$cont||${debouncedSearchTerm}`)
              .join('||$or||')
          : ''
      })
  });

  const taxes = React.useMemo(() => {
    return taxesResp?.data || [];
  }, [taxesResp]);

  //create tax
  const { mutate: createTax, isPending: isCreatePending } = useMutation({
    mutationFn: () => api.tax.create(taxStore.createDto),
    onSuccess: () => {
      toast.success(tSettings('tax.action_add_success'));
      refetchTaxes();
      taxStore.reset();
      closeCreateTaxSheet();
    },
    onError: (error) => {
      const message = getErrorMessage('settings', error, 'tax.action_add_failure');
      toast.error(message);
    }
  });

  //update tax
  const { mutate: updateTax, isPending: isUpdatePending } = useMutation({
    mutationFn: () => api.tax.update(taxStore.updateDto!),
    onSuccess: () => {
      toast.success(tSettings('tax.action_update_success'));
      refetchTaxes();
      taxStore.reset();
      closeUpdateTaxSheet();
    },
    onError: (error) => {
      const message = getErrorMessage('settings', error, 'tax.action_update_failure');
      toast.error(message);
    }
  });

  //remove tax
  const { mutate: removeTax, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.tax.remove(id),
    onSuccess: () => {
      if (taxes?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tSettings('tax.action_remove_success'));
      refetchTaxes();
    },
    onError: (error) => {
      toast.error(getErrorMessage('settings', error, 'tax.action_remove_failure'));
    }
  });

  const { createTaxSheet, openCreateTaxSheet, closeCreateTaxSheet } = useTaxCreateSheet({
    createTax,
    isCreatePending,
    resetTax: taxStore.reset
  });

  const { updateTaxSheet, openUpdateTaxSheet, closeUpdateTaxSheet } = useTaxUpdateSheet({
    updateTax,
    isUpdatePending,
    resetTax: taxStore.reset
  });

  const { deleteTaxDialog, openDeleteTaxDialog, closeDeleteTaxDialog } = useTaxDeleteDialog(
    taxStore.response?.label,
    () => removeTax(taxStore.response?.id || 0),
    isDeletePending
  );

  const context: DataTableConfig<Tax> = {
    singularName: tSettings('tax.singular'),
    pluralName: tSettings('tax.plural'),
    //dialogs
    createCallback: () => {
      openCreateTaxSheet();
    },
    updateCallback: () => {
      openUpdateTaxSheet();
    },
    deleteCallback: () => {
      openDeleteTaxDialog();
    },
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: taxesResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    targetEntity: (entity) => {
      taxStore.set('response', entity);
      taxStore.set('updateDto', {
        id: entity.id,
        label: entity.label,
        value: entity.value,
        isRate: entity.isRate,
        isSpecial: entity.isSpecial,
        currencyId: entity.currencyId
      });
    }
  };

  const columns = getTaxColumns(tSettings, tCommon, tCurrency, context);

  const isPending =
    isFetchPending ||
    isCreatePending ||
    isUpdatePending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={taxes}
        columns={columns}
        context={context}
        isPending={isPending}
      />
      {createTaxSheet}
      {updateTaxSheet}
      {deleteTaxDialog}
    </div>
  );
};