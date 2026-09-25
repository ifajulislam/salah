import {
  CalculationMethod,
  Coordinates as AdhanCoordinates,
  Madhab,
  PrayerTimes as AdhanPrayerTimes,
  SunnahTimes,
} from "adhan";
import type {
  CalcMethodKey,
  Coordinates,
  DayPrayerTimes,
  MadhabPreference,
  PrayerName,
  PrayerTime,
} from "@/types/prayer";

const LABELS: Record<PrayerName, { en: string; ar: string }> = {
  fajr: { en: "Fajr", ar: "الفجر" },
  sunrise: { en: "Sunrise", ar: "الشروق" },
  dhuhr: { en: "Dhuhr", ar: "الظهر" },
  asr: { en: "Asr", ar: "العصر" },
  maghrib: { en: "Maghrib", ar: "المغرب" },
  isha: { en: "Isha", ar: "العشاء" },
};

function resolveMethod(key: CalcMethodKey) {
  const params = (
    CalculationMethod as Record<
      string,
      () => ReturnType<typeof CalculationMethod.Other>
    >
  )[key];
  return params ? params() : CalculationMethod.MuslimWorldLeague();
}

function resolveMadhab(
  pref: MadhabPreference,
): (typeof Madhab)[keyof typeof Madhab] {
  return pref === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
}

/**
 * Computes today's prayer times, sunnah windows, and the three canonical
 * prohibited (makruh) windows: after sunrise (istiwa), at solar noon
 * transit, and just before/at sunset.
 *
 * All calculation delegates to `adhan` — a peer-reviewed, widely used
 * implementation of the standard astronomical formulas — rather than
 * reimplementing solar position math by hand.
 */
export function computeDayPrayerTimes(
  coordinates: Coordinates,
  date: Date,
  methodKey: CalcMethodKey,
  madhabPref: MadhabPreference,
): DayPrayerTimes {
  const adhanCoords = new AdhanCoordinates(
    coordinates.latitude,
    coordinates.longitude,
  );
  const params = resolveMethod(methodKey);
  params.madhab = resolveMadhab(madhabPref);

  const times = new AdhanPrayerTimes(adhanCoords, date, params);
  const sunnah = new SunnahTimes(times);

  const order: PrayerName[] = [
    "fajr",
    "sunrise",
    "dhuhr",
    "asr",
    "maghrib",
    "isha",
  ];
  const raw: Record<PrayerName, Date> = {
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha,
  };

  const prayers: PrayerTime[] = order.map((name) => ({
    name,
    label: LABELS[name].en,
    labelArabic: LABELS[name].ar,
    date: raw[name],
  }));

  // Prohibited windows: ~15 min after sunrise, ~a few minutes around solar
  // noon (zawal), and from a few minutes before sunset until Maghrib.
  const sunriseEnd = new Date(times.sunrise.getTime() + 15 * 60_000);
  const noonWindowStart = new Date(times.dhuhr.getTime() - 5 * 60_000);
  const noonWindowEnd = times.dhuhr;
  const sunsetWindowStart = new Date(times.maghrib.getTime() - 15 * 60_000);

  return {
    date,
    prayers,
    prohibited: [
      { label: "After sunrise", start: times.sunrise, end: sunriseEnd },
      { label: "Solar noon", start: noonWindowStart, end: noonWindowEnd },
      { label: "Before sunset", start: sunsetWindowStart, end: times.maghrib },
    ],
    lastThirdOfNightStart: sunnah.lastThirdOfTheNight,
    nightEnd: times.fajr,
  };
}

/**
 * Returns the prayer period we're currently inside (the most recent prayer
 * that has started) and the one that starts next. Built from a merged
 * timeline spanning yesterday's Isha \u2192 today's five daily prayers \u2192
 * tomorrow's Fajr, specifically so the overnight hours before today's Fajr
 * correctly resolve to "currently in Isha" instead of having no current
 * prayer at all.
 */
export function getCurrentAndNextPrayer(
  yesterday: DayPrayerTimes,
  today: DayPrayerTimes,
  tomorrow: DayPrayerTimes,
  now: Date,
): { current: PrayerTime; next: PrayerTime } {
  const yesterdayIsha = yesterday.prayers.find((p) => p.name === "isha");
  const tomorrowFajr = tomorrow.prayers.find((p) => p.name === "fajr");
  if (!yesterdayIsha || !tomorrowFajr) {
    throw new Error(
      "Unable to resolve yesterday\u2019s Isha or tomorrow\u2019s Fajr",
    );
  }

  const timeline: PrayerTime[] = [
    yesterdayIsha,
    ...today.prayers.filter((p) => p.name !== "sunrise"),
    tomorrowFajr,
  ];

  let current: PrayerTime = yesterdayIsha;
  let next: PrayerTime = tomorrowFajr;

  for (const p of timeline) {
    if (p.date.getTime() <= now.getTime()) {
      current = p;
    } else {
      next = p;
      break;
    }
  }

  return { current, next };
}

/** Looks up a specific prayer's Date within a computed day, throwing if the invariant of "all six always present" is somehow violated. */
function getPrayerDate(day: DayPrayerTimes, name: PrayerName): Date {
  const found = day.prayers.find((p) => p.name === name);
  if (!found) {
    throw new Error(`computeDayPrayerTimes did not produce a "${name}" entry`);
  }
  return found.date;
}

/** Maps the current moment to a sky-gradient period for the UI. */
export function resolveSkyPeriod(
  today: DayPrayerTimes,
  now: Date,
): "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha" {
  const t = now.getTime();

  if (t < getPrayerDate(today, "fajr").getTime()) return "isha";
  if (t < getPrayerDate(today, "sunrise").getTime()) return "fajr";
  if (t < getPrayerDate(today, "dhuhr").getTime()) return "sunrise";
  if (t < getPrayerDate(today, "asr").getTime()) return "dhuhr";
  if (t < getPrayerDate(today, "maghrib").getTime()) return "asr";
  if (t < getPrayerDate(today, "isha").getTime()) return "maghrib";
  return "isha";
}
