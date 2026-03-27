import { Role, RolePermissionEntry, Permission } from '@/types';
import { create } from 'zustand';

interface RoleStoreData {
  id?: string;
  label?: string;
  description?: string;
  permissions?: (Permission & { relationId?: string })[];
}

export interface RoleStore extends RoleStoreData {
  set: (name: keyof RoleStoreData, value: any) => void;
  reset: () => void;
  getRole: () => Partial<Role>;
  setRole: (data: Partial<Role>) => void;
  addPermission: (permission: Permission) => void;
  removePermission: (permissionId?: string) => void;
  isPermissionSelected: (permissionId?: string) => boolean;
}

const initialState: RoleStoreData = {
  id: undefined,
  label: '',
  description: '',
  permissions: []
};

export const useRoleStore = create<RoleStore>((set, get) => ({
  ...initialState,

  set: (name: keyof RoleStoreData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },

  reset: () => {
    set({ ...initialState });
  },

  getRole: () => {
    const data = get();
    return {
      id: data.id,
      label: data.label,
      description: data.description,
      permissions: data.permissions?.map((p) => ({
        id: p.relationId,
        permission: p,
        permissionId: p.id
      })) as RolePermissionEntry[]
    };
  },

  setRole: (data: Partial<Role>) => {
    set((state) => ({
      ...state,
      id: data.id,
      label: data.label,
      description: data.description,
      permissions: data?.permissions?.map((entry) => ({
        ...(entry.permission || ({} as Permission)),
        relationId: entry.id
      }))
    }));
  },

  addPermission: (permission: Permission) => {
    const { permissions } = get();
    if (!permissions?.some((p) => p.id === permission.id)) {
      set((state) => ({
        ...state,
        permissions: [...(permissions || []), permission]
      }));
    }
  },

  removePermission: (permissionId?: string) => {
    set((state) => ({
      ...state,
      permissions: state?.permissions?.filter((p) => p.id !== permissionId)
    }));
  },

  isPermissionSelected: (permissionId?: string) => {
    const { permissions } = get();
    return permissions?.some((p) => p.id === permissionId) || false;
  }
}));
