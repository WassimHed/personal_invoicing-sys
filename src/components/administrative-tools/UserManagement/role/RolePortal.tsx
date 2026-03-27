import { api } from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { useRoleColumns } from './columns';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useRoleStore } from '@/hooks/stores/useRoleStore';
import { useRoleCreateSheet } from './modals/RoleCreateSheet';
import { useRoleUpdateSheet } from './modals/RoleUpdateSheet';
import { useRoleDeleteDialog } from './modals/RoleDeleteDialog';
import { useRoleDuplicateDialog } from './modals/RoleDuplicateDialog';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { CreateRoleDto, UpdateRoleDto, Role } from '@/types';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { CopyIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentSection from '@/components/shared/ContentSection';

export const RolePortal = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { t: tPermission } = useTranslation('permissions');

  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.administrative_tools') },
      { title: tCommon('submenu.user_management') },
      { title: tCommon('settings.user_management.roles') }
    ]);
  }, [router.locale]);

  const roleManager = useRoleStore();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({
    order: true,
    sortKey: 'id'
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    data: rolesResponse,
    isFetching: isRolesPending,
    refetch: refetchRoles
  } = useQuery({
    queryKey: [
      'roles',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.role.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm
      )
  });

  const roles = React.useMemo(() => {
    if (!rolesResponse) return [];
    return rolesResponse.data;
  }, [rolesResponse]);

  const { mutate: createRole, isPending: isCreationPending } = useMutation({
    mutationFn: (role: CreateRoleDto) => api.role.create(role),
    onSuccess: () => {
      toast.success('Role Created Successfully');
      refetchRoles();
      roleManager.reset();
      closeCreateRoleSheet();
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const { mutate: updateRole, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: string; role?: UpdateRoleDto }) =>
      api.role.update(data.id, data.role),
    onSuccess: () => {
      toast.success('Role Updated Successfully');
      refetchRoles();
      roleManager.reset();
      closeUpdateRoleSheet();
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const { mutate: deleteRole, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: string) => api.role.remove(id),
    onSuccess: () => {
      toast.success('Role Deleted Successfully');
      refetchRoles();
      roleManager.reset();
      closeDeleteRoleDialog();
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const { mutate: duplicateRole, isPending: isDuplicationPending } = useMutation({
    mutationFn: (id?: string) => api.role.duplicate(id),
    onSuccess: () => {
      toast.success('Role Duplicated Successfully');
      refetchRoles();
      roleManager.reset();
      closeDuplicateRoleDialog();
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleCreateSubmit = () => {
    const { permissions, ...data } = roleManager.getRole();
    createRole({
      label: data.label,
      description: data.description,
      permissions: permissions?.map((p) => ({
        permissionId: p.permissionId!
      }))
    });
  };

  const handleUpdateSubmit = () => {
    const { permissions, ...data } = roleManager.getRole();
    updateRole({
      id: data.id!,
      role: {
        label: data.label,
        description: data.description,
        permissions: permissions?.map((p) => ({
          id: p.id!,
          permissionId: p.permissionId!
        }))
      }
    });
  };

  const { createRoleSheet, openCreateRoleSheet, closeCreateRoleSheet } = useRoleCreateSheet({
    createRole: handleCreateSubmit,
    isCreatePending: isCreationPending,
    resetRole: () => roleManager.reset()
  });

  const { updateRoleSheet, openUpdateRoleSheet, closeUpdateRoleSheet } = useRoleUpdateSheet({
    updateRole: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetRole: () => roleManager.reset()
  });

  const { deleteRoleDialog, openDeleteRoleDialog, closeDeleteRoleDialog } = useRoleDeleteDialog({
    roleLabel: roleManager.label,
    deleteRole: () => deleteRole(roleManager?.id),
    isDeletionPending,
    resetRole: () => roleManager.reset()
  });

  const { duplicateRoleDialog, openDuplicateRoleDialog, closeDuplicateRoleDialog } =
    useRoleDuplicateDialog({
      roleLabel: roleManager.label,
      duplicateRole: () => duplicateRole(roleManager?.id),
      isDuplicationPending,
      resetRole: () => roleManager.reset()
    });

  const context: DataTableConfig<Role> = {
    singularName: tSettings('roles.singular'),
    pluralName: tSettings('roles.plural'),
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: rolesResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    createCallback: openCreateRoleSheet,
    updateCallback: (role: Role) => {
      roleManager.setRole(role);
      openUpdateRoleSheet();
    },
    deleteCallback: (role: Role) => {
      roleManager.setRole(role);
      openDeleteRoleDialog();
    },
    targetEntity: (role: Role) => {
      roleManager.setRole(role);
    },
    additionalActions: {
      0: [
        {
          actionLabel: tCommon('commands.duplicate'),
          actionIcon: <CopyIcon className="size-4" />,
          actionCallback: (role: Role) => {
            roleManager.setRole(role);
            openDuplicateRoleDialog();
          }
        }
      ]
    }
  };

  const isPending = isRolesPending || paging || resizing || searching || sorting;

  return (
    <ContentSection
      title={tSettings('roles.singular')}
      desc={tSettings('roles.description')}
      className="w-full"
      childrenClassName={cn('overflow-hidden', className)}>
      <>
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={useRoleColumns(tSettings, tPermission, context)}
          data={roles}
          context={context}
          isPending={isPending}
        />
        {createRoleSheet}
        {updateRoleSheet}
        {deleteRoleDialog}
        {duplicateRoleDialog}
      </>
    </ContentSection>
  );
};
