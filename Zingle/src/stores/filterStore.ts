import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FilterOptions, ProfileGender } from '@types';

interface FilterStoreState {
  filters: FilterOptions;
  updateFilters: (newFilters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  hasActiveFilters: () => boolean;
}

export const defaultFilters: FilterOptions = {
  distanceMin: 0,
  distanceMax: 100,
  ageMin: 18,
  ageMax: 65,
  verifiedOnly: false,
  hasBio: false,
  onlineNow: false,
  recentlyActive: false,
  showMe: [],
  city: undefined,
};

const isFiltersActive = (filters: FilterOptions): boolean =>
  filters.distanceMax !== defaultFilters.distanceMax ||
  filters.ageMin !== defaultFilters.ageMin ||
  filters.ageMax !== defaultFilters.ageMax ||
  Boolean(filters.verifiedOnly) ||
  Boolean(filters.hasBio) ||
  Boolean(filters.onlineNow) ||
  Boolean(filters.recentlyActive) ||
  Boolean(filters.showMe && filters.showMe.length > 0);

export const useFilterStore = create<FilterStoreState>()(
  persist(
    (set, get) => ({
      filters: { ...defaultFilters },

      updateFilters: newFilters =>
        set(state => ({
          filters: { ...state.filters, ...newFilters },
        })),

      resetFilters: () =>
        set({
          filters: { ...defaultFilters },
        }),

      applyFilters: () => {},

      hasActiveFilters: () => isFiltersActive(get().filters),
    }),
    {
      name: 'zingle-filters-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const showMeLabel = (showMe?: ProfileGender[]): string => {
  if (!showMe || showMe.length === 0) return 'Everyone';
  const labels: Record<ProfileGender, string> = {
    male: 'Men',
    female: 'Women',
    'non-binary': 'Non-binary',
    other: 'More',
  };
  return showMe.map(id => labels[id]).join(', ');
};
