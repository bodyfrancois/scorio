import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

/** Buzzer de quiz : socle gris et dôme rouge bombé. */
export default function IconBuzzer({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Ellipse cx="16" cy="24.5" rx="12.5" ry="4" fill="#64748B" />
      <Path d="M3.5 21.5v3a12.5 4 0 0 0 25 0v-3Z" fill="#475569" />
      <Ellipse cx="16" cy="21.5" rx="12.5" ry="4.2" fill="#94A3B8" />
      <Path d="M6 20.4a10 8.5 0 0 1 20 0Z" fill="#DC2626" />
      <Path d="M10.1 13.6a10 8.5 0 0 1 8.6-2.4c-3.6.5-6.5 3-7.6 6.6Z" fill="#F87171" />
      <Circle cx="16" cy="20.4" r="0" fill="none" />
    </Svg>
  );
}
