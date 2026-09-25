import { Text, View } from "react-native";
import type { ProhibitedWindow } from "@/features/prayer/types/prayer";
import { formatTime } from "@/utils/date";

interface Props {
  windows: ProhibitedWindow[];
  activeWindow: ProhibitedWindow | null;
  use24Hour: boolean;
}

export function ProhibitedTimesCard({
  windows,
  activeWindow,
  use24Hour,
}: Props) {
  return (
    <View className="rounded-[22px] bg-surface p-1">
      {windows.map((window, index) => {
        const isActive = activeWindow?.label === window.label;
        const isLast = index === windows.length - 1;

        return (
          <View
            key={window.label}
            className={[
              "flex-row items-center justify-between rounded-2xl px-3.5 py-3",
              isActive ? "bg-danger/10" : "",
              isLast ? "" : "border-b border-hairline",
            ].join(" ")}
          >
            <View className="flex-row items-center gap-2.5">
              <View
                className={`h-2 w-2 rounded-full ${isActive ? "bg-danger" : "bg-ink-muted/40"}`}
              />
              <Text
                className={
                  isActive
                    ? "text-sm font-sans-semibold text-danger"
                    : "text-sm text-ink"
                }
              >
                {window.label}
              </Text>
            </View>

            <Text
              className={
                isActive
                  ? "text-xs font-sans-semibold text-danger"
                  : "text-xs text-ink-muted"
              }
              style={{ fontVariant: ["tabular-nums"] }}
            >
              {formatTime(window.start, use24Hour)} \u2013{" "}
              {formatTime(window.end, use24Hour)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
