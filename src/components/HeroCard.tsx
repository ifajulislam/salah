import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CountdownRing } from "./CountdownRing";
import { SunArc } from "./SunArc";
import {
  radius,
  skyGradients,
  spacing,
  type,
  SkyPeriod,
} from "@/theme/tokens";
import type { PrayerTime } from "@/types/prayer";
import { useCountdown } from "@/hooks/useCountdown";
import { formatTime } from "@/utils/date";

interface Props {
  current: PrayerTime;
  next: PrayerTime;
  skyPeriod: SkyPeriod;
  use24Hour: boolean;
  sunrise: Date;
  sunset: Date;
  now: Date;
}

export function HeroCard({
  current,
  next,
  skyPeriod,
  use24Hour,
  sunrise,
  sunset,
  now,
}: Props) {
  const countdown = useCountdown(next.date, current.date);

  const dayProgress =
    (now.getTime() - sunrise.getTime()) /
    (sunset.getTime() - sunrise.getTime());

  return (
    <LinearGradient
      colors={skyGradients[skyPeriod]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.eyebrow}>Current prayer</Text>
      <View style={styles.nameRow}>
        <Text style={styles.enName}>{current.label}</Text>
        <Text style={styles.arName}>{current.labelArabic}</Text>
      </View>
      <Text style={styles.time}>
        since {formatTime(current.date, use24Hour)}
      </Text>

      <View style={styles.countdownRow}>
        <CountdownRing
          size={64}
          strokeWidth={6}
          progress={countdown.progress}
        />
        <Text style={styles.countdownLabel}>
          {countdown.label}{" "}
          <Text style={styles.countdownSub}>until {next.label}</Text>
        </Text>
      </View>

      <View style={styles.arcWrap}>
        <SunArc dayProgress={dayProgress} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderTopLeftRadius: radius.heroCorners[0],
    borderTopRightRadius: radius.heroCorners[1],
    borderBottomRightRadius: radius.heroCorners[2],
    borderBottomLeftRadius: radius.heroCorners[3],
    padding: spacing(6),
    paddingBottom: spacing(6),
    overflow: "hidden",
  },
  eyebrow: {
    color: "rgba(255,255,255,0.75)",
    fontSize: type.scale.label,
    fontFamily: type.family.sansSemibold,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing(2.5),
    marginTop: spacing(1),
  },
  enName: {
    color: "#fff",
    fontSize: type.scale.display,
    fontFamily: type.family.sansBold,
    letterSpacing: -0.5,
  },
  arName: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 26,
    fontFamily: type.family.arabic,
  },
  time: {
    color: "rgba(255,255,255,0.85)",
    fontSize: type.scale.body,
    marginTop: spacing(0.5),
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing(3.5),
    marginTop: spacing(5.5),
  },
  countdownLabel: {
    color: "#fff",
    fontSize: 15,
    fontFamily: type.family.sansSemibold,
  },
  countdownSub: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: type.family.sans,
    fontWeight: "400",
  },
  arcWrap: {
    marginTop: spacing(5),
  },
});
