import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
  DateFieldProps,
  PasswordFieldProps,
  TextareaFieldProps,
  RadioFieldProps,
  SwitchFieldProps
} from '@/components/shared/form-builder/types';
import { useTranslation } from 'react-i18next';
import { UserStore } from '@/hooks/stores/useUserStore';
import { Gender } from '@/types';

interface UseProfileFormStructureProps {
  userManager: UserStore;
  isPending?: boolean;
}

export const useProfileFormStructure = ({
  userManager,
  isPending
}: UseProfileFormStructureProps) => {
  const { t: tSettings } = useTranslation('settings');

  // ── General fields ────────────────────────────────────────────────────────
  const firstNameField: Field<TextFieldProps> = {
    id: 'firstName',
    label: `${tSettings('users.attributes.first_name', { defaultValue: 'First Name' })} (*)`,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. John',
    props: {
      value: userManager.firstName || '',
      onChange: (value) => userManager.set('firstName', value),
      disabled: isPending
    }
  };

  const lastNameField: Field<TextFieldProps> = {
    id: 'lastName',
    label: `${tSettings('users.attributes.last_name', { defaultValue: 'Last Name' })} (*)`,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. Doe',
    props: {
      value: userManager.lastName || '',
      onChange: (value) => userManager.set('lastName', value),
      disabled: isPending
    }
  };

  const usernameField: Field<TextFieldProps> = {
    id: 'username',
    label: `${tSettings('users.attributes.username', { defaultValue: 'Username' })} (*)`,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. johndoe',
    props: {
      value: userManager.username || '',
      onChange: (value) => userManager.set('username', value),
      disabled: isPending
    }
  };

  const emailField: Field<TextFieldProps> = {
    id: 'email',
    label: `${tSettings('users.attributes.email', { defaultValue: 'E-mail' })} (*)`,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. johndoe@example.com',
    props: {
      value: userManager.email || '',
      onChange: (value) => userManager.set('email', value),
      disabled: isPending
    }
  };

  const dateOfBirthField: Field<DateFieldProps> = {
    id: 'dateOfBirth',
    label: `${tSettings('users.attributes.date_of_birth', { defaultValue: 'Date of Birth' })} (*)`,
    variant: FieldVariant.DATE,
    props: {
      value: userManager.dateOfBirth,
      onDateChange: (value) => userManager.set('dateOfBirth', value),
      disabled: isPending
    }
  };

  // ── Security fields ───────────────────────────────────────────────────────
  const passwordField: Field<PasswordFieldProps> = {
    id: 'password',
    label: tSettings('users.attributes.password', { defaultValue: 'New Password' }),
    variant: FieldVariant.PASSWORD,
    placeholder: '...',
    props: {
      value: userManager.password || '',
      onChange: (value) => userManager.set('password', value),
      disabled: isPending
    }
  };

  const confirmPasswordField: Field<PasswordFieldProps> = {
    id: 'confirmPassword',
    label: tSettings('users.attributes.confirm_password', { defaultValue: 'Confirm Password' }),
    variant: FieldVariant.PASSWORD,
    placeholder: '...',
    props: {
      value: userManager.confirmPassword || '',
      onChange: (value) => userManager.set('confirmPassword', value),
      disabled: isPending
    }
  };

  // ── Profile fields ────────────────────────────────────────────────────────
  const phoneField: Field<TextFieldProps> = {
    id: 'phone',
    label: tSettings('profile.attributes.phone', { defaultValue: 'Phone' }),
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. +216 98 765 432',
    props: {
      value: userManager.phone || '',
      onChange: (value) => userManager.set('phone', value),
      disabled: isPending
    }
  };

  const cinField: Field<TextFieldProps> = {
    id: 'cin',
    label: tSettings('profile.attributes.cin', { defaultValue: 'CIN' }),
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. 12345678',
    props: {
      value: userManager.cin || '',
      onChange: (value) => userManager.set('cin', value),
      disabled: isPending
    }
  };

  const bioField: Field<TextareaFieldProps> = {
    id: 'bio',
    label: tSettings('profile.attributes.bio', { defaultValue: 'Bio' }),
    variant: FieldVariant.TEXTAREA,
    placeholder: 'Ex. Software developer...',
    props: {
      value: userManager.bio || '',
      onChange: (value) => userManager.set('bio', value),
      disabled: isPending,
      rows: 3,
      resizable: false
    }
  };

  const genderField: Field<RadioFieldProps> = {
    id: 'gender',
    label: tSettings('profile.attributes.gender', { defaultValue: 'Gender' }),
    variant: FieldVariant.RADIO,
    props: {
      value: userManager.gender || '',
      onValueChange: (value) => userManager.set('gender', value as Gender),
      disabled: isPending,
      options: [
        { label: tSettings('profile.attributes.gender_male', { defaultValue: 'Male' }), value: Gender.Male },
        { label: tSettings('profile.attributes.gender_female', { defaultValue: 'Female' }), value: Gender.Female }
      ]
    }
  };

  const isPrivateField: Field<SwitchFieldProps> = {
    id: 'isPrivate',
    label: tSettings('profile.attributes.is_private', { defaultValue: 'Private Profile' }),
    description: tSettings('profile.attributes.is_private_description', { defaultValue: 'Hide your profile from other users' }),
    variant: FieldVariant.SWITCH,
    props: {
      checked: userManager.isPrivate ?? false,
      onCheckedChange: (value) => userManager.set('isPrivate', value),
      disabled: isPending
    }
  };

  // ── Structures ────────────────────────────────────────────────────────────
  const generalFormStructure: FormStructure = {
    orientation: 'vertical',
    fieldsets: [
      {
        rows: [
          { fields: [firstNameField, lastNameField] },
          { fields: [usernameField, emailField] },
          { fields: [dateOfBirthField] }
        ]
      }
    ]
  };

  const securityFormStructure: FormStructure = {
    orientation: 'vertical',
    fieldsets: [
      {
        rows: [
          { fields: [passwordField] },
          { fields: [confirmPasswordField] }
        ]
      }
    ]
  };

  const profileFormStructure: FormStructure = {
    orientation: 'vertical',
    fieldsets: [
      {
        rows: [
          { fields: [phoneField, cinField] },
          { fields: [genderField] },
          { fields: [bioField] },
          { fields: [isPrivateField] }
        ]
      }
    ]
  };

  return { generalFormStructure, securityFormStructure, profileFormStructure };
};
