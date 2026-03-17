import { Payment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { transformDate, transformDateTime } from '@/utils/date.utils';
import { PAYMENT_FILTER_ATTRIBUTES } from '@/constants/payment-filter.attributes';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';

export const usePaymentColumns = (
  context: DataTableConfig<Payment>
): ColumnDef<Payment>[] => {
  const { t } = useTranslation('invoicing');
  const { t: tCurrency } = useTranslation('currency');

  return [
    {
      accessorKey: 'number',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.attributes.number')}
          attribute={PAYMENT_FILTER_ATTRIBUTES.ID}
        />
      ),
      cell: ({ row }) => <div>PAY-{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.attributes.date')}
          attribute={PAYMENT_FILTER_ATTRIBUTES.DATE}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.date ? transformDate(row.original.date) : <span>Sans date</span>}</div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'mode',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.attributes.mode')}
          attribute={PAYMENT_FILTER_ATTRIBUTES.MODE}
        />
      ),
      cell: ({ row }) => (
        <div>
          <Badge className="px-4 py-1">{t(row.original?.mode || '')}</Badge>
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.attributes.amount')}
          attribute={PAYMENT_FILTER_ATTRIBUTES.AMOUNT}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.amount?.toFixed(row.original?.currency?.digitAfterComma)}{' '}
          {row.original?.currency?.symbol}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'fee',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.attributes.fee')}
          attribute={PAYMENT_FILTER_ATTRIBUTES.FEE}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.fee?.toFixed(row.original?.currency?.digitAfterComma)}{' '}
          {row.original?.currency?.symbol}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'currency',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('payment.attributes.currency')}
          attribute={PAYMENT_FILTER_ATTRIBUTES.CURRENCY}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.currency ? (
            <span>
              {row.original?.currency?.code && tCurrency(row.original?.currency?.code)} (
              {row.original?.currency?.symbol})
            </span>
          ) : (
            <span className="text-zinc-400">{t('payment.empty_cells.currency')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('invoice.attributes.created_at')}
          attribute={PAYMENT_FILTER_ATTRIBUTES.CREATEDAT}
        />
      ),
      cell: ({ row }) => <div>{transformDateTime(row.original?.createdAt || '')}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions row={row} context={context} />
        </div>
      )
    }
  ];
};