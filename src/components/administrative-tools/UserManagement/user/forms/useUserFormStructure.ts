import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  TextFieldProps,
  DateFieldProps,
  PasswordFieldProps,
  CheckboxFieldProps
} from '@/components/shared/form-builder/types';
import { useTranslation } from 'react-i18next';
import { Role } from '@/types/role';
import { UserStore } from '@/hooks/stores/useUserStore';

interface UseUserFormStructureProps {
  store: UserStore;
  roles?: Role[];
  forceShowPasswordInputs?: boolean;
  showPasswordInputs: boolean;
  handleShowPasswordInputs: (checked: any) => void;
  loading?: boolean;
}

export const useUserFormStructure = ({
  store,
  roles = [],
  forceShowPasswordInputs = true,
  showPasswordInputs,
  handleShowPasswordInputs
}: UseUserFormStructureProps) => {
  const { t: tSettings } = useTranslation('settings');

  const firstNameField: Field<TextFieldProps> = {
    id: 'firstName',
    label: tSettings('users.attributes.first_name'),
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. John',
    props: {
      value: store.firstName,
      onChange: (value) => store.set('firstName', value)
    }
  };

  const lastNameField: Field<TextFieldProps> = {
    id: 'lastName',
    label: tSettings('users.attributes.last_name'),
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. Doe',
    props: {
      value: store.lastName,
      onChange: (value) => store.set('lastName', value)
    }
  };

  const emailField: Field<TextFieldProps> = {
    id: 'email',
    label: `${tSettings('users.attributes.email')} (*)`,
    variant: FieldVariant.EMAIL,
    placeholder: 'Ex. john@example.com',
    props: {
      value: store.email,
      onChange: (value) => store.set('email', value)
    }
  };

  const dateOfBirthField: Field<DateFieldProps> = {
    id: 'dateOfBirth',
    label: tSettings('users.attributes.date_of_birth'),
    variant: FieldVariant.DATE,
    props: {
      value: store.dateOfBirth,
      onDateChange: (value) => store.set('dateOfBirth', value)
    }
  };

  const usernameField: Field<TextFieldProps> = {
    id: 'username',
    label: `${tSettings('users.attributes.username')} (*)`,
    variant: FieldVariant.TEXT,
    placeholder: 'Ex. john_doe',
    props: {
      value: store.username,
      onChange: (value) => store.set('username', value)
    }
  };

  const updatePasswordCheckbox: Field<CheckboxFieldProps> = {
    id: 'show-password-inputs',
    label: tSettings('users.update_password'),
    variant: FieldVariant.CHECKBOX,
    description: tSettings('users.hints.update_password_hint', {
      name: store.lastName,
      surname: store.firstName
    }),
    hidden: forceShowPasswordInputs,
    props: {
      checked: showPasswordInputs,
      onCheckedChange: handleShowPasswordInputs
    }
  };

  const passwordField: Field<PasswordFieldProps> = {
    id: 'password',
    label: tSettings('users.attributes.password'),
    variant: FieldVariant.PASSWORD,
    hidden: !(forceShowPasswordInputs || showPasswordInputs),
    props: {
      value: store.password,
      onChange: (value) => store.set('password', value)
    }
  };

  const confirmPasswordField: Field<PasswordFieldProps> = {
    id: 'confirmPassword',
    label: tSettings('users.attributes.confirm_password'),
    variant: FieldVariant.PASSWORD,
    hidden: !(forceShowPasswordInputs || showPasswordInputs),
    props: {
      value: store.confirmPassword,
      onChange: (value) => store.set('confirmPassword', value)
    }
  };

  const roleField: Field<SelectFieldProps> = {
    id: 'roleId',
    label: `${tSettings('users.attributes.role')} (*)`,
    variant: FieldVariant.SELECT,
    placeholder: 'Role...',
    props: {
      value: store.roleId ? String(store.roleId) : undefined,
      onValueChange: (value) => store.set('roleId', value),
      options: roles.map((role) => ({
        label: role.label || '',
        value: role.id ? String(role.id) : ''
      }))
    }
  };

  const requirePasswordCheckbox: Field<CheckboxFieldProps> = {
    id: 'force-password-change',
    label: tSettings('users.require_password'),
    variant: FieldVariant.CHECKBOX,
    description: tSettings('users.require_password_hint'),
    props: {}
  };

  const userFormStructure: FormStructure = {
    orientation: 'vertical',
    fieldsets: [
      {
        title: tSettings('users.attributes.general'),
        includeHeader: true,
        rows: [
          { fields: [firstNameField, lastNameField] },
          { fields: [emailField] },
          { fields: [dateOfBirthField] }
        ]
      },
      {
        title: tSettings('users.attributes.account'),
        includeHeader: true,
        rows: [
          { fields: [usernameField] },
          { fields: [updatePasswordCheckbox] },
          { fields: [passwordField] },
          { fields: [confirmPasswordField] },
          { fields: [roleField] },
          { fields: [requirePasswordCheckbox] }
        ]
      }
    ]
  };

  return { userFormStructure };
};
