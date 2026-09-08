import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { requestGpsLocation, searchCities, toLocationSource, LocationPermissionDeniedError, type CitySearchResult } from '@/lib/location';
import { useSettingsStore } from '@/store/useSettingsStore';
import { color, radius, spacing, type } from '@/theme/tokens';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'LocationSetup'>;

export function LocationSetupScreen() {
  const navigation = useNavigation<Nav>();
  const setLocation = useSettingsStore((s) => s.setLocation);

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const handleUseGps = useCallback(async () => {
    setGpsLoading(true);
    setGpsError(null);
    try {
      const location = await requestGpsLocation();
      setLocation(location);
      navigation.goBack();
    } catch (err) {
      if (err instanceof LocationPermissionDeniedError) {
        setGpsError('Location permission was denied. You can search for your city below instead.');
      } else {
        setGpsError('Couldn\u2019t get your location right now. Try searching for your city instead.');
      }
    } finally {
      setGpsLoading(false);
    }
  }, [navigation, setLocation]);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const found = await searchCities(text);
      setResults(found);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handlePickCity = useCallback(
    (result: CitySearchResult) => {
      setLocation(toLocationSource(result));
      navigation.goBack();
    },
    [navigation, setLocation],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>Set your location</Text>
        <Text style={styles.subtitle}>
          Used only to calculate accurate prayer times. Location access is entirely optional.
        </Text>

        <TouchableOpacity style={styles.gpsButton} onPress={handleUseGps} disabled={gpsLoading}>
          {gpsLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.gpsButtonLabel}>Use my current location</Text>
          )}
        </TouchableOpacity>
        {gpsError ? <Text style={styles.error}>{gpsError}</Text> : null}

        <Text style={styles.orLabel}>or search for a city</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Istanbul, Jakarta, Toronto"
          placeholderTextColor={color.inkMuted}
          value={query}
          onChangeText={handleSearch}
          autoCorrect={false}
        />

        {searching ? <ActivityIndicator style={{ marginTop: spacing(3) }} color={color.jade} /> : null}

        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.name}-${item.country}-${index}`}
          contentContainerStyle={{ paddingTop: spacing(2) }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultRow} onPress={() => handlePickCity(item)}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultMeta}>
                {[item.admin1, item.country].filter(Boolean).join(', ')}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.sand },
  content: { flex: 1, padding: spacing(5) },
  title: { fontSize: 24, fontFamily: type.family.sansBold, color: color.ink },
  subtitle: { fontSize: 14, color: color.inkMuted, marginTop: spacing(1.5), lineHeight: 20 },
  gpsButton: {
    backgroundColor: color.jade,
    borderRadius: radius.md,
    paddingVertical: spacing(4),
    alignItems: 'center',
    marginTop: spacing(6),
  },
  gpsButtonLabel: { color: '#fff', fontFamily: type.family.sansSemibold, fontSize: 15 },
  error: { color: color.danger, fontSize: 13, marginTop: spacing(2) },
  orLabel: {
    textAlign: 'center',
    color: color.inkMuted,
    fontSize: 13,
    marginTop: spacing(5),
    marginBottom: spacing(3),
  },
  input: {
    backgroundColor: color.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3.5),
    fontSize: 15,
    color: color.ink,
  },
  resultRow: {
    paddingVertical: spacing(3),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.hairline,
  },
  resultName: { fontSize: 15, fontFamily: type.family.sansSemibold, color: color.ink },
  resultMeta: { fontSize: 12, color: color.inkMuted, marginTop: 2 },
});
