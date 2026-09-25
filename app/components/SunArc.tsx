import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  /** 0 = sunrise, 1 = sunset, values outside [0,1] mean it's night. */
  dayProgress: number;
}

/** Simple decorative arc showing roughly where the sun sits between sunrise and sunset. */
export function SunArc({ width = 296, height = 34, dayProgress }: Props) {
  const isDaytime = dayProgress >= 0 && dayProgress <= 1;
  const clamped = Math.min(1, Math.max(0, dayProgress));

  // Quadratic arc from (4, 30) through apex (width/2, -20) to (width-4, 30)
  const t = clamped;
  const x0 = 4;
  const x1 = width / 2;
  const x2 = width - 4;
  const y0 = 30;
  const y1 = -20;
  const y2 = 30;

  const sunX = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
  const sunY = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;

  if (!isDaytime) return null;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path
        d={`M${x0} ${y0} Q${x1} ${y1} ${x2} ${y2}`}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={2}
        fill="none"
        strokeDasharray="1 7"
        strokeLinecap="round"
      />
      <Circle cx={sunX} cy={sunY} r={6} fill="#F2B15A" />
    </Svg>
  );
}
