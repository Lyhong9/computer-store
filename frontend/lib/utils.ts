import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export const DEFAULT_PRODUCT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80";

export const FALLBACK_SVG_DATA_URL =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><rect width='18' height='18' x='3' y='3' rx='3' fill='%23f8fafc'/><circle cx='8.5' cy='8.5' r='2' fill='%2394a3b8'/><path d='m21 15-5-5L5 21'/></svg>";

/**
 * Normalizes any product image URL:
 * - Rewrites backend absolute URLs (e.g. http://localhost:8083/uploads/...) to relative /uploads/...
 *   so requests route cleanly through Next.js proxy rewrite without cross-origin or port issues.
 * - Handles empty/null/undefined with a graceful default placeholder image.
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") {
    return DEFAULT_PRODUCT_PLACEHOLDER;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return DEFAULT_PRODUCT_PLACEHOLDER;
  }
  // If URL points to backend port 8083 /uploads/, rewrite to relative /uploads/
  if (/^https?:\/\/[^/]+:8083\/uploads\//i.test(trimmed)) {
    return trimmed.replace(/^https?:\/\/[^/]+:8083\/uploads\//i, "/uploads/");
  }
  if (/^https?:\/\/(localhost|127\.0\.0\.1):8083\//i.test(trimmed)) {
    return trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1):8083\//i, "/");
  }
  return trimmed;
}

/**
 * Robust image error handler to prevent broken image icons and recursive infinite loops
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = DEFAULT_PRODUCT_PLACEHOLDER
) {
  const target = e.currentTarget;
  if (!target.dataset.triedFallback1) {
    target.dataset.triedFallback1 = "true";
    target.src = fallbackSrc;
  } else if (!target.dataset.triedFallback2) {
    target.dataset.triedFallback2 = "true";
    target.src = FALLBACK_SVG_DATA_URL;
  }
}

