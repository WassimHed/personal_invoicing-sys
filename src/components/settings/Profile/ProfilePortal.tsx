import React from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ResponseUserDto, UpdateAbstractUserDto } from '@/types';
import { api } from '@/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/shared';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useTranslation } from 'react-i18next';
import useInitializedState from '@/hooks/use-initialized-state';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { GeneralInformation } from './forms/GeneralInformation';
import { SecurityInformation } from './forms/SecurityInformation';
import { ProfileInformation } from './forms/ProfileInformation';
import { ProfilePicture } from './forms/ProfilePicture';
import { updateUserSchema } from '@/types/validations/user.validation';
import { useCurrentUser } from '@/hooks/content/user/useCurrentUser';

interface ProfilePortalProps {
  className?: string;
}

export const ProfilePortal: React.FC<ProfilePortalProps> = ({ className }) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.account') },
      { title: tCommon('settings.account.my_profile', { defaultValue: 'My Profile' }) }
    ]);
    return () => clearRoutes?.();
  }, [router.locale]);

  const { user, isFetchUserPending, refetchUser } = useCurrentUser();
  const userStore = useUserStore();

  const { mutate: updateProfile, isPending: isUpdatePending } = useMutation({
    mutationFn: async (data: UpdateAbstractUserDto & { id?: string }) => {
      // Remove confirmPassword and id from payload
      const { confirmPassword, id, ...payload } = data as any;
      if (!payload.password) delete payload.password;

      // Upload profile picture if a new file was selected
      const picture = userStore.picture;
      if (picture) {
        const uploaded = await api.upload.uploadFile(picture);
        if (uploaded?.id) {
          payload.profile = { ...(payload.profile || {}), pictureId: uploaded.id };
        }
      }

      return api.user.update(id, payload);
    },
    onSuccess: () => {
      toast.success(tSettings('profile.action_update_success', { defaultValue: 'Profil modifié avec succès' }));
      refetchUser();
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      // Reset transient fields after successful update
      userStore.set('password', '');
      userStore.set('confirmPassword', '');
      userStore.set('picture', undefined);
    },
    onError: (error: any) => {
      toast.error(error.message || tSettings('profile.action_update_failure', { defaultValue: 'Erreur lors de la modification du profil' }));
    }
  });

  const loading = isFetchUserPending || isUpdatePending;
  const defaultUser = React.useMemo(() => ({} as Partial<ResponseUserDto>), []);
  const initialData = user || defaultUser;

  const { isDisabled, globalReset } = useInitializedState({
    data: initialData,
    getCurrentData: () => userStore.getUser(),
    setFormData: (data: Partial<ResponseUserDto>) => userStore.setUser(data),
    resetData: () => userStore.reset(),
    loading
  });

  const handleSubmit = () => {
    const data = userStore.getUser();
    
    // Zod Validation
    const result = updateUserSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    updateProfile(data as UpdateAbstractUserDto & { id?: string });
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden p-1', className)}>
      <div className="flex-1 overflow-y-auto space-y-5 pb-20">
        <div className="flex flex-col lg:flex-row gap-5">
          <GeneralInformation
            className="w-full lg:w-2/3"
            isPending={loading}
          />
          <div className="flex flex-col gap-5 w-full lg:w-1/3">
            <ProfilePicture
              isPending={loading}
              pictureSlug={user?.profile?.picture?.slug}
            />
            <SecurityInformation
              isPending={loading}
            />
          </div>
        </div>
        <ProfileInformation isPending={loading} />
      </div>

      <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-background/80 backdrop-blur-sm border-t p-4 flex gap-4 justify-end z-10">
        <Button variant="secondary" onClick={globalReset} disabled={isDisabled || loading}>
          {tCommon('commands.reset', { defaultValue: 'Réinitialiser' })}
        </Button>
        <Button onClick={handleSubmit} disabled={isDisabled || loading}>
          <Spinner className="mr-2" size="small" show={isUpdatePending} />
          {tCommon('commands.save', { defaultValue: 'Enregistrer' })}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePortal;
