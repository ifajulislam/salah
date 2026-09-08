# Salah — prayer times app

A Material 3 Expressive–styled prayer times app. The visual language ("Living
Sky": a hero card and widget whose gradient shifts hue through Fajr → Isha)
is defined once in `src/theme/tokens.ts` and consumed everywhere, so the
whole app stays visually consistent as it grows.

## Getting started

```bash
bun install
bunx expo start
```

Scan the QR code with the Expo Go app (iOS or Android) — no native build
needed. This currently runs entirely inside Expo Go: storage uses
AsyncStorage rather than MMKV specifically so no dev client is required
during early development.

That changes once the home-screen widget work starts — widgets are native
UI outside the JS runtime and will require a dev client
(`bunx expo prebuild` + `bunx expo run:ios`/`run:android`) at that point.
If you want MMKV's sync API/perf back before then, swap it in
`src/lib/storage.ts` and `src/store/useSettingsStore.ts` — that's the one
change that reintroduces the native-module requirement.

## Architecture

```
src/
  theme/tokens.ts       Design tokens: color, type scale, radii, sky gradients
  types/prayer.ts        Shared domain types
  lib/
    calculation.ts       Wraps `adhan` — prayer times, prohibited windows, sky period
    location.ts           GPS permission flow + manual city search (Open-Meteo geocoding)
    storage.ts             AsyncStorage key-value wrapper (Expo Go-compatible)
  store/useSettingsStore.ts   Persisted settings: location, calc method, madhab, clock format
  hooks/
    useNow.ts              Ticking clock, used to drive live countdowns
    usePrayerTimes.ts       Derives today/tomorrow prayer times + current/next prayer
    useCountdown.ts         Countdown + ring progress toward the next prayer
  components/            HeroCard, PrayerRow, CountdownRing, SunArc, icons/
  screens/                HomeScreen, LocationSetupScreen, SettingsScreen
  navigation/             RootNavigator
```

### Why this shape

- **Calculation is isolated in `lib/calculation.ts`** behind a small,
  well-typed API (`computeDayPrayerTimes`, `getCurrentAndNextPrayer`,
  `resolveSkyPeriod`). It delegates the actual astronomy to `adhan`, a
  widely used, tested implementation — the app never reimplements solar
  position math.
- **Location is always optional.** `LocationSetupScreen` offers GPS first,
  but every failure path (denied permission, GPS error) drops straight into
  manual city search — the app is never blocked on location access.
- **The expensive calculation is memoized on calendar day, not on the
  clock.** `usePrayerTimes` re-derives "which prayer is next" every second
  cheaply, but only reruns the actual `adhan` calculation when the date
  rolls over — see the comment in that file.

## Known gaps to fill in before shipping

- **Hijri date**: `utils/date.ts` uses the ICU Islamic calendar built into
  `Intl.DateTimeFormat` (`en-US-u-ca-islamic`). This works on iOS/Android's
  ICU data in most cases, but Hermes builds can vary — verify on-device, and
  fall back to a small JS Hijri library (e.g. `hijri-date`) if it's missing
  a day or two of drift is unacceptable for your users.
- **Notifications**: `expo-notifications` is wired into `app.json` but not
  yet scheduled anywhere — add a scheduler that, whenever `usePrayerTimes`
  recomputes, cancels and re-schedules local notifications for each of
  today's remaining prayers.
- **Jumu'a**: shown as a static Friday reminder in the design; wire it to
  actual Dhuhr time on Fridays with a "congregational prayer" label.
- **Tahajjud**: `computeDayPrayerTimes` already returns
  `lastThirdOfNightStart` (from `adhan`'s `SunnahTimes`) — surface it as its
  own card/toggle as shown in the design preview.
- **Qibla direction**: not scaffolded yet — `adhan` has no compass logic;
  use `expo-sensors`' magnetometer plus great-circle bearing math to the
  Kaaba coordinates (21.4225°N, 39.8262°E).

## Home screen widget

Widgets are native UI, so they can't live in the JS bundle — they're a
second, small native target per platform that reads the same settings/cache
this app writes:

- **Android**: a Jetpack Glance widget (Kotlin, declarative — similar
  mental model to Compose) added via an Expo **config plugin** that appends
  the widget provider to `android/app/src/main`. It reads prayer times from
  a small SharedPreferences/DataStore cache that the RN app writes to on
  every launch and on a periodic background task (`expo-task-manager` +
  `expo-background-fetch`).
- **iOS**: a SwiftUI **WidgetKit** extension target (added via
  `npx expo prebuild` + Xcode, or an Expo config plugin like
  `@bacons/apple-targets`), reading from an **App Group**–shared
  `UserDefaults`/JSON file the RN app writes on each foreground/background
  transition.

Both widgets should own a lightweight, dependency-free reimplementation of
just "compute today's times for cached coordinates" (or bundle `adhan`'s
algorithm in Kotlin/Swift) rather than trying to invoke JS from the widget
process, since widgets run on their own timeline outside the RN runtime.

I can scaffold either platform's widget target next if you want to go
deeper on that piece.
