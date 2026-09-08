import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Persisted key-value storage, backed by AsyncStorage — deliberately chosen
 * over react-native-mmkv so this app runs unmodified in Expo Go. AsyncStorage
 * is async and slower than MMKV, but for settings-sized data (a few small
 * JSON blobs) that difference is irrelevant. Swap back to MMKV later if you
 * move to a dev client and want the sync API / perf win.
 */
export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    await AsyncStorage.removeItem(key);
    return null;
  }
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
