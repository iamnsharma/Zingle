import { create } from 'zustand';
import type { FilterOptions } from '@types';

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
};

const isFiltersActive = (filters: FilterOptions): boolean =>
  filters.distanceMax !== defaultFilters.distanceMax ||
  filters.ageMin !== defaultFilters.ageMin ||
  filters.ageMax !== defaultFilters.ageMax ||
  Boolean(filters.verifiedOnly) ||
  Boolean(filters.hasBio) ||
  Boolean(filters.onlineNow) ||
  Boolean(filters.recentlyActive);

export const useFilterStore = create<FilterStoreState>((set, get) => ({
  filters: { ...defaultFilters },

  updateFilters: (newFilters: Partial<FilterOptions>) =>
    set(state => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () =>
    set({
      filters: { ...defaultFilters },
    }),

  applyFilters: () => {},

  hasActiveFilters: () => isFiltersActive(get().filters),
}));
