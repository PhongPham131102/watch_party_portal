// Export all custom hooks
// Utility hooks
export { default as useDebounce } from "./useDebounce";
export { default as useLocalStorage } from "./useLocalStorage";

// Permission hook
export { usePermission } from "./usePermission";

// Generic table filters with URL sync (RECOMMENDED)
export { useTableFiltersWithURL } from "./useTableFiltersWithURL";
export { useURLParams } from "./useURLParams";

// Types
export type { TableFiltersWithURLConfig, UseTableFiltersWithURLOptions } from "./useTableFiltersWithURL";
export type { URLParamsConfig } from "./useURLParams";
