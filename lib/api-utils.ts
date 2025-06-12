/**
 * Utility functions for API-related operations
 */

/**
 * Convert a relative media URL to absolute URL
 * @param url - The URL to convert (can be relative or absolute)
 * @returns The absolute URL
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Get base URL from environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  // Ensure URL starts with /
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseUrl}${cleanUrl}`;
}

/**
 * Safely convert a value to number with fallback
 * @param value - The value to convert
 * @param fallback - The fallback value if conversion fails
 * @returns The converted number or fallback
 */
export function toNumber(value: any, fallback: number = 0): number {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

/**
 * Format GPS coordinates for display
 * @param lat - Latitude value
 * @param lng - Longitude value
 * @param decimals - Number of decimal places (default: 4)
 * @returns Formatted coordinates string or null if invalid
 */
export function formatCoordinates(
  lat: any, 
  lng: any, 
  decimals: number = 4
): string | null {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return null;
  }
  
  const latNum = toNumber(lat);
  const lngNum = toNumber(lng);
  
  if (latNum === 0 && lngNum === 0) {
    return null; // Likely invalid coordinates
  }
  
  return `${latNum.toFixed(decimals)}, ${lngNum.toFixed(decimals)}`;
} 