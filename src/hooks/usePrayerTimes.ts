import { useMemo } from 'react';
import { computeDayPrayerTimes, getCurrentAndNextPrayer, resolveSkyPeriod } from '@/lib/calculation';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useNow } from './useNow';
import type { DayPrayerTimes, PrayerTime } from '@/types/prayer';

interface UsePrayerTimesResult {
  status: 'no-location' | 'ready';
  today: DayPrayerTimes | null;
  tomorrow: DayPrayerTimes | null;
  current: PrayerTime | null;
  next: PrayerTime | null;
  skyPeriod: ReturnType<typeof resolveSkyPeriod> | null;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/**
 * Single source of truth for "what time is it, prayer-wise, right now".
 *
 * The expensive astronomical calculation (computeDayPrayerTimes) is memoized
 * on the CALENDAR DAY, location, and settings — it does NOT depend on the
 * live clock, so it only reruns when the day actually rolls over. The
 * lightweight "which prayer is current/next" comparison runs every tick via
 * `useNow`, which is cheap (a handful of Date comparisons).
 */
export function usePrayerTimes(): UsePrayerTimesResult {
  const location = useSettingsStore((s) => s.location);
  const calculationMethod = useSettingsStore((s) => s.calculationMethod);
  const madhab = useSettingsStore((s) => s.madhab);

  const now = useNow(1000);
  const dayKey = startOfDay(now).getTime();

  const { today, tomorrow } = useMemo(() => {
    if (!location) return { today: null, tomorrow: null };

    const todayDate = new Date(dayKey);
    const tomorrowDate = new Date(dayKey);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    return {
      today: computeDayPrayerTimes(location.coordinates, todayDate, calculationMethod, madhab),
      tomorrow: computeDayPrayerTimes(location.coordinates, tomorrowDate, calculationMethod, madhab),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dayKey (not `now`) is the correct dependency
  }, [location, calculationMethod, madhab, dayKey]);

  if (!location || !today || !tomorrow) {
    return { status: 'no-location', today: null, tomorrow: null, current: null, next: null, skyPeriod: null };
  }

  const { current, next } = getCurrentAndNextPrayer(today, tomorrow, now);
  const skyPeriod = resolveSkyPeriod(today, now);

  return { status: 'ready', today, tomorrow, current, next, skyPeriod };
}
