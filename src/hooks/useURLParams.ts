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

// Validation helpers
const isValidNumber = (value: string): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0 && Number.isInteger(num);
};

const isValidSortOrder = (value: string): boolean => {
  return value === 'ASC' || value === 'DESC';
};

const isValidBoolean = (value: string): boolean => {
  return value === 'true' || value === 'false';
};

export function useURLParams<T extends URLParamsConfig>(
  defaultParams: T
  // eslint-disable-next-line no-unused-vars
): [T, (params: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<T>(() => {
    // Initialize from URL params on mount with validation
    const urlParams: Partial<T> = {};
    
    searchParams.forEach((value, key) => {
      try {
        if (key === 'page' || key === 'limit') {
          // Validate numbers
          if (isValidNumber(value)) {
            const num = parseInt(value);
            // Additional validation for page and limit
            if (key === 'page' && num >= 1) {
              urlParams[key as keyof T] = num as T[keyof T];
            } else if (key === 'limit' && num >= 1 && num <= 100) {
              urlParams[key as keyof T] = num as T[keyof T];
            }
          }
        } else if (key === 'sortOrder') {
          // Validate sort order
          if (isValidSortOrder(value)) {
            urlParams[key as keyof T] = value as T[keyof T];
          }
        } else if (key === 'isActive') {
          // Validate boolean
          if (isValidBoolean(value)) {
            urlParams[key as keyof T] = (value === 'true') as T[keyof T];
          }
        } else if (key === 'search') {
          // Validate search - limit length
          const sanitized = value.trim();
          if (sanitized.length > 0 && sanitized.length <= 200) {
            urlParams[key as keyof T] = sanitized as T[keyof T];
          }
        } else {
          // Other params - basic sanitization
          const sanitized = value.trim();
          if (sanitized.length > 0 && sanitized.length <= 100) {
            urlParams[key as keyof T] = sanitized as T[keyof T];
          }
        }
      } catch (error) {
        // Skip invalid params
        console.warn(`Invalid URL param: ${key}=${value}`, error);
      }
    });

    return { ...defaultParams, ...urlParams };
  });

  const updateParams = (newParams: Partial<T>) => {
    // Validate params before updating
    const validatedParams: Partial<T> = {};
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return; // Skip empty values
      }

      try {
        if (key === 'page' || key === 'limit') {
          const num = Number(value);
          if (isValidNumber(String(value))) {
            if (key === 'page' && num >= 1) {
              validatedParams[key as keyof T] = num as T[keyof T];
            } else if (key === 'limit' && num >= 1 && num <= 100) {
              validatedParams[key as keyof T] = num as T[keyof T];
            }
          }
        } else if (key === 'sortOrder') {
          if (isValidSortOrder(String(value))) {
            validatedParams[key as keyof T] = value as T[keyof T];
          }
        } else if (typeof value === 'boolean') {
          validatedParams[key as keyof T] = value as T[keyof T];
        } else if (typeof value === 'string') {
          const sanitized = value.trim();
          if (sanitized.length > 0 && sanitized.length <= 200) {
            validatedParams[key as keyof T] = sanitized as T[keyof T];
          }
        } else {
          validatedParams[key as keyof T] = value as T[keyof T];
        }
      } catch (error) {
        console.warn(`Invalid param: ${key}=${value}`, error);
      }
    });

    setParams(validatedParams as T);

    // Update URL - only include validated params
    const urlSearchParams = new URLSearchParams();
    
    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        urlSearchParams.set(key, String(value));
      }
    });

    setSearchParams(urlSearchParams, { replace: true });
  };

  return [params, updateParams];
}
