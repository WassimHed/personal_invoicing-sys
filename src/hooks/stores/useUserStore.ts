import { ResponseUserDto } from '@/types';
import { create } from 'zustand';

interface UserStoreData {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  roleId?: string | number;
  password?: string;
  confirmPassword?: string;
}

export interface UserStore extends UserStoreData {
  set: (name: keyof UserStoreData, value: any) => void;
  reset: () => void;
  getUser: () => Partial<ResponseUserDto> & { password?: string; confirmPassword?: string };
  setUser: (data: Partial<ResponseUserDto>) => void;
}

const initialState: UserStoreData = {
  id: undefined,
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  dateOfBirth: new Date(),
  roleId: undefined,
  password: '',
  confirmPassword: ''
};

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  set: (name: keyof UserStoreData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },

  reset: () => {
    set({ ...initialState });
  },

  getUser: () => {
    const data = get();
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth?.toString(),
      password: data.password,
      roleId: data.roleId as number | undefined
    };
  },

  setUser: (data: Partial<ResponseUserDto>) => {
    set((state) => ({
      ...state,
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data?.dateOfBirth ? new Date(data?.dateOfBirth) : undefined,
      roleId: data.roleId
    }));
  }
}));
