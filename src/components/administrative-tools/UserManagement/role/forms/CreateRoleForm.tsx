import { useRoleStore } from '@/hooks/stores/useRoleStore';
import { cn } from '@/lib/utils';
import { Permission } from '@/types/permission';
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useTranslation } from 'react-i18next';
import { getPermissionTranslation } from '../../permission/utils/getPermissionTranslation';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { useRoleFormStructure } from './useRoleFormStructure';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared/Spinner';

interface CreateRoleFormProps {
  className?: string;
  permissions?: Permission[];
  createRole: () => void;
  isCreatePending: boolean;
}

export const CreateRoleForm: React.FC<CreateRoleFormProps> = ({
  className,
  permissions,
  createRole,
  isCreatePending
}) => {
  const { t: tPermission } = useTranslation('permissions');
  const { t: tCommon } = useTranslation('common');
  const roleManager = useRoleStore();

  const groupedPermissions = permissions?.reduce(
    (groups, permission) => {
      const [_, ...rest] = permission?.label?.split('_') || [];
      const entity = rest.join('_').toLocaleLowerCase();
      if (!groups[entity]) {
        groups[entity] = [];
      }
      groups[entity].push(permission);
      return groups;
    },
    {} as Record<string, Permission[]>
  );

  const sortedGroupedPermissions = Object.entries(groupedPermissions || {})
    .sort(([entityA], [entityB]) => entityA.localeCompare(entityB))
    .reduce(
      (sortedGroups, [entity, permissions]) => {
        sortedGroups[entity] = permissions;
        return sortedGroups;
      },
      {} as Record<string, Permission[]>
    );

  const permissionFormFragment = React.useMemo(() => {
    return Object.entries(sortedGroupedPermissions).map(([entity, permissions]) => (
      <Accordion type="multiple" key={entity} className="mt-0">
        <AccordionItem value={entity}>
          <AccordionTrigger className="text-sm font-extrabold pb-2">
            {tPermission(`${entity}.singular`)}
          </AccordionTrigger>
          <AccordionContent>
            <div key={entity}>
              <div className="flex flex-wrap gap-2 my-2">
                {permissions.map((permission) => {
                  const isSelected = roleManager.isPermissionSelected(permission?.id);
                  return (
                    <Toggle
                      key={permission.id}
                      defaultPressed={isSelected}
                      pressed={isSelected}
                      value={permission?.id?.toString()}
                      onClick={() => {
                        if (isSelected) {
                          roleManager.removePermission(permission?.id);
                        } else {
                          roleManager.addPermission(permission);
                        }
                      }}
                      className="border size-sm px-3 py-1 h-auto text-xs">
                      {tPermission(`${getPermissionTranslation(permission?.label)}.value`)}
                    </Toggle>
                  );
                })}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ));
  }, [roleManager.permissions, sortedGroupedPermissions, tPermission]);

  const { roleFormStructure } = useRoleFormStructure({
    roleManager,
    permissionFormFragment
  });

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <FormBuilder structure={roleFormStructure} />
      <div className="flex gap-2 justify-end mt-4">
        <Button onClick={createRole} disabled={isCreatePending}>
          {tCommon('commands.save')}
          <Spinner show={isCreatePending} />
        </Button>
      </div>
    </div>
  );
};
