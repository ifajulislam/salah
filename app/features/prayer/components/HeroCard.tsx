import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { CountdownRing } from "../../../components/CountdownRing";
import { skyGradients, prohibitedGradient, SkyPeriod } from "@/theme/tokens";
import type {
  PrayerTime,
  ProhibitedWindow,
} from "@/features/prayer/types/prayer";
import { useCountdown } from "@/hooks/useCountdown";
import { formatTime } from "@/utils/date";
import { SunArc } from "./SunArc";

interface Props {
  current: PrayerTime;
  next: PrayerTime;
  skyPeriod: SkyPeriod;
  prohibited: ProhibitedWindow | null;
  use24Hour: boolean;
  sunrise: Date;
  sunset: Date;
  now: Date;
}

export function HeroCard({
  current,
  next,
  skyPeriod,
  prohibited,
  use24Hour,
  sunrise,
  sunset,
  now,
}: Props) {
  const countdown = useCountdown(next.date, current.date);

  const dayProgress =
    (now.getTime() - sunrise.getTime()) /
    (sunset.getTime() - sunrise.getTime());

  const gradient = prohibited ? prohibitedGradient : skyGradients[skyPeriod];

  return (
    <View className="overflow-hidden rounded-tl-[44px] rounded-tr-[44px] rounded-br-[28px] rounded-bl-[44px]">
      <LinearGradient
        colors={gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View className="p-6">
        <Text className="text-[13px] font-sans-semibold text-white/75">
          {prohibited
            ? `Prohibited \u00b7 ${prohibited.label}`
            : "Current prayer"}
        </Text>

        <View className="mt-1 flex-row items-baseline gap-2.5">
          <Text className="text-[34px] font-sans-bold tracking-[-0.5px] text-white">
            {current.label}
          </Text>
          <Text className="font-arabic text-[26px] text-white/85">
            {current.labelArabic}
          </Text>
        </View>

        <Text className="mt-0.5 text-[15px] text-white/85">
          since {formatTime(current.date, use24Hour)}
        </Text>

        <View className="mt-[22px] flex-row items-center gap-3.5">
          <CountdownRing
            size={64}
            strokeWidth={6}
            progress={countdown.progress}
          />
          <Text className="text-[15px] font-sans-semibold text-white">
            {countdown.label}{" "}
            <Text className="font-sans text-white/70">until {next.label}</Text>
          </Text>
        </View>

        <View className="mt-5">
          <SunArc dayProgress={dayProgress} />
        </View>
      </View>
    </View>
  );
}
