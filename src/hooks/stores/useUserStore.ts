import { Gender, Profile, ResponseUserDto } from '@/types';
import { create } from 'zustand';

interface UserStoreData {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  roleId?: string;
  password?: string;
  confirmPassword?: string;
  // profile fields
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;
  picture?: File;
  pictureId?: number;
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
  dateOfBirth: undefined,
  roleId: undefined,
  password: '',
  confirmPassword: '',
  // profile fields
  phone: '',
  cin: '',
  bio: '',
  gender: undefined,
  isPrivate: false,
  picture: undefined,
  pictureId: undefined
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
      dateOfBirth: data.dateOfBirth?.toISOString(),
      password: data.password,
      confirmPassword: data.confirmPassword,
      roleId: data.roleId,
      profile: {
        phone: data.phone,
        cin: data.cin,
        bio: data.bio,
        gender: data.gender,
        isPrivate: data.isPrivate,
        pictureId: data.pictureId
      } as Partial<Profile>
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
      roleId: data.roleId,
      // profile fields
      phone: data.profile?.phone ?? '',
      cin: data.profile?.cin ?? '',
      bio: data.profile?.bio ?? '',
      gender: data.profile?.gender,
      isPrivate: data.profile?.isPrivate ?? false,
      pictureId: data.profile?.pictureId
    }));
  }
}));
