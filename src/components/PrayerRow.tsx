import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, radius, spacing, type } from '@/theme/tokens';
import type { PrayerTime } from '@/types/prayer';
import { formatTime } from '@/utils/date';

interface Props {
  prayer: PrayerTime;
  status: 'passed' | 'active' | 'upcoming';
  use24Hour: boolean;
  icon: React.ReactNode;
}

export function PrayerRow({ prayer, status, use24Hour, icon }: Props) {
  const isActive = status === 'active';

  return (
    <View style={[styles.row, isActive && styles.rowActive]}>
      <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>{icon}</View>
      <View style={styles.names}>
        <Text style={[styles.en, isActive && styles.textOnActive]}>{prayer.label}</Text>
        <Text style={[styles.ar, isActive && styles.arOnActive]}>{prayer.labelArabic}</Text>
      </View>
      <View style={styles.timeCol}>
        <Text style={[styles.time, isActive && styles.textOnActive]}>
          {formatTime(prayer.date, use24Hour)}
        </Text>
        <Text style={[styles.sub, isActive && styles.subOnActive]}>
          {status === 'passed' ? 'passed' : status === 'active' ? 'up next' : 'upcoming'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(3.5),
    padding: spacing(3.5),
    marginBottom: spacing(2),
    backgroundColor: color.surface,
    borderRadius: radius.md,
  },
  rowActive: {
    backgroundColor: color.jade,
    borderTopLeftRadius: radius.activeRowCorners[0],
    borderTopRightRadius: radius.activeRowCorners[1],
    borderBottomRightRadius: radius.activeRowCorners[2],
    borderBottomLeftRadius: radius.activeRowCorners[3],
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: color.jadeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  names: { flex: 1 },
  en: {
    fontSize: 15,
    fontFamily: type.family.sansSemibold,
    color: color.ink,
  },
  ar: {
    fontSize: 13,
    fontFamily: type.family.arabic,
    color: color.inkMuted,
    marginTop: 1,
  },
  timeCol: { alignItems: 'flex-end' },
  time: {
    fontSize: 16,
    fontFamily: type.family.sansBold,
    color: color.ink,
    fontVariant: ['tabular-nums'],
  },
  sub: {
    fontSize: 11,
    color: '#B7B2A3',
    marginTop: 2,
  },
  textOnActive: { color: '#fff' },
  arOnActive: { color: 'rgba(255,255,255,0.7)' },
  subOnActive: { color: 'rgba(255,255,255,0.65)' },
});
