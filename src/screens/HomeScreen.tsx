import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HeroCard } from '@/components/HeroCard';
import { PrayerRow } from '@/components/PrayerRow';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useNow } from '@/hooks/useNow';
import { useSettingsStore } from '@/store/useSettingsStore';
import { color, spacing, type } from '@/theme/tokens';
import { formatGregorian, formatHijri } from '@/utils/date';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { PinIcon } from '@/components/icons/PinIcon';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const location = useSettingsStore((s) => s.location);
  const use24Hour = useSettingsStore((s) => s.use24HourClock);
  const now = useNow(1000);
  const { status, today, current, next, skyPeriod } = usePrayerTimes();

  if (status === 'no-location' || !today || !next) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Where should we calculate from?</Text>
          <Text style={styles.emptyBody}>
            Share your location for automatic, precise times, or search for your city instead.
          </Text>
          <Text
            style={styles.emptyAction}
            onPress={() => navigation.navigate('LocationSetup')}
          >
            Set location
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const sunrise = today.prayers.find((p) => p.name === 'sunrise')!.date;
  const sunset = today.prayers.find((p) => p.name === 'maghrib')!.date;
  const orderedForRow = today.prayers;

  // The "window start" for the hero countdown ring is the previous prayer,
  // or the day's start if we're before Fajr.
  const previous =
    [...today.prayers].reverse().find((p) => p.date.getTime() <= next.date.getTime() && p !== next) ??
    today.prayers[0]!;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.place}>{location?.city ?? 'Unknown'}</Text>
            <Text style={styles.date}>
              {formatHijri(now) ? `${formatHijri(now)} \u00b7 ` : ''}
              {formatGregorian(now)}
            </Text>
          </View>
          <View style={styles.pinBtn} onTouchEnd={() => navigation.navigate('LocationSetup')}>
            <PinIcon color={color.ink} size={18} />
          </View>
        </View>

        <HeroCard
          next={next}
          previous={previous}
          skyPeriod={skyPeriod ?? 'dhuhr'}
          use24Hour={use24Hour}
          sunrise={sunrise}
          sunset={sunset}
          now={now}
        />

        <Text style={styles.sectionTitle}>Today</Text>

        {orderedForRow.map((prayer) => {
          const status2 =
            prayer.name === next.name
              ? 'active'
              : prayer.date.getTime() < now.getTime()
                ? 'passed'
                : 'upcoming';
          return (
            <PrayerRow
              key={prayer.name}
              prayer={prayer}
              status={status2}
              use24Hour={use24Hour}
              icon={<View style={styles.iconDot} />}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.sand },
  content: { padding: spacing(5), paddingBottom: spacing(24) },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing(4.5),
  },
  place: { fontSize: 22, fontFamily: type.family.sansBold, color: color.ink },
  date: { fontSize: 13, color: color.inkMuted, marginTop: 2 },
  pinBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: type.family.sansSemibold,
    color: color.inkMuted,
    marginTop: spacing(6.5),
    marginBottom: spacing(2.5),
  },
  iconDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: color.jade },
  emptyState: { flex: 1, justifyContent: 'center', padding: spacing(8) },
  emptyTitle: { fontSize: 22, fontFamily: type.family.sansBold, color: color.ink, marginBottom: spacing(2) },
  emptyBody: { fontSize: 15, color: color.inkMuted, lineHeight: 22, marginBottom: spacing(4) },
  emptyAction: { fontSize: 15, fontFamily: type.family.sansSemibold, color: color.jade },
});
