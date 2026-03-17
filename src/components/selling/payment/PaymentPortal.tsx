import { api } from '@/api';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/shared/data-table/data-table';
import { usePaymentColumns } from './columns';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { usePaymentManager } from './hooks/usePaymentManager';
import { PaymentDeleteDialog } from './dialogs/PaymentDeleteDialog';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { Payment } from '@/types';
import { useIntro } from '@/context/IntroContext';
import { cn } from '@/lib/utils';

interface PaymentMainProps {
  className?: string;
  firmId?: number;
  interlocutorId?: number;
}

export const PaymentPortal: React.FC<PaymentMainProps> = ({ className, firmId, interlocutorId }) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tCurrency } = useTranslation('currency');

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    if (!firmId && !interlocutorId) {
      setIntro?.(tInvoicing('payment.singular'), tInvoicing('payment.card_description'));
      setRoutes?.([
        { title: tCommon('menu.selling'), href: '/selling' },
        { title: tCommon('submenu.payments') }
      ]);
    }
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale, firmId, interlocutorId]);

  const paymentManager = usePaymentManager();

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

  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [downloadDialog, setDownloadDialog] = React.useState(false);

  const {
    isPending: isFetchPending,
    error,
    data: paymentsResp,
    refetch: refetchPayments
  } = useQuery({
    queryKey: [
      'payments',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.payment.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm,
        ['currency'],
        firmId,
        interlocutorId
      )
  });

  const payments = React.useMemo(() => {
    return paymentsResp?.data || [];
  }, [paymentsResp]);

  const context: DataTableConfig<Payment> = {
    singularName: tInvoicing('payment.singular'),
    pluralName: tInvoicing('payment.plural'),
    //dialogs
    createCallback: () => router.push('/selling/new-payment'),
    updateCallback: () => {},
    deleteCallback: () => setDeleteDialog(true),
    // openDownloadDialog: () => setDownloadDialog(true),
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: paymentsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  const columns = usePaymentColumns(context);

  //Remove Invoice
  const { mutate: removePayment, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.payment.remove(id),
    onSuccess: () => {
      if (payments?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tInvoicing('payment.action_remove_success'));
      refetchPayments();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('invoicing', error, tInvoicing('payment.action_remove_failure')));
    }
  });

  const isPending = isFetchPending || paging || resizing || searching || sorting;

  return (
    <>
      <PaymentDeleteDialog
        id={paymentManager?.id}
        open={deleteDialog}
        deletePayment={() => {
          paymentManager?.id && removePayment(paymentManager?.id);
        }}
        isDeletionPending={isDeletePending}
        onClose={() => setDeleteDialog(false)}
      />
      <DataTable
        context={context}
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={payments}
        columns={columns}
        isPending={isPending}
      />
    </>
  );
};