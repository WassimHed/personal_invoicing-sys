import { api } from '@/api';
import ContentSection from '@/components/shared/ContentSection';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { getUserColumns } from './data-table/columns';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useUserManager } from './hooks/useUserManager';
import { useUserCreateSheet } from './modals/UserCreateSheet';
import { useUserUpdateSheet } from './modals/UserUpdateSheet';
import { useActivateUserDialog } from './modals/UserActivateDialog';
import { useDeactivateUserDialog } from './modals/UserDeactivateDialog';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { CreateAbstractUserDto, UpdateAbstractUserDto, ResponseUserDto as User } from '@/types';
import { updateUserSchema } from '@/types/validations/user.validation';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { UserActionsContext } from './data-table/action-context';
import { CheckCircle, XCircle } from 'lucide-react';

interface UserMainProps {
  className?: string;
}

export default function UserMain({ className }: UserMainProps) {
  //next-router
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.administrative_tools') },
      { title: tCommon('submenu.user_management') },
      { title: tCommon('settings.user_management.users') }
    ]);
  }, [router.locale]);

  const userManager = useUserManager();

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
    data: usersResponse,
    isFetching: isUsersPending,
    refetch: refetchUsers
  } = useQuery({
    queryKey: [
      'users',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.user.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm
      )
  });

  const users = React.useMemo(() => {
    if (!usersResponse) return [];
    return usersResponse.data;
  }, [usersResponse]);

  const { mutate: createUser, isPending: isCreationPending } = useMutation({
    mutationFn: (user: CreateAbstractUserDto) => api.user.create(user),
    onSuccess: () => {
      toast('User Created Successfully');
      refetchUsers();
      userManager.reset();
      closeCreateUserSheet();
    },
    onError: (error) => {
      toast(error.message);
    }
  });

  const { mutate: updateUser, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: string; user: UpdateAbstractUserDto }) => api.user.update(data.id, data.user),
    onSuccess: () => {
      toast('User Updated Successfully');
      refetchUsers();
      userManager.reset();
      closeUpdateUserSheet();
    },
    onError: (error) => {
      toast(error.message);
    }
  });

  const { mutate: activateUser, isPending: isActivationPending } = useMutation({
    mutationFn: (id?: string) => api.user.activate(id),
    onSuccess: () => {
      refetchUsers();
      toast('User Activated Successfully');
    },
    onError: (error) => toast(error.message)
  });

  const { mutate: deactivateUser, isPending: isDeactivationPending } = useMutation({
    mutationFn: (id?: string) => api.user.deactivate(id),
    onSuccess: () => {
      refetchUsers();
      toast('User Deactivated Successfully');
    },
    onError: (error) => toast(error.message)
  });

  const handleValidation = (result: any) => {
    const errorMessage = Object.values(result.error.flatten().fieldErrors)
      .flat()
      .map((error) => `<li> . ${error}</li>`)
      .join('');
    toast('⛔ Validation Errors', {
      description: <ul dangerouslySetInnerHTML={{ __html: errorMessage }} />,
      position: 'top-center'
    });
  };

  const handleCreateSubmit = () => {
    const data = userManager.getUser();
    const result = updateUserSchema.safeParse({
      ...data,
      dateOfBirth: userManager.dateOfBirth && new Date(userManager.dateOfBirth),
      confirmPassword: userManager.confirmPassword
    });
    if (!result.success) {
      handleValidation(result);
    } else {
      createUser({
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      } as CreateAbstractUserDto);
    }
  };

  const handleUpdateSubmit = () => {
    const { id, ...user } = userManager.getUser();
    const result = updateUserSchema.safeParse({
      ...user,
      dateOfBirth: userManager.dateOfBirth && new Date(userManager.dateOfBirth),
      confirmPassword: userManager.confirmPassword
    });
    if (!result.success) {
      handleValidation(result);
    } else {
      updateUser({
        id,
        user: {
          ...user,
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
        } as UpdateAbstractUserDto
      });
    }
  };

  const { createUserSheet, openCreateUserSheet, closeCreateUserSheet } = useUserCreateSheet({
    createUser: handleCreateSubmit,
    isCreatePending: isCreationPending,
    resetUser: () => userManager.reset()
  });

  const { updateUserSheet, openUpdateUserSheet, closeUpdateUserSheet } = useUserUpdateSheet({
    updateUser: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetUser: () => userManager.reset()
  });

  const { activateUserDialog, openActivateUserDialog } = useActivateUserDialog({
    userFullname: `${userManager.firstName} - ${userManager.lastName}`,
    activateUser: () => activateUser(userManager.id),
    isActivationPending,
    resetUser: () => userManager.reset()
  });

  const { deactivateUserDialog, openDeactivateUserDialog } = useDeactivateUserDialog({
    userFullname: `${userManager.firstName} - ${userManager.lastName}`,
    deactivateUser: () => deactivateUser(userManager.id),
    isDeactivationPending,
    resetUser: () => userManager.reset()
  });

  const context: DataTableConfig<User> = {
    singularName: tSettings('users.singular'),
    pluralName: tSettings('users.plural'),
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: usersResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    //actions
    createCallback: openCreateUserSheet,
    updateCallback: (user: User) => {
      userManager.setUser(user);
      openUpdateUserSheet();
    },
    targetEntity: (user: User) => userManager.setUser(user),
    additionalActions: {
      0: [
        {
          actionLabel: tCommon('commands.activate'),
          actionIcon: <CheckCircle className="size-4" />,
          actionCallback: (user: User) => {
            userManager.setUser(user);
            openActivateUserDialog();
          },
          isActionVisible: (user: User) => !user.isActive
        },
        {
          actionLabel: tCommon('commands.deactivate'),
          actionIcon: <XCircle className="size-4" />,
          actionCallback: (user: User) => {
            userManager.setUser(user);
            openDeactivateUserDialog();
          },
          isActionVisible: (user: User) => !!user.isActive
        }
      ]
    }
  };

  const isPending = isUsersPending || paging || resizing || searching || sorting;

  return (
    <ContentSection
      title={tSettings('users.singular')}
      desc={tSettings('users.description')}
      className="w-full">
      <UserActionsContext.Provider value={context as any}>
        {createUserSheet}
        {updateUserSheet}
        {activateUserDialog}
        {deactivateUserDialog}
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getUserColumns(tSettings, tCommon, context)}
          data={users}
          context={context}
          isPending={isPending}
        />
      </UserActionsContext.Provider>
    </ContentSection>
  );
}