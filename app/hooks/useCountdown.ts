import { useNow } from './useNow';

interface Countdown {
  totalSeconds: number;
  hours: number;
  minutes: number;
  label: string; // e.g. "42 min" or "2 hr 5 min"
  /** 0 → just started, 1 → about to arrive. Clamped to [0, 1]. */
  progress: number;
}

/**
 * Ticking countdown from `now` to `target`, plus a progress ratio against
 * the span from `windowStart` (typically the previous prayer) — used to
 * drive the countdown ring's sweep.
 */
export function useCountdown(target: Date, windowStart: Date): Countdown {
  const now = useNow(1000);

  const totalSeconds = Math.max(0, Math.round((target.getTime() - now.getTime()) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const label = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

  const span = target.getTime() - windowStart.getTime();
  const elapsed = now.getTime() - windowStart.getTime();
  const progress = span > 0 ? Math.min(1, Math.max(0, elapsed / span)) : 0;

  return { totalSeconds, hours, minutes, label, progress };
}
