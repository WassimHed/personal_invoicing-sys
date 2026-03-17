import React from 'react';
import { api } from '@/api';
import { Tax } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useTaxWithholdingManager } from './hooks/useTaxWithholdingManager';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { TaxWithholdingCreateDialog } from './dialogs/TaxWithholdingCreateDialog';
import { TaxWithholdingUpdateDialog } from './dialogs/TaxWithholdingUpdateDialog';
import { TaxWithholdingDeleteDialog } from './dialogs/TaxWithholdingDeleteDialog';
import { TaxWithholdingActionsContext } from './data-table/ActionDialogContext';
import { getTaxWithholdingColumns } from './data-table/columns';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import ContentSection from '@/components/shared/ContentSection';
import { cn } from '@/lib/utils';

interface TaxWithholdingMainProps {
  className?: string;
}

const TaxWithholdingMain: React.FC<TaxWithholdingMainProps> = ({ className }) => {
  //next-router
  const router = useRouter();
  const { t: tSettings } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.system') },
      { title: tCommon('settings.system.tax_withholding') }
    ]);
  }, [router.locale]);

  const taxWithholdingManager = useTaxWithholdingManager();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'id' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const [createDialog, setCreateDialog] = React.useState(false);
  const [updateDialog, setUpdateDialog] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const {
    isPending: isFetchPending,
    error,
    data: taxWithholdingsResp,
    refetch: refetchTaxWithholdings
  } = useQuery({
    queryKey: [
      'tax-withholdings',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.taxWithholding.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm
      )
  });

  const taxWithholdings = React.useMemo(() => {
    return taxWithholdingsResp?.data || [];
  }, [taxWithholdingsResp]);

  const context: DataTableConfig<Tax> = {
    singularName: tSettings('withholding.singular'),
    pluralName: tSettings('withholding.plural'),
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: taxWithholdingsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    //actions
    createCallback: () => setCreateDialog(true),
    updateCallback: (tax: Tax) => {
      taxWithholdingManager.setTaxWithholding(tax);
      setUpdateDialog(true);
    },
    deleteCallback: (tax: Tax) => {
      taxWithholdingManager.setTaxWithholding(tax);
      setDeleteDialog(true);
    }
  };

  //create tax withholding
  const { mutate: createTaxWithholding, isPending: isCreatePending } = useMutation({
    mutationFn: (data: Tax) => api.taxWithholding.create(data),
    onSuccess: () => {
      toast.success('Retenue à la source ajoutée avec succès');
      refetchTaxWithholdings();
      setCreateDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('', error, 'Erreur lors de la création de la retenue à la source')
      );
    }
  });

  //update tax withholding
  const { mutate: updateTaxWithholding, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: Tax) => api.taxWithholding.update(data),
    onSuccess: () => {
      toast.success('Retenue à la source modifiée avec succès');
      refetchTaxWithholdings();
      setUpdateDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('', error, 'Erreur lors de la modification de la retenue à la source')
      );
    }
  });

  //remove tax withholding
  const { mutate: removeTaxWithholding, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.taxWithholding.remove(id),
    onSuccess: () => {
      if (taxWithholdings?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Retenue à la source supprimée avec succès');
      refetchTaxWithholdings();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('', error, 'Erreur lors de la suppression de la retenue à la source')
      );
    }
  });

  const handleTaxWithholdingSubmit = (
    taxWithholding: Tax,
    callback: (taxWithholding: Tax) => void
  ): boolean => {
    const validation = api.taxWithholding.validate(taxWithholding);
    if (validation.message) {
      toast.error(validation.message);
      return false;
    } else {
      callback(taxWithholding);
      taxWithholdingManager.reset();
      return true;
    }
  };

  const isPending =
    isFetchPending ||
    isCreatePending ||
    isUpdatePending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting;

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <TaxWithholdingActionsContext.Provider value={context as any}>
      <TaxWithholdingCreateDialog
        open={createDialog}
        isCreatePending={isCreatePending}
        createTaxWithholding={() => {
          handleTaxWithholdingSubmit(
            taxWithholdingManager.getTaxWithholding(),
            createTaxWithholding
          );
        }}
        onClose={() => {
          setCreateDialog(false);
          taxWithholdingManager.reset();
        }}
      />
      <TaxWithholdingUpdateDialog
        open={updateDialog}
        updateTaxWithholding={() => {
          handleTaxWithholdingSubmit(
            taxWithholdingManager.getTaxWithholding(),
            updateTaxWithholding
          );
        }}
        isUpdatePending={isUpdatePending}
        onClose={() => {
          setUpdateDialog(false);
          taxWithholdingManager.reset();
        }}
      />
      <TaxWithholdingDeleteDialog
        open={deleteDialog}
        deleteTaxWithholding={() => {
          taxWithholdingManager?.id && removeTaxWithholding(taxWithholdingManager?.id);
        }}
        isDeletionPending={isDeletePending}
        label={taxWithholdingManager?.label}
        onClose={() => {
          setDeleteDialog(false);
        }}
      />
      <ContentSection
        title={tSettings('withholding.singular')}
        desc={tSettings('withholding.card_description')}
        className="w-full"
        childrenClassName={cn('overflow-hidden', className)}>
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          data={taxWithholdings}
          columns={getTaxWithholdingColumns(tSettings)}
          context={context}
          isPending={isPending}
        />
      </ContentSection>
    </TaxWithholdingActionsContext.Provider>
  );
};

export default TaxWithholdingMain;