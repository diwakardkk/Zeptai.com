const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[+\d][\d\s\-()]{6,19}$/;
const POST_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeText(value: unknown): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeMultilineText(value: unknown): string {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
}

export function normalizeEmail(value: unknown): string {
  return normalizeText(value).toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

export function isValidMobile(value: string): boolean {
  return MOBILE_REGEX.test(value);
}

export function isValidPostSlug(value: string): boolean {
  return POST_SLUG_REGEX.test(value);
}

export function sanitizeSourcePage(value: unknown, fallback: string): string {
  const normalized = normalizeText(value);
  if (!normalized) return fallback;
  if (normalized.length > 120) return fallback;
  return normalized;
}
