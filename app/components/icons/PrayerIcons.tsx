import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import type { PrayerName } from "@/types/prayer";

interface Props {
  name: PrayerName;
  color: string;
  size?: number;
}

/**
 * One SVG per prayer, matching the shapes used in the original design
 * mockup — kept as simple, literal strokes rather than icon-font glyphs so
 * they inherit `color` cleanly for the active/inactive row states.
 */
export function PrayerIcon({ name, color, size = 16 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
  };

  switch (name) {
    case "fajr":
      return (
        <Svg {...common}>
          <Path d="M12 3v5M5 12H3m18 0h-2M6 18l-1 1m14-1 1 1M12 21v-3" />
          <Circle cx="12" cy="12" r="4" />
        </Svg>
      );
    case "sunrise":
      return (
        <Svg {...common}>
          <Path d="M5 18h14M12 4v3M6 8l1.5 1.5M18 8l-1.5 1.5" />
          <Circle cx="12" cy="12" r="3.2" />
        </Svg>
      );
    case "dhuhr":
      return (
        <Svg {...common}>
          <Circle cx="12" cy="12" r="5" />
          <Path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </Svg>
      );
    case "asr":
      return (
        <Svg {...common}>
          <Path d="M4 18h16M12 5a7 7 0 0 1 7 7H5a7 7 0 0 1 7-7Z" />
        </Svg>
      );
    case "maghrib":
      return (
        <Svg {...common}>
          <Path d="M4 18h16M4 14a8 8 0 0 1 16 0" />
        </Svg>
      );
    case "isha":
      return (
        <Svg {...common}>
          <Path d="M17 3a7 7 0 1 0 4 12.6A9 9 0 1 1 17 3Z" />
        </Svg>
      );
  }
}
