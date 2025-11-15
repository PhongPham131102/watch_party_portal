import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export interface URLParamsConfig {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  [key: string]: string | number | boolean | undefined;
}

export function useURLParams<T extends URLParamsConfig>(
  defaultParams: T
  // eslint-disable-next-line no-unused-vars
): [T, (params: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<T>(() => {
    // Initialize from URL params on mount
    const urlParams: Partial<T> = {};
    
    searchParams.forEach((value, key) => {
      if (key === 'page' || key === 'limit') {
        urlParams[key as keyof T] = parseInt(value) as T[keyof T];
      } else if (key === 'sortOrder') {
        urlParams[key as keyof T] = value as T[keyof T];
      } else {
        urlParams[key as keyof T] = value as T[keyof T];
      }
    });

    return { ...defaultParams, ...urlParams };
  });

  const updateParams = (newParams: Partial<T>) => {
    setParams(newParams as T);

    // Update URL - only include params that are in newParams
    const urlSearchParams = new URLSearchParams();
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        urlSearchParams.set(key, String(value));
      }
    });

    setSearchParams(urlSearchParams, { replace: true });
  };

  return [params, updateParams];
}
