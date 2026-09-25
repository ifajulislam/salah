import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SunTimesCard } from "@/features/prayer/components/SunTimesCard";
import { HeroCard } from "@/features/prayer/components/HeroCard";
import { useNow } from "@/hooks/useNow";
import { formatGregorian, formatHijri } from "@/utils/date";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { color } from "@/theme/tokens";
import { useSettingsStore } from "@/features/settings/store/useSettingsStore";
import { PinIcon } from "@/features/prayer/components/icons/PinIcon";
import { PrayerRow } from "@/features/prayer/components/PrayerRow";
import { usePrayerTimes } from "@/features/prayer/hooks/usePrayerTimes";
import { ProhibitedTimesCard } from "@/features/prayer/components/ProhibitedTimesCard";
import { getActiveProhibitedWindow } from "@/features/prayer/lib/calculation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const location = useSettingsStore((state) => state.location);
  const use24Hour = useSettingsStore((state) => state.use24HourClock);
  const now = useNow(1000);

  const { status, today, current, next, skyPeriod } = usePrayerTimes();

  // I check for all required data points before rendering to prevent runtime crashes.
  // Returning early like this keeps the main layout clean and secure.
  if (status === "no-location" || !today || !current || !next) {
    return (
      <SafeAreaView className="flex-1 justify-center bg-stone-100 p-8">
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold text-slate-900 mb-2">
            Where should we calculate from?
          </Text>
          <Text className="text-base text-slate-600 leading-6 mb-4">
            Share your location for automatic, precise times, or search for your
            city instead.
          </Text>

          {/* I use Pressable instead of Text onTouchEnd because it handles mobile touch events much more reliably. */}
          <Pressable
            onPress={() => navigation.navigate("LocationSetup")}
            className="self-start"
          >
            <Text className="text-base font-semibold text-teal-600">
              Set location
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const sunrise =
    today.prayers.find((p) => p.name === "sunrise")?.date ?? new Date();
  const sunset =
    today.prayers.find((p) => p.name === "maghrib")?.date ?? new Date();
  const activeProhibited = getActiveProhibitedWindow(today, now);

  return (
    <SafeAreaView className="flex-1 bg-stone-100" edges={["top"]}>
      <ScrollView
        contentContainerClassName="p-5 pb-24"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-start mb-4">
          <View>
            <Text className="text-2xl font-bold text-slate-900">
              {location?.city ?? "Unknown"}
            </Text>
            <Text className="text-sm text-slate-600 mt-1">
              {formatHijri(now) ? `${formatHijri(now)} \u00b7 ` : ""}
              {formatGregorian(now)}
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate("LocationSetup")}
            className="w-10 h-10 rounded-xl bg-slate-200 items-center justify-center active:opacity-70"
          >
            <PinIcon color={color.ink} size={18} />
          </Pressable>
        </View>

        <HeroCard
          current={current}
          next={next}
          skyPeriod={skyPeriod ?? "dhuhr"}
          prohibited={activeProhibited}
          use24Hour={use24Hour}
          sunrise={sunrise}
          sunset={sunset}
          now={now}
        />

        <View className="mt-4">
          <SunTimesCard
            sunrise={sunrise}
            sunset={sunset}
            use24Hour={use24Hour}
          />
        </View>

        <Text className="text-sm font-semibold text-slate-500 mt-6 mb-2">
          Prohibited times
        </Text>
        <ProhibitedTimesCard
          windows={today.prohibited}
          activeWindow={activeProhibited}
          use24Hour={use24Hour}
        />

        <Text className="text-sm font-semibold text-slate-500 mt-6 mb-2">
          Today
        </Text>

        {today.prayers
          .filter((p) => p.name !== "sunrise")
          .map((prayer) => {
            const rowStatus =
              prayer.name === current.name
                ? "active"
                : prayer.date.getTime() < now.getTime()
                  ? "passed"
                  : "upcoming";

            return (
              <PrayerRow
                key={prayer.name}
                prayer={prayer}
                status={rowStatus}
                use24Hour={use24Hour}
              />
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}
