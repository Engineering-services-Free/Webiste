const HTML_TAG = /<\/?[a-z][a-z0-9-]*(?:\s[^<>]*)?>/i;

export function isHtml(value: string): boolean {
  return HTML_TAG.test(value);
}

export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(value: string, length: number): string {
  const text = stripHtml(value);
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

export function formatDate(value?: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items.filter(Boolean)));
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Indian numbers are stored without a country code in the CMS. */
export function toInternational(value: string): string {
  const digits = digitsOnly(value);
  return digits.length === 10 ? `91${digits}` : digits;
}

export function telHref(value: string): string {
  return `tel:+${toInternational(value)}`;
}

export function whatsappHref(value: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${toInternational(value)}${query}`;
}

export function formatPhone(value: string): string {
  const digits = digitsOnly(value);
  return digits.length === 10
    ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
    : value;
}

export function titleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/(^|[\s–-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

export function documentTypeLabel(type: string): string {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isSafeMapEmbed(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      /(^|\.)google\.[a-z.]+$/.test(parsed.hostname) &&
      parsed.pathname.startsWith("/maps/embed")
    );
  } catch {
    return false;
  }
}

export function isHttpUrl(url: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}
