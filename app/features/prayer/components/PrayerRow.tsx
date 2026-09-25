import { Text, View } from "react-native";
import type { PrayerTime } from "@/features/prayer/types/prayer";
import { formatTime } from "@/utils/date";
import { PrayerIcon } from "@/components/icons/PrayerIcons";

interface Props {
  prayer: PrayerTime;
  status: "passed" | "active" | "upcoming";
  use24Hour: boolean;
}

export function PrayerRow({ prayer, status, use24Hour }: Props) {
  const isActive = status === "active";

  return (
    <View
      className={`flex-row items-center gap-3.5 px-3.5 pr-4 mb-2.5 py-2 ${
        isActive
          ? "bg-jade rounded-tl-[26px] rounded-tr-[26px] rounded-br-[12px] rounded-bl-[26px]"
          : "bg-surface rounded-[22px]"
      }`}
    >
      <View
        className={`size-11 rounded-2xl items-center justify-center ${
          isActive ? "bg-white/[0.18]" : "bg-jade-light"
        }`}
      >
        <PrayerIcon name={prayer.name} color={isActive ? "#fff" : "#0B4F3F"} />
      </View>
      <View className="flex-1">
        <Text
          className={`text-[15px] font-sans-semibold ${isActive ? "text-white" : "text-ink"}`}
        >
          {prayer.label}
        </Text>
        <Text
          className={`text-[13px] -mt-1 font-arabic ${isActive ? "text-white/70" : "text-ink-muted"}`}
        >
          {prayer.labelArabic}
        </Text>
      </View>
      <View className="items-end">
        <Text
          className={`text-base font-sans-bold ${isActive ? "text-white" : "text-ink"}`}
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {formatTime(prayer.date, use24Hour)}
        </Text>
        <Text
          className={`text-[11px] mt-0.5 ${isActive ? "text-white/65" : "text-[#B7B2A3]"}`}
        >
          {status === "passed"
            ? "passed"
            : status === "active"
              ? "up next"
              : "upcoming"}
        </Text>
      </View>
    </View>
  );
}
