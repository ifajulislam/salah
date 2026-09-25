import "./global.css"
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts as usePlusJakarta,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  useFonts as useNotoNaskh,
  NotoNaskhArabic_700Bold,
} from "@expo-google-fonts/noto-naskh-arabic";
import * as SplashScreen from "expo-splash-screen";

import { RootNavigator } from "@/navigation/RootNavigator";
import { useSettingsStore } from "@/store/useSettingsStore";

SplashScreen.preventAutoHideAsync().catch(() => {
  // No-op: if this fails the splash just hides on its own, which is fine.
});

export default function App() {
  const [latinLoaded] = usePlusJakarta({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_800ExtraBold,
  });
  const [arabicLoaded] = useNotoNaskh({ NotoNaskhArabic_700Bold });
  const hydrated = useSettingsStore((s) => s.hydrated);
  const hydrate = useSettingsStore((s) => s.hydrate);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  const fontsReady = latinLoaded && arabicLoaded;
  const ready = fontsReady && hydrated;

  React.useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
