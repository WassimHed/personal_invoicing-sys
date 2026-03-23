import { CreateTaxDto, Tax, UpdateTaxDto } from '@/types';
import { create } from 'zustand';

interface TaxData {
  response: Tax | null;
  createDto: CreateTaxDto;
  createDtoErrors: Record<string, string[]>;

  updateDto?: UpdateTaxDto;
  updateDtoErrors: Record<string, string[]>;
}

export interface TaxStore extends TaxData {
  set: (name: keyof TaxData, value: any) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: TaxData = {
  response: null,
  createDto: {
    label: '',
    value: 0,
    isRate: true,
    isSpecial: false,
    currencyId: null
  },
  createDtoErrors: {},
  updateDtoErrors: {}
};

export const useTaxStore = create<TaxStore>((set, get) => ({
  ...initialState,

  set: (name, value) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },

  setNested: (path, value) => {
    set((state) => {
      const keys = path.split('.');
      const newState = { ...state };

      let current: any = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (typeof current[key] !== 'object' || current[key] === null) {
          current[key] = {};
        } else {
          current[key] = { ...current[key] };
        }
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;

      return newState;
    });
  },

  reset: () => set({ ...initialState })
}));

