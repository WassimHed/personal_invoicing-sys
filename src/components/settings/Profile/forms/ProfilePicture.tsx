import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound, ImagePlus, X } from 'lucide-react';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { api } from '@/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfilePictureProps {
  className?: string;
  isPending?: boolean;
  /** Slug of the existing profile picture already stored in the backend */
  pictureSlug?: string;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  className,
  isPending,
  pictureSlug
}) => {
  const userStore = useUserStore();
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  // Preview of the locally selected file (reactive to store)
  const pictureFile = userStore.picture;
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);

  // Sync local preview with store file
  React.useEffect(() => {
    if (!pictureFile) {
      setLocalPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLocalPreview(reader.result as string);
    reader.readAsDataURL(pictureFile);
  }, [pictureFile]);

  // Preview fetched from backend (existing picture)
  const [remotePreview, setRemotePreview] = React.useState<string | null>(null);
  const [isLoadingRemote, setIsLoadingRemote] = React.useState(false);

  // Load existing picture from backend when slug changes
  React.useEffect(() => {
    if (!pictureSlug) {
      setRemotePreview(null);
      return;
    }
    setIsLoadingRemote(true);
    let objectUrl: string | null = null;
    
    api.upload.fetchBlobBySlug(pictureSlug).then((blob) => {
      if (blob) {
        objectUrl = URL.createObjectURL(blob);
        setRemotePreview(objectUrl);
      }
      setIsLoadingRemote(false);
    });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pictureSlug]);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        userStore.set('picture', acceptedFiles[0]);
      }
    },
    [userStore]
  );

  const handleClear = () => {
    userStore.set('picture', undefined);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 2_000_000,
    accept: { 'image/png': [], 'image/jpeg': [], 'image/webp': [] },
    disabled: isPending
  });

  const preview = localPreview || remotePreview;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <UserRound className="size-5" />
            {tSettings('profile.picture', { defaultValue: 'Profile Picture' })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {isLoadingRemote ? (
          <Skeleton className="size-36 rounded-full" />
        ) : preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Profile"
              width={144}
              height={144}
              className="size-36 rounded-full object-cover border-2 border-border"
            />
            {localPreview && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 size-6 rounded-full"
                onClick={handleClear}>
                <X className="size-3" />
              </Button>
            )}
          </div>
        ) : (
          <div className="size-36 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
            <UserRound className="size-16 text-muted-foreground" />
          </div>
        )}

        <div
          {...getRootProps()}
          className={cn(
            'w-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors',
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
            isPending && 'opacity-50 cursor-not-allowed'
          )}>
          <input {...getInputProps()} />
          <ImagePlus className="size-5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center">
            {isDragActive
              ? tCommon('files.drop_image')
              : tCommon('files.select_image')}
          </p>
          <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP — max 2MB</p>
        </div>
      </CardContent>
    </Card>
  );
};
