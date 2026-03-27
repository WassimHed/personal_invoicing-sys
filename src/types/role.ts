import { Permission } from './permission';
import { DatabaseEntity } from './response/DatabaseEntity';

export interface Role extends DatabaseEntity {
  id?: string;
  label?: string;
  description?: string;
  permissions?: RolePermissionEntry[];
}

export interface CreateRoleDto {
  label?: string;
  description?: string;
  permissions?: { permissionId: string }[];
}

export interface UpdateRoleDto {
  label?: string;
  description?: string;
  permissions?: { id?: string; permissionId: string }[];
}

export interface RolePermissionEntry extends DatabaseEntity {
  id?: string;
  role?: Role;
  roleId?: string;
  permission?: Permission;
  permissionId?: string;
}
