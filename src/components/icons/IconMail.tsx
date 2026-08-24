import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function IconMail({ size = 22, color = 'black' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke={color} strokeWidth="1.83265" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth="1.83265" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}
