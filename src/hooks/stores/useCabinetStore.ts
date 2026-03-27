import { Activity, Address, Cabinet, Currency } from '@/types';
import { create } from 'zustand';

interface CabinetStoreData {
  id?: number;
  enterpriseName?: string;
  email?: string;
  phone?: string;
  taxIdNumber?: string;
  activity?: Activity;
  currency?: Currency;
  address?: Address;
  logo?: File;
  signature?: File;
}

export interface CabinetStore extends CabinetStoreData {
  set: (name: keyof CabinetStoreData, value: any) => void;
  reset: () => void;
  setCabinet: (cabinet: Partial<Cabinet>) => void;
  getCabinet: () => Partial<Cabinet>;
}

const initialState: CabinetStoreData = {
  id: undefined,
  enterpriseName: '',
  email: '',
  phone: '',
  taxIdNumber: '',
  activity: undefined,
  currency: undefined,
  address: undefined,
  logo: undefined,
  signature: undefined
};

export const useCabinetStore = create<CabinetStore>((set, get) => ({
  ...initialState,

  set: (name: keyof CabinetStoreData, value: any) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },

  reset: () => {
    set({ ...initialState });
  },

  setCabinet: (cabinet: Partial<Cabinet>) => {
    set((state) => ({
      ...state,
      id: cabinet?.id,
      enterpriseName: cabinet?.enterpriseName,
      email: cabinet?.email,
      phone: cabinet?.phone,
      taxIdNumber: cabinet?.taxIdNumber,
      activity: cabinet?.activity,
      currency: cabinet?.currency,
      address: cabinet?.address,
      logo: cabinet?.logo,
      signature: cabinet?.signature
    }));
  },

  getCabinet: () => {
    const data = get();
    return {
      id: data.id,
      enterpriseName: data.enterpriseName,
      phone: data?.phone,
      email: data?.email,
      activityId: data?.activity?.id,
      currencyId: data?.currency?.id,
      taxIdNumber: data?.taxIdNumber,
      address: data?.address,
      logo: data?.logo,
      signature: data?.signature
    };
  }
}));
