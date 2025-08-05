/**
 * Utility Functions
 *
 * Collection of helper functions used throughout the application
 * for styling, formatting, and data manipulation.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts
 *
 * @param inputs - Array of class values (strings, objects, arrays)
 * @returns Merged class string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency (USD)
 *
 * @param value - Numeric value to format
 * @returns Formatted currency string (e.g., "$1,234")
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a number with thousands separators
 *
 * @param value - Numeric value to format
 * @returns Formatted number string (e.g., "1,234,567")
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Formats a number as a percentage
 *
 * @param value - Numeric value to format (e.g., 12.5 for 12.5%)
 * @returns Formatted percentage string (e.g., "12.5%")
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Generates a random variation of a base value
 * Used for simulating realistic metric fluctuations
 *
 * @param baseValue - The baseline value to vary
 * @param variationPercent - Maximum percentage variation (default: 5%)
 * @returns New value with random variation applied
 */
export function generateVariation(baseValue: number, variationPercent: number = 5): number {
  const variation = (Math.random() - 0.5) * 2 * (variationPercent / 100);
  return Math.max(0, baseValue * (1 + variation));
}
