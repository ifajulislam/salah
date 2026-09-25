import type { CalculationMethod } from 'adhan';

export type PrayerName =
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha';

export interface PrayerTime {
  name: PrayerName;
  label: string;
  labelArabic: string;
  date: Date;
}

export interface ProhibitedWindow {
  label: string;
  start: Date;
  end: Date;
}

export interface DayPrayerTimes {
  date: Date;
  prayers: PrayerTime[];
  prohibited: ProhibitedWindow[];
  /** Midpoint of the night, used for the Tahajjud / last-third card. */
  lastThirdOfNightStart: Date;
  nightEnd: Date;
}

export type MadhabPreference = 'shafi' | 'hanafi';

/** Subset of adhan's built-in methods we expose in settings. */
export type CalcMethodKey =
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'MoonsightingCommittee'
  | 'NorthAmerica'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Turkey'
  | 'Tehran'
  | keyof typeof CalculationMethod;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationSource {
  type: 'gps' | 'manual';
  city: string;
  country?: string;
  coordinates: Coordinates;
  timezone?: string;
}

export interface AppSettings {
  location: LocationSource | null;
  calculationMethod: CalcMethodKey;
  madhab: MadhabPreference;
  use24HourClock: boolean;
  notificationsEnabled: boolean;
}
