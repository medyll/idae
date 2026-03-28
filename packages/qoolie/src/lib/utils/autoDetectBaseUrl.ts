/**
 * Auto-detect API base URL from environment
 * 
 * Priority:
 * 1. import.meta.env.VITE_API_URL (Vite)
 * 2. window.location.origin (browser)
 * 3. undefined (SSR - dev must provide)
 */
export function autoDetectBaseUrl(): string | undefined {
  // Try environment variable (Vite, Node)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = import.meta as any;
  if (typeof meta !== 'undefined' && meta.env?.VITE_API_URL) {
    return meta.env.VITE_API_URL;
  }
  
  // Try browser location
  if (typeof window !== 'undefined' && window.location?.origin) {
    // Exclude file:// protocol (local files)
    if (window.location.origin !== 'null' && !window.location.origin.startsWith('file://')) {
      return window.location.origin;
    }
  }
  
  // SSR or local file - return undefined
  return undefined;
}
