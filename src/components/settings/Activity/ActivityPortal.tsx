import React from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { Activity } from '@/types';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useActivityColumns } from './columns';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { useRouter } from 'next/router';
import ContentSection from '@/components/shared/ContentSection';
import { cn } from '@/lib/utils';
import { useActivityStore } from '@/hooks/stores/useActivityStore';
import { activitySchema } from '@/types/validations/activity.validation';
import { useActivityCreateSheet } from './modals/ActivityCreateSheet';
import { useActivityUpdateSheet } from './modals/ActivityUpdateSheet';
import { useActivityDeleteDialog } from './modals/ActivityDeleteDialog';

interface ActivityPortalProps {
  className?: string;
}

export const ActivityPortal: React.FC<ActivityPortalProps> = ({ className }) => {
  const router = useRouter();
  const { t: tSettings } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');

  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setIntro?.(
      'Activities',
      'Manage your business activities to categorize your operations.'
    );
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.system') },
      { title: tCommon('settings.system.activity') }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const activityStore = useActivityStore();

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

  const {
    isPending: isFetchPending,
    error,
    data: activitiesResp,
    refetch: refetchActivities
  } = useQuery({
    queryKey: [
      'activities',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.activity.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        'label',
        debouncedSearchTerm
      )
  });

  const activities = React.useMemo(() => {
    return activitiesResp?.data || [];
  }, [activitiesResp]);

  const { mutate: createActivity, isPending: isCreatePending } = useMutation({
    mutationFn: (data: Activity) => api.activity.create(data),
    onSuccess: () => {
      toast.success(tSettings('activity.action_add_success'));
      refetchActivities();
      activityStore.reset();
      closeCreateActivitySheet();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, tSettings('activity.action_add_failure')));
    }
  });

  const { mutate: updateActivity, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: Activity) => api.activity.update(data),
    onSuccess: () => {
      toast.success(tSettings('activity.action_edit_success'));
      refetchActivities();
      activityStore.reset();
      closeUpdateActivitySheet();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, tSettings('activity.action_edit_failure')));
    }
  });

  const { mutate: removeActivity, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.activity.remove(id),
    onSuccess: () => {
      if (activities?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tSettings('activity.action_remove_success'));
      refetchActivities();
      closeDeleteActivityDialog();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, tSettings('activity.action_remove_failure')));
    }
  });

  const handleActivitySubmit = (
    activity: Activity,
    callback: (activity: Activity) => void
  ): void => {
    const result = activitySchema.safeParse(activity);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    callback(activity);
  };

  const { createActivitySheet, openCreateActivitySheet, closeCreateActivitySheet } =
    useActivityCreateSheet({
      createActivity: () => {
        handleActivitySubmit(activityStore.getActivity() as Activity, createActivity);
      },
      isCreatePending,
      resetActivity: () => activityStore.reset()
    });

  const { updateActivitySheet, openUpdateActivitySheet, closeUpdateActivitySheet } =
    useActivityUpdateSheet({
      updateActivity: () => {
        handleActivitySubmit(activityStore.getActivity() as Activity, updateActivity);
      },
      isUpdatePending,
      resetActivity: () => activityStore.reset()
    });

  const {
    deleteActivityDialog,
    openDeleteActivityDialog,
    closeDeleteActivityDialog
  } = useActivityDeleteDialog({
    label: activityStore.label,
    deleteActivity: () => {
      activityStore.id && removeActivity(activityStore.id);
    },
    isDeletionPending: isDeletePending,
    reset: () => activityStore.reset()
  });

  const context: DataTableConfig<Activity> = {
    singularName: tSettings('activity.singular'),
    pluralName: tSettings('activity.plural'),
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: activitiesResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    createCallback: openCreateActivitySheet,
    updateCallback: (activity: Activity) => {
      activityStore.setActivity(activity);
      openUpdateActivitySheet();
    },
    deleteCallback: (activity: Activity) => {
      activityStore.setActivity(activity);
      openDeleteActivityDialog();
    }
  };

  const columns = useActivityColumns(context);

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
      {createActivitySheet}
      {updateActivitySheet}
      {deleteActivityDialog}
      <ContentSection
        title={tSettings('activity.singular')}
        desc={tSettings('activity.card_description')}
        className="w-full"
        childrenClassName={cn('overflow-hidden', className)}>
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          data={activities}
          columns={columns}
          context={context}
          isPending={isPending}
        />
      </ContentSection>
    </>
  );
};