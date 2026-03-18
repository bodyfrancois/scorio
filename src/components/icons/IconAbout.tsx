import React from 'react';
import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';

export default function IconAbout({ size = 22, color = 'black' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <G clipPath="url(#clip_about)">
        <Path d="M10.9959 20.1592C16.0566 20.1592 20.1592 16.0566 20.1592 10.9959C20.1592 5.93517 16.0566 1.83264 10.9959 1.83264C5.93517 1.83264 1.83264 5.93517 1.83264 10.9959C1.83264 16.0566 5.93517 20.1592 10.9959 20.1592Z" stroke={color} strokeWidth="1.83265" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M10.9958 14.6612V10.9958" stroke={color} strokeWidth="1.83265" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M10.9958 7.33057H11.0058" stroke={color} strokeWidth="1.83265" strokeLinecap="round" strokeLinejoin="round"/>
      </G>
      <Defs>
        <ClipPath id="clip_about">
          <Rect width="21.9918" height="21.9918" fill="white"/>
        </ClipPath>
      </Defs>
    </Svg>
  );
}
