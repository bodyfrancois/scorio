import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function IconHistory({ size = 22, color = 'black' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M2.74902 10.996C2.74902 12.627 3.2327 14.2215 4.13888 15.5777C5.04507 16.9339 6.33306 17.9909 7.83999 18.6151C9.34692 19.2393 11.0051 19.4026 12.6049 19.0844C14.2046 18.7662 15.6741 17.9808 16.8274 16.8274C17.9808 15.6741 18.7662 14.2046 19.0844 12.6049C19.4026 11.0051 19.2393 9.34692 18.6151 7.83999C17.9909 6.33306 16.9339 5.04507 15.5777 4.13888C14.2215 3.2327 12.627 2.74902 10.996 2.74902C8.69044 2.7577 6.47752 3.65731 4.81992 5.25976L2.74902 7.33065" stroke={color} strokeWidth="1.83265" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M2.74902 2.74902V7.33065H7.33065" stroke={color} strokeWidth="1.83265" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10.9958 6.41431V10.9959L14.6612 12.8286" stroke={color} strokeWidth="1.83265" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}
