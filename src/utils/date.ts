export function formatTime(date: Date, use24Hour: boolean): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24Hour,
  }).format(date);
}

export function formatGregorian(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

/**
 * Hijri date via the built-in ICU Islamic calendar (`en-US-u-ca-islamic`).
 * No extra dependency needed — Hermes/JSC ship ICU data that supports this.
 * Falls back gracefully to just the Gregorian date if the runtime lacks it.
 */
export function formatHijri(date: Date): string | null {
  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
    });
    return formatter.format(date);
  } catch {
    return null;
  }
}
