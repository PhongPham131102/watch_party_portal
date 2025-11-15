/**
 * Utility functions for string manipulation
 */

/**
 * Creates a URL-friendly slug from a string
 * Converts Vietnamese characters to ASCII equivalents
 * Replaces spaces with underscores
 * Removes special characters
 * 
 * @param text - The text to convert to slug
 * @returns The slugified string
 * 
 * @example
 * createSlug("Quản trị viên") // returns "quan_tri_vien"
 * createSlug("Administrator") // returns "administrator"
 * createSlug("Người dùng hệ thống") // returns "nguoi_dung_he_thong"
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");
};

/**
 * Capitalizes the first letter of a string
 * 
 * @param text - The text to capitalize
 * @returns The capitalized string
 * 
 * @example
 * capitalizeFirst("hello world") // returns "Hello world"
 */
export const capitalizeFirst = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Truncates a string to a specified length and adds ellipsis
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length of the string
 * @returns The truncated string with ellipsis if needed
 * 
 * @example
 * truncateText("This is a long text", 10) // returns "This is a..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Formats a string to title case (capitalize each word)
 * 
 * @param text - The text to format
 * @returns The title cased string
 * 
 * @example
 * toTitleCase("hello world") // returns "Hello World"
 */
export const toTitleCase = (text: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
