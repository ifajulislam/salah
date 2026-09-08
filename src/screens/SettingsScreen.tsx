import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/store/useSettingsStore';
import { color, radius, spacing, type } from '@/theme/tokens';
import type { CalcMethodKey, MadhabPreference } from '@/types/prayer';

const METHODS: { key: CalcMethodKey; label: string }[] = [
  { key: 'MuslimWorldLeague', label: 'Muslim World League' },
  { key: 'Egyptian', label: 'Egyptian General Authority' },
  { key: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { key: 'UmmAlQura', label: 'Umm al-Qura, Makkah' },
  { key: 'Dubai', label: 'Dubai' },
  { key: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  { key: 'NorthAmerica', label: 'ISNA, North America' },
  { key: 'Turkey', label: 'Diyanet, Turkey' },
];

export function SettingsScreen() {
  const calculationMethod = useSettingsStore((s) => s.calculationMethod);
  const madhab = useSettingsStore((s) => s.madhab);
  const use24Hour = useSettingsStore((s) => s.use24HourClock);
  const setCalculationMethod = useSettingsStore((s) => s.setCalculationMethod);
  const setMadhab = useSettingsStore((s) => s.setMadhab);
  const setUse24HourClock = useSettingsStore((s) => s.setUse24HourClock);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>Calculation method</Text>
        {METHODS.map((m) => (
          <OptionRow
            key={m.key}
            label={m.label}
            selected={calculationMethod === m.key}
            onPress={() => setCalculationMethod(m.key)}
          />
        ))}

        <Text style={styles.section}>Asr calculation (madhab)</Text>
        {(['shafi', 'hanafi'] as MadhabPreference[]).map((m) => (
          <OptionRow
            key={m}
            label={m === 'shafi' ? 'Standard (Shafi\u2019i, Maliki, Hanbali)' : 'Hanafi'}
            selected={madhab === m}
            onPress={() => setMadhab(m)}
          />
        ))}

        <Text style={styles.section}>Clock format</Text>
        <OptionRow label="12-hour" selected={!use24Hour} onPress={() => setUse24HourClock(false)} />
        <OptionRow label="24-hour" selected={use24Hour} onPress={() => setUse24HourClock(true)} />
      </ScrollView>
    </SafeAreaView>
  );
}

function OptionRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.row, selected && styles.rowSelected]} onPress={onPress}>
      <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]}>{label}</Text>
      {selected ? <View style={styles.dot} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.sand },
  content: { padding: spacing(5), paddingBottom: spacing(12) },
  section: {
    fontSize: 13,
    fontFamily: type.family.sansSemibold,
    color: color.inkMuted,
    marginTop: spacing(6),
    marginBottom: spacing(2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3.5),
    marginBottom: spacing(1.5),
  },
  rowSelected: { backgroundColor: color.jadeLight },
  rowLabel: { fontSize: 14, color: color.ink },
  rowLabelSelected: { fontFamily: type.family.sansSemibold, color: color.jade },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.jade },
});
