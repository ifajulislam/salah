/**
 * Design tokens for the "Living Sky" visual system.
 * Material 3 Expressive principles: bold tonal color, generous asymmetric
 * shape, one confident hero moment per screen, everything else quiet.
 */

export const color = {
  jade: '#0B4F3F',
  jadeLight: '#E1F5EE',
  sand: '#F7F2E9',
  surface: '#FFFFFF',
  ink: '#1B1B1B',
  inkMuted: '#8A8577',
  hairline: '#EAE3D3',
  amber: '#F2B15A',
  danger: '#C24444',
} as const;

/**
 * One gradient per prayer "period" — the hero card and the widget both key
 * off this so the whole app breathes with the sun instead of staying static.
 */
export const skyGradients = {
  fajr: ['#1B1B3A', '#4A3A66', '#F2A6A1'] as const,
  sunrise: ['#4A3A66', '#E8734A', '#F2B15A'] as const,
  dhuhr: ['#1E6FB8', '#4C8DFF', '#8FC7F2'] as const,
  asr: ['#3C6E9E', '#7CA9C9', '#E8A33D'] as const,
  maghrib: ['#2B1E4A', '#7A3B63', '#E8734A', '#F2B15A'] as const,
  isha: ['#0E0E24', '#1B1B3A', '#3A2E5C'] as const,
} as const;

export type SkyPeriod = keyof typeof skyGradients;

export const radius = {
  sm: 12,
  md: 22,
  lg: 28,
  // Asymmetric "expressive" corner set used on the hero card and the
  // currently-active prayer row — deliberately not a uniform radius.
  heroCorners: [44, 44, 28, 44] as [number, number, number, number],
  activeRowCorners: [26, 26, 12, 26] as [number, number, number, number],
} as const;

export const type = {
  family: {
    sans: 'PlusJakartaSans_500Medium',
    sansBold: 'PlusJakartaSans_800ExtraBold',
    sansSemibold: 'PlusJakartaSans_600SemiBold',
    arabic: 'NotoNaskhArabic_700Bold',
  },
  scale: {
    display: 34,
    title: 22,
    heading: 17,
    body: 15,
    label: 13,
    caption: 11,
  },
} as const;

export const spacing = (n: number) => n * 4;
