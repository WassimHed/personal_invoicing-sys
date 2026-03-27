import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ResponseUserDto as User } from '@/types';
import { transformDate } from '@/utils/date.utils';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { useTranslation } from 'react-i18next';
import { DataTableConfig } from '@/components/shared/data-table/types';

export const useUserColumns = (
  context: DataTableConfig<User>
): ColumnDef<User>[] => {
  const { t } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');

  return [
    {
      accessorKey: 'id',
      cell: ({ row }) => <div>{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.attributes.username')}
          attribute="username"
          context={context}
        />
      ),
      cell: ({ row }) => <div className="font-bold">{row.original.username}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.attributes.email')}
          attribute="email"
          context={context}
        />
      ),
      cell: ({ row }) => <div className="font-bold">{row.original.email}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'first_name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.attributes.first_name')}
          attribute="firstName"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.firstName || (
            <span className="opacity-70">{t('users.attributes.no_first_name')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'last_name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.attributes.last_name')}
          attribute="lastName"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.lastName || (
            <span className="opacity-70">{t('users.attributes.no_last_name')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'date_of_birth',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.attributes.date_of_birth')}
          attribute="dateOfBirth"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.dateOfBirth ? (
            transformDate(row.original.dateOfBirth)
          ) : (
            <span className="opacity-70">{t('users.attributes.no_date_of_birth')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.attributes.role')}
          attribute="role.label"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.role?.label || (
            <span className="opacity-70">{t('users.attributes.no_role')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'active',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.attributes.active')}
          attribute="isActive"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <Badge
          className={cn(
            'font-bold text-white',
            row.original.isActive ? 'bg-green-600' : 'bg-red-600'
          )}>
          {row.original.isActive ? tCommon('answer.yes') : tCommon('answer.no')}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DataTableRowActions row={row} context={context} />
        </div>
      )
    }
  ];
};
