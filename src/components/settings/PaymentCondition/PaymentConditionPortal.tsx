import React from 'react';
import { PaymentCondition } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { PaymentConditionCreateDialog } from './dialogs/PaymentConditionCreateDialog';
import { PaymentConditionUpdateDialog } from './dialogs/PaymentConditionUpdateDialog';
import { PaymentConditionDeleteDialog } from './dialogs/PaymentConditionDeleteDialog';
import { usePaymentConditionManager } from './hooks/usePaymentConditionManager';
import { api } from '@/api';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { usePayementConditionColumns } from './columns';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import ContentSection from '@/components/shared/ContentSection';
import { cn } from '@/lib/utils';
interface PaymentConditionMainProps {
  className?: string;
}
export const PaymentConditionPortal: React.FC<PaymentConditionMainProps> = ({ className }) => {
  //next-router
  const router = useRouter();
  const { t: tSettings } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (setRoutes) {
      setRoutes?.([

        { title: tCommon('menu.settings') },
        { title: tCommon('submenu.system') },
        { title: tCommon('settings.system.payment_condition') }
      ]);
    }
  }, [router.locale]);

  const paymentConditionManager = usePaymentConditionManager();

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
    data: paymentConditionsResp,
    refetch: refetchPaymentConditions
  } = useQuery({
    queryKey: [
      'payment-conditions',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.paymentCondition.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm
      )
  });

  const paymentConditions = React.useMemo(() => {
    return paymentConditionsResp?.data || [];
  }, [paymentConditionsResp]);

  const context: DataTableConfig<PaymentCondition> = {
    singularName: tSettings('payment_condition.singular'),
    pluralName: tSettings('payment_condition.plural'),
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: paymentConditionsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    //actions
    createCallback: () => setCreateDialog(true),
    updateCallback: (paymentCondition: PaymentCondition) => {
      paymentConditionManager.setPaymentCondition(paymentCondition);
      setUpdateDialog(true);
    },
    deleteCallback: (paymentCondition: PaymentCondition) => {
      paymentConditionManager.setPaymentCondition(paymentCondition);
      setDeleteDialog(true);
    }
  };

  const columns = usePayementConditionColumns(context);

  //create payment condition
  const { mutate: createPaymentCondition, isPending: isCreatePending } = useMutation({
    mutationFn: (data: PaymentCondition) => api.paymentCondition.create(data),
    onSuccess: () => {
      toast.success('Condition de Paiement ajoutée avec succès');
      refetchPaymentConditions();
      setCreateDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('', error, 'Erreur lors de la création de la méthode de Paiement')
      );
    }
  });

  //update payment condition
  const { mutate: updatePaymentCondition, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: PaymentCondition) => api.paymentCondition.update(data),
    onSuccess: () => {
      toast.success('Condition de Paiement modifiée avec succès');
      refetchPaymentConditions();
      setUpdateDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('', error, 'Erreur lors de la modification de la méthode de Paiement')
      );
    }
  });

  //remove payment condition
  const { mutate: removePaymentCondition, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.paymentCondition.remove(id),
    onSuccess: () => {
      if (paymentConditions?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Condition de Paiement supprimée avec succès');
      refetchPaymentConditions();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, "Erreur lors de la suppression de l'activité"));
    }
  });

  const handlePaymentConditionSubmit = (
    paymentCondition: PaymentCondition,
    callback: (paymentCondition: PaymentCondition) => void
  ): boolean => {
    const validation = api.paymentCondition.validate(paymentCondition);
    if (validation.message) {
      toast.error(validation.message);
      return false;
    } else {
      callback(paymentCondition);
      paymentConditionManager.reset();
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
    <>
      <PaymentConditionCreateDialog
        open={createDialog}
        isCreatePending={isCreatePending}
        createPaymentCondition={() => {
          handlePaymentConditionSubmit(
            paymentConditionManager.getPaymentCondition(),
            createPaymentCondition
          );
        }}
        onClose={() => {
          setCreateDialog(false);
          paymentConditionManager.reset();
        }}
      />
      <PaymentConditionUpdateDialog
        open={updateDialog}
        updatePaymentCondition={() => {
          handlePaymentConditionSubmit(
            paymentConditionManager.getPaymentCondition(),
            updatePaymentCondition
          );
        }}
        isUpdatePending={isUpdatePending}
        onClose={() => {
          setUpdateDialog(false);
          paymentConditionManager.reset();
        }}
      />
      <PaymentConditionDeleteDialog
        open={deleteDialog}
        deletePaymentCondition={() => {
          paymentConditionManager?.id && removePaymentCondition(paymentConditionManager?.id);
        }}
        isDeletionPending={isDeletePending}
        label={paymentConditionManager?.label}
        onClose={() => {
          setDeleteDialog(false);
        }}
      />
      <ContentSection
        title={tSettings('payment_condition.singular')}
        desc={tSettings('payment_condition.card_description')}
        className="w-full"
        childrenClassName={cn('overflow-hidden', className)}>
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          data={paymentConditions}
          columns={columns}
          context={context}
          isPending={isPending}
        />
      </ContentSection>
    </>
  );
};