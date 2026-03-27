import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Feather, Image as ImageIcon, Images } from 'lucide-react';
import { useCabinetStore } from '@/hooks/stores/useCabinetStore';
import { useTranslation } from 'react-i18next';
import { ImageUploader } from '@/components/ui/image-uploader';
import { cn } from '@/lib/utils';

interface UploadedInformationProps {
  className?: string;
}

export const UploadedInformation: React.FC<UploadedInformationProps> = ({ className }) => {
  const cabinetStore = useCabinetStore();
  const { t: tSettings } = useTranslation('settings');
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Images className="size-5" />
            {tSettings('cabinet.assets')}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-1 gap-4">
        <ImageUploader
          alt={tSettings('cabinet.attributes.logo')}
          value={cabinetStore?.logo}
          onChange={(file?: File) => {
            cabinetStore.set('logo', file);
          }}
          icon={<ImageIcon />}
        />
        <ImageUploader
          alt={tSettings('cabinet.attributes.signature')}
          value={cabinetStore?.signature}
          onChange={(file?: File) => {
            cabinetStore.set('signature', file);
          }}
          icon={<Feather />}
        />
      </CardContent>
    </Card>
  );
};
