import { Text, View } from "react-native";
import { color } from "@/theme/tokens";
import { formatTime } from "@/utils/date";
import { PrayerIcon } from "@/components/icons/PrayerIcons";

interface Props {
  sunrise: Date;
  sunset: Date;
  use24Hour: boolean;
}

export function SunTimesCard({ sunrise, sunset, use24Hour }: Props) {
  return (
    <View className="flex-row rounded-[22px] bg-surface">
      <View className="flex-1 flex-row items-center gap-3 p-3.5">
        <View className="h-[38px] w-[38px] items-center justify-center rounded-xl bg-jade-light">
          <PrayerIcon name="sunrise" color={color.jade} />
        </View>
        <View>
          <Text className="font-sans-semibold text-[13px] text-ink-muted">
            Sunrise
          </Text>
          <Text
            className="font-sans-bold text-[15px] text-ink"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatTime(sunrise, use24Hour)}
          </Text>
        </View>
      </View>

      <View className="w-px bg-hairline" />

      <View className="flex-1 flex-row items-center gap-3 p-3.5">
        <View className="h-[38px] w-[38px] items-center justify-center rounded-xl bg-jade-light">
          <PrayerIcon name="maghrib" color={color.jade} />
        </View>
        <View>
          <Text className="font-sans-semibold text-[13px] text-ink-muted">
            Sunset
          </Text>
          <Text
            className="font-sans-bold text-[15px] text-ink"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatTime(sunset, use24Hour)}
          </Text>
        </View>
      </View>
    </View>
  );
}
