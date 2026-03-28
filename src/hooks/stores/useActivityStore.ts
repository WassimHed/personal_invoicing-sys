import { Activity } from '@/types';
import { create } from 'zustand';

export type ActivityStore = {
  // data
  id?: number;
  label?: string;
  // methods
  set: (name: keyof ActivityStore, value: any) => void;
  reset: () => void;
  setActivity: (activity: Partial<Activity>) => void;
  getActivity: () => Partial<Activity>;
};

const initialState: Omit<ActivityStore, 'set' | 'reset' | 'setActivity' | 'getActivity'> = {
  id: 0,
  label: ''
};

export const useActivityStore = create<ActivityStore>((set, get) => ({
  ...initialState,
  set: (name, value) =>
    set((state) => ({
      ...state,
      [name]: value
    })),
  reset: () => set({ ...initialState }),
  setActivity: (activity) => {
    set((state) => ({
      ...state,
      ...activity
    }));
  },
  getActivity: () => {
    const { id, label } = get();
    return { id, label };
  }
}));
