import {
  Field,
  FieldVariant,
  FormStructure,
  TextareaFieldProps
} from '@/components/shared/form-builder/types';
import { useTranslation } from 'react-i18next';

interface UseFirmNotesFormStructureProps {
  firmStore: any;
  placeholder?: string;
  loading?: boolean;
}

export const useFirmNotesFormStructure = ({
  firmStore,
  placeholder,
  loading
}: UseFirmNotesFormStructureProps) => {
  const { t } = useTranslation('contacts');

  const notesField: Field<TextareaFieldProps> = {
    id: 'notes',
    label: t('firm.attributes.notes'),
    variant: FieldVariant.TEXTAREA,
    placeholder: placeholder,
    props: {
      value: firmStore.notes,
      onChange: (value) => firmStore.set('notes', value),
      disabled: loading,
      rows: 5,
      resizable: false
    }
  };

  const firmNotesFormStructure: FormStructure = {
    orientation: 'vertical',
    fieldsets: [
      {
        rows: [
          {
            fields: [notesField]
          }
        ]
      }
    ]
  };

  return { firmNotesFormStructure };
};