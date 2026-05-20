import React, { useRef } from 'react';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

export type DiceType = 'D4' | 'D6' | 'D8' | 'D10' | 'D12' | 'D20';

interface DiceShapeProps {
  type: DiceType;
  value: number | null;
  size: number;
  color: string;
  textColor?: string;
}

const DOT_R   = 7;
const DOT_CLR = '#1A1A2E';

// ── Classic pip positions (100×100 viewBox, face x=4–89 / center x=47) ───────

const D6_PIPS: Record<number, [number, number][]> = {
  1: [[47, 47]],
  2: [[65, 30], [29, 65]],
  3: [[65, 30], [47, 47], [29, 65]],
  4: [[29, 30], [65, 30], [29, 65], [65, 65]],
  5: [[29, 30], [65, 30], [47, 47], [29, 65], [65, 65]],
  6: [[29, 30], [65, 30], [29, 47], [65, 47], [29, 65], [65, 65]],
};

const D4_PIPS: Record<number, [number, number][]> = {
  1: [[47, 47]],
  2: [[32, 47], [62, 47]],
  3: [[47, 30], [32, 63], [62, 63]],
  4: [[32, 30], [62, 30], [32, 64], [62, 64]],
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function DiceShape({ type, value, size, color }: DiceShapeProps) {
  const gradId = useRef(`face_${Math.random().toString(36).slice(2)}`).current;
  const isUnrolled = value === null;

  // D4 and D6 show pips when rolled; others always show a number
  const showPips = !isUnrolled && (type === 'D4' || type === 'D6');
  const showText = !showPips;

  const pips = showPips
    ? (type === 'D6' ? (D6_PIPS[value!] ?? []) : (D4_PIPS[value!] ?? []))
    : [];

  const disp     = isUnrolled ? '?' : String(value!);
  const twoDigit = !isUnrolled && disp.length > 1;
  const numSize  = twoDigit ? '26' : '34';
  const numY     = twoDigit ? '54' : '59';

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#EFEFEF" />
        </LinearGradient>
      </Defs>

      {/* Drop shadow */}
      <Rect x="8" y="10" width="85" height="85" rx="18" fill="rgba(0,0,0,0.13)" />

      {/* Bottom-right edge — 3D depth */}
      <Rect x="7" y="7" width="85" height="85" rx="18" fill="#CCCCCC" />

      {/* Main white face */}
      <Rect x="4" y="4" width="85" height="85" rx="18" fill={`url(#${gradId})`} />

      {/* Pips (D4 / D6) */}
      {showPips && pips.map(([cx, cy], i) => (
        <Circle key={i} cx={cx} cy={cy} r={DOT_R} fill={DOT_CLR} />
      ))}

      {/* Number or "?" */}
      {showText && (
        <SvgText
          x="47" y={numY}
          textAnchor="middle"
          fontSize={numSize}
          fontWeight="900"
          fill={isUnrolled ? color : DOT_CLR}
          fontFamily="System"
        >
          {disp}
        </SvgText>
      )}

    </Svg>
  );
}
