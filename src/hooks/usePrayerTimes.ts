import { useMemo } from "react";
import {
  computeDayPrayerTimes,
  getCurrentAndNextPrayer,
  resolveSkyPeriod,
} from "@/lib/calculation";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNow } from "./useNow";
import type { DayPrayerTimes, PrayerTime } from "@/types/prayer";

interface UsePrayerTimesResult {
  status: "no-location" | "ready";
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

export function usePrayerTimes(): UsePrayerTimesResult {
  const location = useSettingsStore((s) => s.location);
  const calculationMethod = useSettingsStore((s) => s.calculationMethod);
  const madhab = useSettingsStore((s) => s.madhab);

  const now = useNow(1000);
  const dayKey = startOfDay(now).getTime();

  const { yesterday, today, tomorrow } = useMemo(() => {
    if (!location) return { yesterday: null, today: null, tomorrow: null };

    const todayDate = new Date(dayKey);
    const yesterdayDate = new Date(dayKey);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const tomorrowDate = new Date(dayKey);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    return {
      yesterday: computeDayPrayerTimes(
        location.coordinates,
        yesterdayDate,
        calculationMethod,
        madhab,
      ),
      today: computeDayPrayerTimes(
        location.coordinates,
        todayDate,
        calculationMethod,
        madhab,
      ),
      tomorrow: computeDayPrayerTimes(
        location.coordinates,
        tomorrowDate,
        calculationMethod,
        madhab,
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dayKey (not `now`) is the correct dependency
  }, [location, calculationMethod, madhab, dayKey]);

  if (!location || !yesterday || !today || !tomorrow) {
    return {
      status: "no-location",
      today: null,
      tomorrow: null,
      current: null,
      next: null,
      skyPeriod: null,
    };
  }

  const { current, next } = getCurrentAndNextPrayer(
    yesterday,
    today,
    tomorrow,
    now,
  );
  const skyPeriod = resolveSkyPeriod(today, now);

  return { status: "ready", today, tomorrow, current, next, skyPeriod };
}
