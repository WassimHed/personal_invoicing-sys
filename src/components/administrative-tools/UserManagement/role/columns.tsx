import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Role } from '@/types';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { TFunction } from 'i18next';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';

export const useRoleColumns = (
  tSettings: TFunction,
  tPermission: TFunction,
  context: DataTableConfig<Role>
): ColumnDef<Role>[] => {
  return [
    {
      accessorKey: 'label',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tSettings('roles.attributes.label')}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => <div className="font-bold whitespace-nowrap">{row.original.label}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tSettings('roles.attributes.description')}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => <div className="max-w-[300px] truncate italic text-muted-foreground">{row.original.description || '-'}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'permissions',
      header: tSettings('roles.attributes.permissions'),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="font-normal">
            {row.original.permissions?.length || 0} {tPermission('permission.label')}
          </Badge>
        </div>
      )
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
